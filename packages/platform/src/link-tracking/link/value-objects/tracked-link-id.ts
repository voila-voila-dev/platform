import { Schema } from "effect";
import { Id } from "#core/value-objects/id";

export const TrackedLinkId = Id.pipe(Schema.brand("TrackedLinkId"));

export type TrackedLinkId = typeof TrackedLinkId.Type;
