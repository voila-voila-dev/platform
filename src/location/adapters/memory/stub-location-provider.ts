import { Effect, Layer, Option } from "effect";
import { LocationProviderService } from "#location/services/location-provider-service";
import type { Coordinates } from "#location/value-objects/coordinates";

export function stubLocationProvider(coordinates?: Coordinates) {
	const answer = Effect.succeed(Option.fromNullishOr(coordinates));
	return Layer.succeed(LocationProviderService, {
		suggest: () => Effect.succeed([]),
		geocode: () => answer,
		geocodeLocality: () => answer,
	});
}
