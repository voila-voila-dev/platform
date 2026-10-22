import { Schema } from "effect";

export const Street = Schema.NonEmptyString.pipe(Schema.brand("Street"));

export type Street = typeof Street.Type;
