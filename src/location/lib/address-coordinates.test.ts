import { describe, expect, it } from "bun:test";
import { Effect, Layer } from "effect";
import { stubLocationProvider } from "#location/adapters/memory/stub-location-provider";
import { AddressNotLocatableError } from "#location/errors/address-not-locatable-error";
import {
	locateAddress,
	resolveAddressCoordinates,
} from "#location/lib/address-coordinates";
import { Address } from "#location/value-objects/address";
import { City } from "#location/value-objects/city";
import { Coordinates } from "#location/value-objects/coordinates";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";
import { stubRateLimiter } from "#rate-limiting/adapters/memory/stub-rate-limiter";

const budget = { key: "user-1" };

const venue = Address.make({
	street: Street.make("Stade de Bon Rencontre - Boulevard Aristide Briand"),
	city: City.make("Toulon"),
	postalCode: PostalCode.make("83200"),
	country: "FR",
});

const geocoded = Coordinates.make({
	latitude: Latitude.make(43.126_12),
	longitude: Longitude.make(5.902_18),
});

const pickedPin = Coordinates.make({
	latitude: Latitude.make(48.8566),
	longitude: Longitude.make(2.3522),
});

function layer(providerCoordinates?: Coordinates, rateLimitedOn?: string) {
	return Layer.mergeAll(
		stubLocationProvider(providerCoordinates),
		stubRateLimiter(rateLimitedOn),
	);
}

describe("resolveAddressCoordinates", () => {
	it("adds the coordinates the provider finds", async () => {
		const resolved = await Effect.runPromise(
			resolveAddressCoordinates(venue, budget).pipe(
				Effect.provide(layer(geocoded)),
			),
		);

		expect(resolved.coordinates).toStrictEqual(geocoded);
	});

	it("keeps the address unchanged once the budget is spent", async () => {
		const resolved = await Effect.runPromise(
			resolveAddressCoordinates(venue, budget).pipe(
				Effect.provide(layer(geocoded, "user-1")),
			),
		);

		expect(resolved).toBe(venue);
	});
});

describe("locateAddress", () => {
	it("geocodes a typed address", async () => {
		const located = await Effect.runPromise(
			locateAddress(venue, budget).pipe(Effect.provide(layer(geocoded))),
		);

		expect(located.street).toBe(venue.street);
		expect(located.coordinates).toStrictEqual(geocoded);
	});

	it("keeps the coordinates a picked suggestion carries", async () => {
		const picked = Address.make({ ...venue, coordinates: pickedPin });

		const located = await Effect.runPromise(
			locateAddress(picked, budget).pipe(Effect.provide(layer(geocoded))),
		);

		expect(located.coordinates).toStrictEqual(pickedPin);
	});

	it("fails with AddressNotLocatableError when the provider finds nothing", async () => {
		const failure = await Effect.runPromise(
			locateAddress(venue, budget).pipe(Effect.flip, Effect.provide(layer())),
		);

		expect(failure).toBeInstanceOf(AddressNotLocatableError);
	});
});
