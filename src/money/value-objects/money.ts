import { Schema } from "effect";
import { Currency } from "#money/value-objects/currency";

// `amount` is in the currency's minor unit, so arithmetic stays exact.
export const Money = Schema.Struct({
	amount: Schema.Int,
	currency: Currency,
});

export type Money = typeof Money.Type;
