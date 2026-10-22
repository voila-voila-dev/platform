import { Schema } from "effect";

export const City = Schema.NonEmptyString.pipe(Schema.brand("City"));

export type City = typeof City.Type;
