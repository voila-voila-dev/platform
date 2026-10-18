import { Schema } from "effect";
import { Id } from "#core/value-objects/id";

export const LinkClickId = Id.pipe(Schema.brand("LinkClickId"));

export type LinkClickId = typeof LinkClickId.Type;
