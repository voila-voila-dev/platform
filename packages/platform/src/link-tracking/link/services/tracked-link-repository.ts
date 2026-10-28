import { Context, type Effect, type Option } from "effect";
import type { DatabaseError } from "#core/errors/database-error";
import type { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import type { TrackedLinkFilter } from "#link-tracking/link/payloads/tracked-link-filter";
import type { LinkCode } from "#link-tracking/link/value-objects/link-code";
import type { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";
import type { PagedResult } from "#search/value-objects/paged-result";
import type { Pagination } from "#search/value-objects/pagination";

export class TrackedLinkRepository extends Context.Service<
	TrackedLinkRepository,
	{
		readonly save: (
			link: TrackedLink,
		) => Effect.Effect<TrackedLink, DatabaseError>;
		readonly get: (
			id: TrackedLinkId,
		) => Effect.Effect<Option.Option<TrackedLink>, DatabaseError>;
		readonly findByCode: (
			code: LinkCode,
		) => Effect.Effect<Option.Option<TrackedLink>, DatabaseError>;
		readonly listByContext: (
			context: string,
		) => Effect.Effect<ReadonlyArray<TrackedLink>, DatabaseError>;
		// Managed links only: system short links have no label.
		readonly search: (
			filter: TrackedLinkFilter,
			pagination: Pagination,
		) => Effect.Effect<PagedResult<TrackedLink>, DatabaseError>;
	}
>()("@voila.dev/platform/TrackedLinkRepository") {}
