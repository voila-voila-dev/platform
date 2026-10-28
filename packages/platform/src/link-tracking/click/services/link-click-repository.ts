import { Context, type DateTime, type Effect } from "effect";
import type { DatabaseError } from "#core/errors/database-error";
import type { LinkClick } from "#link-tracking/click/aggregates/link-click";
import type { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

export interface LinkClickHistory {
	readonly total: number;
	readonly lastClickedAt: DateTime.Utc | null;
	// `day` is an ISO date in UTC; days without a click are absent.
	readonly daily: ReadonlyArray<{
		readonly day: string;
		readonly count: number;
	}>;
}

export class LinkClickRepository extends Context.Service<
	LinkClickRepository,
	{
		readonly save: (
			click: LinkClick,
		) => Effect.Effect<LinkClick, DatabaseError>;
		readonly listByLinkIds: (
			linkIds: ReadonlyArray<TrackedLinkId>,
		) => Effect.Effect<ReadonlyArray<LinkClick>, DatabaseError>;
		readonly countByLinkIds: (
			linkIds: ReadonlyArray<TrackedLinkId>,
		) => Effect.Effect<ReadonlyMap<TrackedLinkId, number>, DatabaseError>;
		readonly historyByLinkId: (
			linkId: TrackedLinkId,
			since: DateTime.Utc,
		) => Effect.Effect<LinkClickHistory, DatabaseError>;
	}
>()("@voila.dev/platform/LinkClickRepository") {}
