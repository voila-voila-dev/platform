import { Schema } from "effect";
import { Address } from "#location/value-objects/address";
import { Coordinates } from "#location/value-objects/coordinates";

export class LocatedAddress extends Schema.Class<LocatedAddress>(
	"LocatedAddress",
)({
	...Address.fields,
	coordinates: Coordinates,
}) {}
