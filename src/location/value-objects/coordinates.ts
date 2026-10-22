import { Schema } from "effect";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";

export class Coordinates extends Schema.Class<Coordinates>("Coordinates")({
	latitude: Latitude,
	longitude: Longitude,
}) {}
