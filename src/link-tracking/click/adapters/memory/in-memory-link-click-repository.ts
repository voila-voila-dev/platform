import { DateTime, Effect, Layer } from "effect";
import { inMemoryEntityStore } from "#core/adapters/memory/in-memory-entity-store";
import type { LinkClick } from "#link-tracking/click/aggregates/link-click";
import { LinkClickRepository } from "#link-tracking/click/services/link-click-repository";
import type { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

function byClickedAt(left: LinkClick, right: LinkClick): number {
	return (
		DateTime.toEpochMillis(left.clickedAt) -
		DateTime.toEpochMillis(right.clickedAt)
	);
}

export function inMemoryLinkClickRepository() {
	const store = inMemoryEntityStore<LinkClick>((click) => click.id);

	return {
		seed: store.seed,
		values: store.values,
		layer: Layer.succeed(LinkClickRepository, {
			save: (click) => store.save(click),
			listByLinkIds: (linkIds) =>
				Effect.sync(() =>
					store
						.values()
						.filter((click) => linkIds.includes(click.linkId))
						.toSorted(byClickedAt),
				),
			countByLinkIds: (linkIds) =>
				Effect.sync(() => {
					const counts = new Map<TrackedLinkId, number>();
					const wanted = new Set(linkIds);
					for (const click of store.values()) {
						if (!wanted.has(click.linkId)) continue;
						counts.set(click.linkId, (counts.get(click.linkId) ?? 0) + 1);
					}
					return counts;
				}),
			historyByLinkId: (linkId, since) =>
				Effect.sync(() => {
					const clicks = store
						.values()
						.filter((click) => click.linkId === linkId)
						.toSorted(byClickedAt);
					const daily = new Map<string, number>();
					for (const click of clicks) {
						if (
							DateTime.toEpochMillis(click.clickedAt) <
							DateTime.toEpochMillis(since)
						)
							continue;
						const day = DateTime.formatIso(click.clickedAt).slice(0, 10);
						daily.set(day, (daily.get(day) ?? 0) + 1);
					}
					return {
						total: clicks.length,
						lastClickedAt: clicks.at(-1)?.clickedAt ?? null,
						daily: [...daily].map(([day, count]) => ({ day, count })),
					};
				}),
		}),
	};
}
