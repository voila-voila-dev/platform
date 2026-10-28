import { Schema } from "effect";
import { Address } from "#location/value-objects/address";

export const AddressMatch = Schema.Struct({
	label: Schema.NonEmptyString,
	address: Address,
	score: Schema.Number,
	name: Schema.optionalKey(Schema.NonEmptyString),
	placeId: Schema.optionalKey(Schema.NonEmptyString),
});

export type AddressMatch = typeof AddressMatch.Type;
