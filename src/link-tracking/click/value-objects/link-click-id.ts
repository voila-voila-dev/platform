import { Schema } from "effect";
import { Id } from "#core/ids/id";

export const LinkClickId = Id.pipe(Schema.brand("LinkClickId"));

export type LinkClickId = typeof LinkClickId.Type;
