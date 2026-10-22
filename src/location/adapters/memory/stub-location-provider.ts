import { Effect, Layer, Option } from "effect";
import { LocationProvider } from "#location/services/location-provider";
import type { Coordinates } from "#location/value-objects/coordinates";

export function stubLocationProvider(coordinates?: Coordinates) {
	const answer = Effect.succeed(Option.fromNullishOr(coordinates));
	return Layer.succeed(LocationProvider, {
		suggest: () => Effect.succeed([]),
		geocode: () => answer,
		geocodeLocality: () => answer,
	});
}
