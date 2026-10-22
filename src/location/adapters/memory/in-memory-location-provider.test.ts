import { describe, expect, it } from "bun:test";
import { Effect, Option } from "effect";
import { inMemoryLocationProvider } from "#location/adapters/memory/in-memory-location-provider";
import { LocationProvider } from "#location/services/location-provider";
import { Address } from "#location/value-objects/address";
import { City } from "#location/value-objects/city";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

const provider = Effect.runSync(
	LocationProvider.use(Effect.succeed).pipe(
		Effect.provide(inMemoryLocationProvider),
	),
);

const address = Address.make({
	street: Street.make("8 Boulevard du Port"),
	city: City.make("Amiens"),
	postalCode: PostalCode.make("80000"),
	country: "FR",
});

describe("inMemoryLocationProvider", () => {
	it("suggests one fabricated result for a non-empty query, without any fetch", async () => {
		const result = await Effect.runPromise(
			provider.suggest({ query: "8 boulevard du port" }),
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.label).toBe("8 boulevard du port");
	});

	it("suggests nothing for a blank query", async () => {
		const result = await Effect.runPromise(provider.suggest({ query: "   " }));
		expect(result).toEqual([]);
	});

	it("geocodes any address to Some(coordinates) within valid ranges", async () => {
		const coordinates = await Effect.runPromise(provider.geocode(address));
		const point = Option.getOrThrow(coordinates);
		expect<number>(point.latitude).toBeGreaterThanOrEqual(-90);
		expect<number>(point.latitude).toBeLessThanOrEqual(90);
		expect<number>(point.longitude).toBeGreaterThanOrEqual(-180);
		expect<number>(point.longitude).toBeLessThanOrEqual(180);
	});

	it("is deterministic: the same address always geocodes to the same point", async () => {
		const first = await Effect.runPromise(provider.geocode(address));
		const second = await Effect.runPromise(provider.geocode(address));
		expect(first).toEqual(second);
	});

	it("scatters different addresses to different points", async () => {
		const other = Address.make({
			street: Street.make("1 Rue de la Paix"),
			city: City.make("Paris"),
			postalCode: PostalCode.make("75002"),
			country: "FR",
		});
		const first = await Effect.runPromise(provider.geocode(address));
		const second = await Effect.runPromise(provider.geocode(other));
		expect(first).not.toEqual(second);
	});
});
