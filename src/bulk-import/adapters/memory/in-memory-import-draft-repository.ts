import { DateTime, Effect, Layer } from "effect";
import type { ImportDraft } from "#bulk-import/aggregates/import-draft";
import { ImportDraftRepository } from "#bulk-import/services/import-draft-repository";
import { inMemoryEntityStore } from "#core/adapters/memory/in-memory-entity-store";

export function inMemoryImportDraftRepository() {
	const store = inMemoryEntityStore<ImportDraft>((draft) => draft.id);

	return {
		seed: store.seed,
		values: store.values,
		layer: Layer.succeed(ImportDraftRepository, {
			save: (draft) => store.save(draft),
			get: (id) => store.get(id),
			delete: (id) => store.delete(id),
			deleteExpired: (at) =>
				Effect.gen(function* () {
					const expired = store
						.values()
						.filter((draft) =>
							DateTime.isLessThanOrEqualTo(draft.expiresAt, at),
						);
					for (const draft of expired) yield* store.delete(draft.id);
					return expired.length;
				}),
		}),
	};
}
