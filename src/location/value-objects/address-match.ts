import { Schema } from "effect";
import { Address } from "#location/value-objects/address";

export class AddressMatch extends Schema.Class<AddressMatch>("AddressMatch")({
	label: Schema.NonEmptyString,
	address: Address,
	score: Schema.Number,
	name: Schema.optionalKey(Schema.NonEmptyString),
	placeId: Schema.optionalKey(Schema.NonEmptyString),
}) {}
