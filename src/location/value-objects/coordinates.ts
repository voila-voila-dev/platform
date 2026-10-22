import { Schema } from "effect";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";

export const Coordinates = Schema.Struct({
	latitude: Latitude,
	longitude: Longitude,
});

export type Coordinates = typeof Coordinates.Type;
