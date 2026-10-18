import { Schema } from "effect";

export const LinkCode = Schema.NonEmptyString.pipe(Schema.brand("LinkCode"));

export type LinkCode = typeof LinkCode.Type;
