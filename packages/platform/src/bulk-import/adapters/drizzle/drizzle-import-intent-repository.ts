import { and, eq } from "drizzle-orm";
import { Effect, Layer, Option, Schema } from "effect";
import { importIntentTable } from "#bulk-import/adapters/drizzle/import-intent-table";
import { ImportIntent } from "#bulk-import/aggregates/import-intent";
import { ImportIntentConflictError } from "#bulk-import/errors/import-intent-conflict-error";
import { ImportIntentRepository } from "#bulk-import/services/import-intent-repository";
import { DrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";
import { query } from "#core/adapters/drizzle/query";

const decodeIntent = Schema.decodeUnknownSync(ImportIntent.Stored);
const encodeIntent = Schema.encodeSync(ImportIntent.Stored);

export const drizzleImportIntentRepository = Layer.effect(
	ImportIntentRepository,
	Effect.gen(function* () {
		const database = yield* DrizzleDatabase;

		return {
			insert: (intent) =>
				query(async () => {
					await database.insert(importIntentTable).values({
						id: intent.id,
						version: intent.version,
						data: encodeIntent(intent),
					});
				}),
			update: (intent, expectedVersion) =>
				Effect.flatMap(
					query(() =>
						database
							.update(importIntentTable)
							.set({ version: intent.version, data: encodeIntent(intent) })
							.where(
								and(
									eq(importIntentTable.id, intent.id),
									eq(importIntentTable.version, expectedVersion),
								),
							)
							.returning({ id: importIntentTable.id }),
					),
					(updated) =>
						updated.length === 0
							? Effect.fail(new ImportIntentConflictError({ id: intent.id }))
							: Effect.void,
				),
			get: (id) =>
				query(async () => {
					const [row] = await database
						.select()
						.from(importIntentTable)
						.where(eq(importIntentTable.id, id))
						.limit(1);
					return row === undefined
						? Option.none()
						: Option.some(decodeIntent(row.data));
				}),
			delete: (id) =>
				query(async () => {
					await database
						.delete(importIntentTable)
						.where(eq(importIntentTable.id, id));
				}),
		};
	}),
);
