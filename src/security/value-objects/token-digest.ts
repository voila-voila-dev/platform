import { Schema } from "effect";

export const TokenDigest = Schema.String.pipe(
	Schema.check(Schema.isPattern(/^[0-9a-f]{64}$/u)),
).pipe(Schema.brand("TokenDigest"));

export type TokenDigest = typeof TokenDigest.Type;
