import { Array as Arr, Effect, Option, Result } from "effect";
import type { LocationProviderError } from "#location/errors/location-provider-error";
import type { LocationProviderService } from "#location/services/location-provider-service";
import type { AddressMatch } from "#location/value-objects/address-match";
import type { Coordinates } from "#location/value-objects/coordinates";
import type { CountryCode } from "#location/value-objects/country-code";

type LocationProviderShape = typeof LocationProviderService.Service;

type Attempt<A> = () => Effect.Effect<A, LocationProviderError>;

// A provider that fails counts as one that found nothing: the failure surfaces only when none answered.
function firstAnswer<A>(
	attempts: ReadonlyArray<Attempt<A>>,
	empty: A,
	isEmpty: (answer: A) => boolean,
) {
	return Effect.gen(function* () {
		let lastFailure: LocationProviderError | null = null;
		let answered = false;
		for (const attempt of attempts) {
			const outcome = yield* Effect.result(attempt());
			if (Result.isFailure(outcome)) {
				lastFailure = outcome.failure;
				continue;
			}
			if (!isEmpty(outcome.success)) return outcome.success;
			answered = true;
		}
		if (!answered && lastFailure !== null) {
			return yield* Effect.fail(lastFailure);
		}
		return empty;
	});
}

export function firstLocated(
	attempts: ReadonlyArray<Attempt<Option.Option<Coordinates>>>,
) {
	return firstAnswer(attempts, Option.none<Coordinates>(), Option.isNone);
}

export function firstSuggested(
	attempts: ReadonlyArray<Attempt<ReadonlyArray<AddressMatch>>>,
) {
	return firstAnswer(
		attempts,
		Arr.empty<AddressMatch>(),
		(matches) => matches.length === 0,
	);
}

export interface LocationProviderRoutes {
	// Asked in order until one suggests something.
	readonly suggest: ReadonlyArray<LocationProviderShape>;
	// Asked in order to place the street, then the first one for the city alone.
	readonly geocode: (
		country: CountryCode,
	) => readonly [LocationProviderShape, ...Array<LocationProviderShape>];
}

export function routedLocationProvider(
	routes: LocationProviderRoutes,
): LocationProviderShape {
	return {
		suggest: (query) =>
			firstSuggested(
				routes.suggest.map((provider) => () => provider.suggest(query)),
			),
		geocode: (address) => {
			const providers = routes.geocode(address.country);
			return firstLocated([
				...providers.map((provider) => () => provider.geocode(address)),
				() => providers[0].geocodeLocality(address),
			]);
		},
		geocodeLocality: (address) =>
			routes.geocode(address.country)[0].geocodeLocality(address),
	};
}
