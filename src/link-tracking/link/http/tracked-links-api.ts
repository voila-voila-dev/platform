import { Schema } from "effect";
import {
	HttpApiEndpoint,
	HttpApiGroup,
	HttpApiSchema,
	OpenApi,
} from "effect/http-api";
import { AccessDeniedError } from "#core/authorization/access-denied-error";
import { TrackedLink } from "#link-tracking/link/aggregates/tracked-link";
import { TrackedLinkNotFoundError } from "#link-tracking/link/errors/tracked-link-not-found-error";
import { TrackedLinkFilter } from "#link-tracking/link/payloads/tracked-link-filter";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";
import { RateLimitedError } from "#rate-limiting/errors/rate-limited-error";
import { PagedResult } from "#search/value-objects/paged-result";
import { Pagination } from "#search/value-objects/pagination";

const AccessDenied = AccessDeniedError.pipe(HttpApiSchema.status(403));
const NotFound = TrackedLinkNotFoundError.pipe(HttpApiSchema.status(404));
const RateLimited = RateLimitedError.pipe(HttpApiSchema.status(429));

const Target = {
	label: Schema.NonEmptyString,
	destinationUrl: Schema.NonEmptyString,
};

// The application adds its authentication middleware, which provides `CurrentActor`.
export const TrackedLinksApiGroup = HttpApiGroup.make("trackedLinks")
	.annotate(OpenApi.Title, "Tracked links")
	.add(
		HttpApiEndpoint.post("search", "/search", {
			payload: Schema.Struct({
				filter: TrackedLinkFilter,
				pagination: Pagination,
			}),
			success: PagedResult(TrackedLink),
			error: [AccessDenied, RateLimited],
		}),
		HttpApiEndpoint.post("create", "/create", {
			payload: Schema.Struct(Target),
			success: TrackedLink,
			error: AccessDenied,
		}),
		HttpApiEndpoint.post("update", "/update", {
			payload: Schema.Struct({ id: TrackedLinkId, ...Target }),
			success: TrackedLink,
			error: [AccessDenied, NotFound],
		}).annotate(
			OpenApi.Description,
			"The code never changes, so a printed QR code follows the new destination.",
		),
		HttpApiEndpoint.post("archive", "/archive", {
			payload: Schema.Struct({ id: TrackedLinkId }),
			success: TrackedLink,
			error: [AccessDenied, NotFound],
		}),
	)
	.prefix("/tracked-links");
