import { Schema } from "effect";
import { Id } from "#core/ids/id";

export const TrackedLinkId = Id.pipe(Schema.brand("TrackedLinkId"));

export type TrackedLinkId = typeof TrackedLinkId.Type;
