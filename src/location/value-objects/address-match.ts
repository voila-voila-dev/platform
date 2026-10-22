import { Schema } from "effect";
import { Address } from "#location/value-objects/address";

export class AddressMatch extends Schema.Class<AddressMatch>("AddressMatch")({
	label: Schema.NonEmptyString,
	address: Address,
	// The provider's relevance, from 0 to 1.
	score: Schema.Number,
	// A venue ("Stade Henri Desgrange") rather than a street: its name and the provider's id for it.
	name: Schema.optionalKey(Schema.NonEmptyString),
	placeId: Schema.optionalKey(Schema.NonEmptyString),
}) {}
