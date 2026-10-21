import { Effect, Layer, Option } from "effect";
import type { ImportIntent } from "#bulk-import/aggregates/import-intent";
import { ImportIntentConflictError } from "#bulk-import/errors/import-intent-conflict-error";
import { ImportIntentRepository } from "#bulk-import/services/import-intent-repository";
import { inMemoryEntityStore } from "#core/adapters/memory/in-memory-entity-store";

export function inMemoryImportIntentRepository() {
	const store = inMemoryEntityStore<ImportIntent>((intent) => intent.id);

	return {
		seed: store.seed,
		values: store.values,
		layer: Layer.succeed(ImportIntentRepository, {
			insert: (intent) => Effect.asVoid(store.save(intent)),
			update: (intent, expectedVersion) =>
				Effect.flatMap(store.get(intent.id), (stored) =>
					Option.isSome(stored) && stored.value.version === expectedVersion
						? Effect.asVoid(store.save(intent))
						: Effect.fail(new ImportIntentConflictError({ id: intent.id })),
				),
			get: (id) => store.get(id),
			delete: (id) => store.delete(id),
		}),
	};
}
