import { Schema } from "effect";
import { LinkClickId } from "#link-tracking/click/value-objects/link-click-id";
import { TrackedLinkId } from "#link-tracking/link/value-objects/tracked-link-id";

export class LinkClick extends Schema.TaggedClass<LinkClick>()("LinkClick", {
	id: LinkClickId,
	linkId: TrackedLinkId,
	userAgent: Schema.NullOr(Schema.String),
	referrer: Schema.NullOr(Schema.String),
	clickedAt: Schema.DateTimeUtc,
}) {}
