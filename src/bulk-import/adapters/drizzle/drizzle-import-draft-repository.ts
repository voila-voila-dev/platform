import { eq, type InferSelectModel, lte } from "drizzle-orm";
import { DateTime, Effect, Layer, Option, Schema } from "effect";
import { importDraftTable } from "#bulk-import/adapters/drizzle/import-draft-table";
import { ImportDraft } from "#bulk-import/aggregates/import-draft";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { DrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";
import { query } from "#core/adapters/drizzle/query";
import { updateSetFromColumns } from "#core/adapters/drizzle/upsert-set";

type ImportDraftRow = InferSelectModel<typeof importDraftTable>;

const decodeDraft = Schema.decodeUnknownSync(ImportDraft);
const encodeDraft = Schema.encodeSync(ImportDraft);

function toRow(draft: ImportDraft): ImportDraftRow {
	return {
		id: draft.id,
		data: encodeDraft(draft),
		expiresAt: DateTime.toDate(draft.expiresAt),
		createdAt: DateTime.toDate(draft.createdAt),
		updatedAt: DateTime.toDate(draft.updatedAt),
	};
}

export const drizzleImportDraftRepository = Layer.effect(
	ImportDraftRepository,
	Effect.gen(function* () {
		const database = yield* DrizzleDatabase;

		return {
			save: (draft) =>
				query(async () => {
					await database
						.insert(importDraftTable)
						.values(toRow(draft))
						.onConflictDoUpdate({
							target: importDraftTable.id,
							set: updateSetFromColumns(importDraftTable),
						});
					return draft;
				}),
			get: (id) =>
				query(async () => {
					const [row] = await database
						.select()
						.from(importDraftTable)
						.where(eq(importDraftTable.id, id))
						.limit(1);
					return row === undefined
						? Option.none()
						: Option.some(decodeDraft(row.data));
				}),
			delete: (id) =>
				query(async () => {
					await database
						.delete(importDraftTable)
						.where(eq(importDraftTable.id, id));
				}),
			deleteExpired: (at) =>
				query(async () => {
					const deleted = await database
						.delete(importDraftTable)
						.where(lte(importDraftTable.expiresAt, DateTime.toDate(at)))
						.returning({ id: importDraftTable.id });
					return deleted.length;
				}),
		};
	}),
);
