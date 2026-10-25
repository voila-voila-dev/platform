import { Array as Arr, Clock, Effect, Option, Schema } from "effect";
import { ImportIntent } from "#bulk-import/aggregates/import-intent";
import { ImportColumnsMissingError } from "#bulk-import/errors/import-columns-missing-error";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import { ImportIntentNotFoundError } from "#bulk-import/errors/import-intent-not-found-error";
import { formatCsvLine } from "#bulk-import/lib/format-csv-line";
import {
	type ImportColumns,
	type ImportRecord,
	type ImportSchema,
	importColumnKeys,
	importRecordDecoder,
} from "#bulk-import/lib/import-schema";
import { decodeImportTable } from "#bulk-import/lib/import-table";
import { ImportFileFields } from "#bulk-import/payloads/import-file";
import { ImportIntentRepository } from "#bulk-import/services/import-intent-repository";
import {
	ImportLimits,
	type ImportLimitValues,
} from "#bulk-import/services/import-limits";
import type { ImportReader } from "#bulk-import/services/import-reader";
import { importFormatOf } from "#bulk-import/value-objects/import-format";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";
import type { ImportRowResult } from "#bulk-import/value-objects/import-row-result";
import { IdGeneratorService } from "#core/services/id-generator-service";
import { NonNegativeInt } from "#core/value-objects/non-negative-int";

export interface BulkImportOptions {
	// The formats this import accepts, from `/bulk-import/csv`, `/json`, `/xlsx` or the application's own.
	readonly readers: ReadonlyArray<ImportReader>;
	// Overrides the `ImportLimits` reference for this import only.
	readonly limits?: Partial<ImportLimitValues>;
}

// The row's index stays the same across retries: an import that writes by it,
// or by a natural key, can be run twice for the same row.
export interface ImportBatchEntry<S extends ImportSchema> {
	readonly index: number;
	readonly record: ImportRecord<S>;
}

function rejected(reason: ImportFileRejectedError["reason"]) {
	return Effect.fail(new ImportFileRejectedError({ reason }));
}

// The importing domain makes one per schema, and gates and records the
// requests itself: no user calls this directly.
function bind<S extends ImportSchema>(schema: S, options: BulkImportOptions) {
	const Intent = ImportIntent.schema(schema);
	const Column = Schema.Literals(importColumnKeys(schema));
	const CreatePayload = Schema.Struct(ImportFileFields);
	const EditCellPayload = Schema.Struct({
		rowIndex: NonNegativeInt,
		column: Column,
		value: Schema.String,
	});
	const decodeIntent = Schema.decodeUnknownEffect(Intent);
	const decodeRecord = importRecordDecoder(schema);

	const limits = Effect.map(Effect.service(ImportLimits), (defaults) => ({
		...defaults,
		...options.limits,
	}));

	function update(previous: ImportIntent<S>, next: ImportIntent<S>) {
		const saved: ImportIntent<S> = { ...next, version: previous.version + 1 };
		return Effect.as(
			Effect.flatMap(Effect.service(ImportIntentRepository), (repository) =>
				repository.update(saved, previous.version),
			),
			saved,
		);
	}

	function find(id: ImportIntentId) {
		return Effect.gen(function* () {
			const found = yield* (yield* ImportIntentRepository).get(id);
			// Another target's intent is not one this import can find.
			if (Option.isNone(found) || found.value.target !== schema.target)
				return yield* new ImportIntentNotFoundError({ id });
			return found.value;
		});
	}

	// Columns changed since the intent was read fail with `SchemaError`.
	function get(id: ImportIntentId) {
		return Effect.flatMap(find(id), decodeIntent);
	}

	// Hands the next batch of valid rows, decoded, to `importBatch`, which
	// answers for each entry in order. Another import holding the intent's
	// batch fails with `ImportIntentConflictError`.
	function importNextBatch<E, R>(
		id: ImportIntentId,
		importBatch: (
			batch: ReadonlyArray<ImportBatchEntry<S>>,
			intent: ImportIntent<S>,
		) => Effect.Effect<ReadonlyArray<ImportRowResult>, E, R>,
	) {
		return Effect.gen(function* () {
			const intent = yield* get(id);
			const { batchSize, batchLeaseMillis } = yield* limits;
			const claim = yield* ImportIntent.claimBatch(intent, {
				size: batchSize,
				now: yield* Clock.currentTimeMillis,
				leaseMillis: batchLeaseMillis,
			});
			const batch = yield* Effect.forEach(claim.rows, (row) =>
				Effect.map(decodeRecord(row.values), (record) => ({
					index: row.index,
					record,
				})),
			);
			const claimed = yield* update(intent, claim.intent);
			const results = yield* importBatch(batch, claimed);
			if (results.length !== batch.length)
				return yield* Effect.die(
					new Error(
						`importBatch answered ${results.length} results for ${batch.length} rows`,
					),
				);
			return yield* update(
				claimed,
				ImportIntent.recordBatch(
					claimed,
					new Map(
						Arr.zip(batch, results).map(([entry, result]) => [
							entry.index,
							result,
						]),
					),
				),
			);
		});
	}

	return {
		schema,
		Intent,
		Column,
		// Spread `.fields` to add what the importing domain needs, a segment, a source…
		CreatePayload,
		EditCellPayload,

		// A CSV of the columns' headers, for whoever fills the file.
		template: (): string =>
			`﻿${formatCsvLine(
				Object.entries(schema.columns).map(
					([key, column]) => column.label ?? key,
				),
			)}\n`,

		create: (file: typeof CreatePayload.Type) =>
			Effect.gen(function* () {
				const { maxBytes, maxRows } = yield* limits;
				if (file.content.length > maxBytes) return yield* rejected("tooLarge");

				const format = file.format ?? importFormatOf(file.fileName);
				const reader = options.readers.find(
					(candidate) => candidate.format === format,
				);
				if (reader === undefined) return yield* rejected("unsupportedFormat");

				const table = decodeImportTable(
					schema,
					yield* reader.read(file.content),
				);
				const [missing, ...moreMissing] = table.missingColumns;
				if (missing !== undefined)
					return yield* new ImportColumnsMissingError({
						columns: [missing, ...moreMissing],
					});
				if (table.rows.length === 0) return yield* rejected("empty");
				if (table.rows.length > maxRows) return yield* rejected("tooManyRows");

				const intent = ImportIntent.create(schema, {
					id: ImportIntentId.make(
						yield* (yield* IdGeneratorService).generate(),
					),
					rows: table.rows,
				});
				yield* (yield* ImportIntentRepository).insert(intent);
				return intent;
			}),

		get,

		editCell: (id: ImportIntentId, cell: typeof EditCellPayload.Type) =>
			Effect.gen(function* () {
				const intent = yield* get(id);
				return yield* update(
					intent,
					yield* ImportIntent.editCell(intent, schema, cell),
				);
			}),

		importNextBatch,

		// Imports batch after batch until none is left, for a background job.
		importAll: <E, R>(
			id: ImportIntentId,
			importBatch: Parameters<typeof importNextBatch<E, R>>[1],
		) =>
			Effect.gen(function* () {
				let intent = yield* importNextBatch(id, importBatch);
				while (intent.status !== "imported")
					intent = yield* importNextBatch(id, importBatch);
				return intent;
			}),

		discard: (id: ImportIntentId) =>
			Effect.gen(function* () {
				const intent = yield* find(id);
				yield* (yield* ImportIntentRepository).delete(intent.id);
			}),
	};
}

// Takes the schema's columns and target as written, so a `check` keeps them typed.
function make<const Target extends string, const Columns extends ImportColumns>(
	schema: ImportSchema<Target, Columns>,
	options: BulkImportOptions,
) {
	return bind(schema, options);
}

export const BulkImport = { make };

export type BulkImport<S extends ImportSchema> = ReturnType<typeof bind<S>>;
