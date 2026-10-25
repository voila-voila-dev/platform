import { Schema } from "effect";

export const Sha256Hex = Schema.String.pipe(
	Schema.check(Schema.isPattern(/^[0-9a-f]{64}$/u)),
).pipe(Schema.brand("Sha256Hex"));

export type Sha256Hex = typeof Sha256Hex.Type;
