import { Effect, Schema } from "effect";
import { ImportIntentCellNotFoundError } from "#bulk-import/errors/import-intent-cell-not-found-error";
import { ImportIntentConflictError } from "#bulk-import/errors/import-intent-conflict-error";
import { ImportIntentStatusError } from "#bulk-import/errors/import-intent-status-error";
import {
	type ImportColumnKey,
	type ImportSchema,
	importColumnKeys,
	isImportColumn,
} from "#bulk-import/lib/import-schema";
import { validateImportRows } from "#bulk-import/lib/import-table";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";
import { ImportIntentStatus } from "#bulk-import/value-objects/import-intent-status";
import { ImportIssue } from "#bulk-import/value-objects/import-issue";
import type { ImportRow } from "#bulk-import/value-objects/import-row";
import { ImportRowResult } from "#bulk-import/value-objects/import-row-result";
import { NonNegativeInt } from "#core/value-objects/non-negative-int";

// The file, who asked for it, when, and what for belong to the domain that
// imports: it keeps the intent's id next to them.
export interface ImportIntent<S extends ImportSchema = ImportSchema> {
	readonly id: ImportIntentId;
	readonly target: S["target"];
	// Bumped on every save, so concurrent changes fail rather than overwrite.
	readonly version: NonNegativeInt;
	readonly status: ImportIntentStatus;
	// Until when a batch is held by the import that took it.
	readonly leasedUntil: number | null;
	readonly rows: ReadonlyArray<ImportRow<ImportColumnKey<S>>>;
}

export interface ImportSummary {
	readonly rows: number;
	readonly invalid: number;
	readonly created: number;
	readonly updated: number;
	readonly rejected: number;
	readonly remaining: number;
}

function intentSchema<
	Target extends Schema.Top,
	Column extends Schema.Top,
	Values extends Schema.Top,
>(target: Target, column: Column, values: Values) {
	return Schema.Struct({
		id: ImportIntentId,
		target,
		version: NonNegativeInt,
		status: ImportIntentStatus,
		leasedUntil: Schema.NullOr(Schema.Number),
		rows: Schema.Array(
			Schema.Struct({
				index: NonNegativeInt,
				values,
				issues: Schema.Array(
					Schema.Struct({
						column,
						issue: ImportIssue,
						message: Schema.optionalKey(Schema.String),
					}),
				),
				result: Schema.optionalKey(ImportRowResult),
			}),
		),
	});
}

function validRows<S extends ImportSchema>(
	intent: ImportIntent<S>,
): ImportIntent<S>["rows"] {
	return intent.rows.filter((row) => row.issues.length === 0);
}

function remainingRows<S extends ImportSchema>(
	intent: ImportIntent<S>,
): ImportIntent<S>["rows"] {
	return validRows(intent).filter((row) => row.result === undefined);
}

export const ImportIntent = {
	// Any target's intent, as stored.
	Stored: intentSchema(
		Schema.String,
		Schema.String,
		Schema.Record(Schema.String, Schema.String),
	) satisfies Schema.Codec<ImportIntent, unknown>,

	schema: <S extends ImportSchema>(
		schema: S,
	): Schema.Codec<ImportIntent<S>, unknown> => {
		const column = Schema.Literals(importColumnKeys(schema));
		return intentSchema(
			Schema.Literal<S["target"]>(schema.target),
			column,
			Schema.Record(column, Schema.String),
		);
	},

	create: <S extends ImportSchema>(
		schema: S,
		input: {
			readonly id: ImportIntentId;
			readonly rows: ImportIntent<S>["rows"];
		},
	): ImportIntent<S> => ({
		id: input.id,
		target: schema.target,
		version: 0,
		status: "reviewing",
		leasedUntil: null,
		rows: input.rows,
	}),

	validRows,

	summary: (intent: ImportIntent): ImportSummary => {
		const valid = validRows(intent);
		function count(kept: (row: ImportRow) => boolean) {
			return valid.filter(kept).length;
		}
		return {
			rows: intent.rows.length,
			invalid: intent.rows.length - valid.length,
			created: count((row) => row.result === "created"),
			updated: count((row) => row.result === "updated"),
			rejected: count(
				(row) => typeof row.result === "object" && "rejected" in row.result,
			),
			remaining: count((row) => row.result === undefined),
		};
	},

	editCell: <S extends ImportSchema>(
		intent: ImportIntent<S>,
		schema: S,
		cell: {
			readonly rowIndex: number;
			readonly column: ImportColumnKey<S>;
			readonly value: string;
		},
	): Effect.Effect<
		ImportIntent<S>,
		ImportIntentStatusError | ImportIntentCellNotFoundError
	> => {
		if (intent.status !== "reviewing")
			return Effect.fail(
				new ImportIntentStatusError({ id: intent.id, status: intent.status }),
			);
		if (
			!isImportColumn(schema, cell.column) ||
			!intent.rows.some((row) => row.index === cell.rowIndex)
		)
			return Effect.fail(
				new ImportIntentCellNotFoundError({ id: intent.id, ...cell }),
			);
		const rows = intent.rows.map((row) =>
			row.index === cell.rowIndex
				? { ...row, values: { ...row.values, [cell.column]: cell.value } }
				: row,
		);
		return Effect.succeed({
			...intent,
			rows: validateImportRows(schema, rows),
		});
	},

	// Takes the next valid rows not imported yet, held until `now + leaseMillis`.
	claimBatch: <S extends ImportSchema>(
		intent: ImportIntent<S>,
		batch: {
			readonly size: number;
			readonly now: number;
			readonly leaseMillis: number;
		},
	): Effect.Effect<
		{
			readonly intent: ImportIntent<S>;
			readonly rows: ImportIntent<S>["rows"];
		},
		ImportIntentStatusError | ImportIntentConflictError
	> => {
		if (intent.status === "imported")
			return Effect.fail(
				new ImportIntentStatusError({ id: intent.id, status: intent.status }),
			);
		if (intent.leasedUntil !== null && intent.leasedUntil > batch.now)
			return Effect.fail(new ImportIntentConflictError({ id: intent.id }));
		return Effect.succeed({
			intent: {
				...intent,
				status: "importing",
				leasedUntil: batch.now + batch.leaseMillis,
			},
			rows: remainingRows(intent).slice(0, batch.size),
		});
	},

	recordBatch: <S extends ImportSchema>(
		intent: ImportIntent<S>,
		results: ReadonlyMap<number, ImportRowResult>,
	): ImportIntent<S> => {
		const rows = intent.rows.map((row) => {
			const result = results.get(row.index);
			return result === undefined ? row : { ...row, result };
		});
		const recorded = { ...intent, rows, leasedUntil: null };
		return {
			...recorded,
			status: remainingRows(recorded).length === 0 ? "imported" : "importing",
		};
	},
};
