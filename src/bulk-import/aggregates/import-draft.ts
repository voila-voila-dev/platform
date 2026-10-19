import { DateTime, Effect, Schema } from "effect";
import { ImportDraftAlreadyImportedError } from "#bulk-import/errors/import-draft-already-imported-error";
import { ImportDraftNotEditableError } from "#bulk-import/errors/import-draft-not-editable-error";
import {
	type ImportSchema,
	revalidateImportRows,
	validImportRows,
} from "#bulk-import/lib/import-schema";
import { ImportRow } from "#bulk-import/payloads/import-row";
import { ImportDraftId } from "#bulk-import/value-objects/import-draft-id";
import { ImportDraftStatus } from "#bulk-import/value-objects/import-draft-status";
import { ImportFormat } from "#bulk-import/value-objects/import-format";
import {
	addImportOutcome,
	emptyImportOutcome,
	ImportOutcome,
} from "#bulk-import/value-objects/import-outcome";
import { ImportTarget } from "#bulk-import/value-objects/import-target";
import { UserId } from "#core/value-objects/user-id";

function expiryFrom(now: DateTime.Utc, lifetimeDays: number): DateTime.Utc {
	return DateTime.add(now, { days: lifetimeDays });
}

export class ImportDraft extends Schema.TaggedClass<ImportDraft>()(
	"ImportDraft",
	{
		id: ImportDraftId,
		target: ImportTarget,
		targetId: Schema.NullOr(Schema.String),
		targetLabel: Schema.NullOr(Schema.String),
		createdByUserId: Schema.NullOr(UserId),
		fileName: Schema.String,
		format: ImportFormat,
		rows: Schema.Array(ImportRow),
		missingColumns: Schema.Array(Schema.String),
		status: ImportDraftStatus,
		importedRowCount: Schema.Int,
		outcome: ImportOutcome,
		expiresAt: Schema.DateTimeUtcFromString,
		importedAt: Schema.NullOr(Schema.DateTimeUtcFromString),
		createdAt: Schema.DateTimeUtcFromString,
		updatedAt: Schema.DateTimeUtcFromString,
	},
) {
	static create(input: {
		readonly id: ImportDraftId;
		readonly target: ImportTarget;
		readonly targetId: string | null;
		readonly targetLabel: string | null;
		readonly createdByUserId: UserId | null;
		readonly fileName: string;
		readonly format: ImportFormat;
		readonly rows: ReadonlyArray<ImportRow>;
		readonly missingColumns: ReadonlyArray<string>;
		readonly lifetimeDays: number;
	}): Effect.Effect<ImportDraft> {
		const { lifetimeDays, ...fields } = input;
		return Effect.map(
			DateTime.now,
			(now) =>
				new ImportDraft({
					...fields,
					status: "reviewing",
					importedRowCount: 0,
					outcome: emptyImportOutcome,
					expiresAt: expiryFrom(now, lifetimeDays),
					importedAt: null,
					createdAt: now,
					updatedAt: now,
				}),
		);
	}

	get validRows(): ReadonlyArray<ImportRow> {
		return validImportRows(this.rows);
	}

	get problemRowCount(): number {
		return this.rows.length - this.validRows.length;
	}

	get isImported(): boolean {
		return this.status === "imported";
	}

	nextBatch(size: number): ReadonlyArray<ImportRow> {
		return this.validRows.slice(
			this.importedRowCount,
			this.importedRowCount + size,
		);
	}

	editCell(input: {
		readonly schema: ImportSchema;
		readonly rowIndex: number;
		readonly column: string;
		readonly value: string;
		readonly lifetimeDays: number;
	}): Effect.Effect<ImportDraft, ImportDraftNotEditableError> {
		const self = this;
		return Effect.gen(function* () {
			if (self.status !== "reviewing")
				return yield* new ImportDraftNotEditableError({
					id: self.id,
					status: self.status,
				});
			const now = yield* DateTime.now;
			return new ImportDraft({
				...self,
				rows: revalidateImportRows(
					input.schema,
					self.rows.map((row) =>
						row.index === input.rowIndex
							? {
									...row,
									values: { ...row.values, [input.column]: input.value },
								}
							: row,
					),
					self.missingColumns,
				),
				expiresAt: expiryFrom(now, input.lifetimeDays),
				updatedAt: now,
			});
		});
	}

	recordBatch(input: {
		readonly rowCount: number;
		readonly outcome: ImportOutcome;
		readonly lifetimeDays: number;
	}): Effect.Effect<ImportDraft, ImportDraftAlreadyImportedError> {
		const self = this;
		return Effect.gen(function* () {
			if (self.isImported)
				return yield* new ImportDraftAlreadyImportedError({ id: self.id });
			const now = yield* DateTime.now;
			const importedRowCount = self.importedRowCount + input.rowCount;
			const done = importedRowCount >= self.validRows.length;
			return new ImportDraft({
				...self,
				status: done ? "imported" : "importing",
				importedRowCount,
				outcome: addImportOutcome(self.outcome, input.outcome),
				importedAt: done ? now : null,
				expiresAt: expiryFrom(now, input.lifetimeDays),
				updatedAt: now,
			});
		});
	}
}
