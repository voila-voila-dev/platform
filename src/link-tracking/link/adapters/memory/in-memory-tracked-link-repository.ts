import { Effect, Layer } from "effect";
import { inMemoryEntityStore } from "#core/adapters/memory/in-memory-entity-store";
import type { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";
import { sortAndPageInMemory } from "#search/adapters/memory/sort-and-page-in-memory";

export function inMemoryTrackedLinkRepository() {
	const store = inMemoryEntityStore<TrackedLink>((link) => link.id);

	return {
		seed: store.seed,
		values: store.values,
		layer: Layer.succeed(TrackedLinkRepository, {
			save: (link) => store.save(link),
			get: (id) => store.get(id),
			findByCode: (code) => store.findFirst((link) => link.code === code),
			listByContext: (context) =>
				store.findAll((link) => link.context === context),
			search: (filter, pagination) =>
				Effect.sync(() => {
					const search = filter.search?.toLowerCase();
					const results = store.values().filter((link) => {
						if (link.label === null) return false;
						if (filter.includeArchived !== true && link.isArchived)
							return false;
						if (search === undefined) return true;
						return (
							link.label.toLowerCase().includes(search) ||
							link.destinationUrl.toLowerCase().includes(search)
						);
					});
					return sortAndPageInMemory(results, {}, pagination);
				}),
		}),
	};
}
