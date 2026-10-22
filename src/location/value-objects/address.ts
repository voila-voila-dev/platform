import { Schema } from "effect";
import { City } from "#location/value-objects/city";
import { Coordinates } from "#location/value-objects/coordinates";
import { CountryCode } from "#location/value-objects/country-code";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

export class Address extends Schema.Class<Address>("Address")({
	street: Street,
	city: City,
	postalCode: PostalCode,
	country: CountryCode,
	coordinates: Schema.optionalKey(Coordinates),
}) {}
