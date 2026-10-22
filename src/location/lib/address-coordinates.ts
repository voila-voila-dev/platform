import { Cause, Effect, Option } from "effect";
import { AddressNotLocatableError } from "#location/errors/address-not-locatable-error";
import { LocationProvider } from "#location/services/location-provider";
import { Address } from "#location/value-objects/address";
import { LocatedAddress } from "#location/value-objects/located-address";
import { RateLimiter } from "#rate-limiting/services/rate-limiter";

export interface GeocodingBudget {
	// Whose budget the call spends, such as `actorRateLimitKey(actor)`.
	readonly key: string;
	readonly limit?: number;
	readonly windowSeconds?: number;
}

// Best effort: the address comes back unchanged when the budget is spent, the provider fails or finds nothing.
export function resolveAddressCoordinates(
	address: Address,
	budget: GeocodingBudget,
) {
	return Effect.gen(function* () {
		const withinBudget = yield* RateLimiter.use((rateLimiter) =>
			rateLimiter.consumeMany(
				`location:geocode:${budget.key}`,
				budget.windowSeconds ?? 60,
				budget.limit ?? 30,
			),
		).pipe(
			Effect.as(true),
			Effect.catchTag("RateLimitedError", () => Effect.succeed(false)),
		);
		if (!withinBudget) return address;

		const coordinates = yield* LocationProvider.use((provider) =>
			provider.geocode(address),
		).pipe(
			Effect.catchCause((cause) =>
				Effect.logError(`geocoding failed: ${Cause.pretty(cause)}`).pipe(
					Effect.as(Option.none()),
				),
			),
		);
		return Option.match(coordinates, {
			onNone: () => address,
			onSome: (found) => new Address({ ...address, coordinates: found }),
		});
	});
}

// Keeps the coordinates a picked suggestion carries, geocodes a typed address, fails when it cannot be placed.
export function locateAddress(address: Address, budget: GeocodingBudget) {
	return Effect.gen(function* () {
		const resolved =
			address.coordinates === undefined
				? yield* resolveAddressCoordinates(address, budget)
				: address;
		if (resolved.coordinates === undefined) {
			return yield* new AddressNotLocatableError();
		}
		return new LocatedAddress({
			street: resolved.street,
			city: resolved.city,
			postalCode: resolved.postalCode,
			country: resolved.country,
			coordinates: resolved.coordinates,
		});
	});
}
