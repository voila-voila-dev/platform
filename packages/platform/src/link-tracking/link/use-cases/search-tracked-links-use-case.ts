import { Gate } from "#core/authorization/gates";
import { TrackedLinkFilter } from "#link-tracking/link/payloads/tracked-link-filter";
import { TrackedLinkRepository } from "#link-tracking/link/services/tracked-link-repository";
import { makeSearchUseCase } from "#search/lib/make-search-use-case";

export const SearchTrackedLinksUseCase = makeSearchUseCase({
	name: "link-tracking.search-tracked-links",
	gate: Gate.staff(),
	budget: "tracked-links",
	filter: TrackedLinkFilter,
	repository: TrackedLinkRepository,
});
