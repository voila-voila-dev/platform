import { Schema } from "effect";
import { Id } from "#core/value-objects/id";

export const UserId = Id.pipe(Schema.brand("UserId"));

export type UserId = typeof UserId.Type;
