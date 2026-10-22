import { Schema } from "effect";
import { CountryCode } from "#location/value-objects/country-code";

export const AddressSuggestQuery = Schema.Struct({
	query: Schema.NonEmptyString,
	limit: Schema.optional(Schema.Int),
	country: Schema.optional(CountryCode),
});

export type AddressSuggestQuery = typeof AddressSuggestQuery.Type;
