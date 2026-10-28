import { Schema } from "effect";
import { Id } from "#core/value-objects/id";

export const ImportIntentId = Id.pipe(Schema.brand("ImportIntentId"));

export type ImportIntentId = typeof ImportIntentId.Type;
