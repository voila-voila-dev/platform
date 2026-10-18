import { handleAsCurrentActor } from "#core/adapters/http-server/handle-as-current-actor";
import { ArchiveTrackedLinkUseCase } from "#link-tracking/link/use-cases/archive-tracked-link-use-case";
import { CreateTrackedLinkUseCase } from "#link-tracking/link/use-cases/create-tracked-link-use-case";
import { SearchTrackedLinksUseCase } from "#link-tracking/link/use-cases/search-tracked-links-use-case";
import { UpdateTrackedLinkUseCase } from "#link-tracking/link/use-cases/update-tracked-link-use-case";

export const trackedLinksHandlers = {
	search: handleAsCurrentActor(SearchTrackedLinksUseCase),
	create: handleAsCurrentActor(CreateTrackedLinkUseCase),
	update: handleAsCurrentActor(UpdateTrackedLinkUseCase),
	archive: handleAsCurrentActor(ArchiveTrackedLinkUseCase),
};
