import { Schema } from "effect";
import { Address } from "#location/value-objects/address";
import { Coordinates } from "#location/value-objects/coordinates";

export const LocatedAddress = Schema.Struct({
	...Address.fields,
	coordinates: Coordinates,
});

export type LocatedAddress = typeof LocatedAddress.Type;
