import { describe, expect, it } from "bun:test";
import { Effect, Option } from "effect";
import { LocationProviderError } from "#location/errors/location-provider-error";
import {
	firstLocated,
	firstSuggested,
} from "#location/lib/routed-location-provider";
import { Address } from "#location/value-objects/address";
import { AddressMatch } from "#location/value-objects/address-match";
import { City } from "#location/value-objects/city";
import { Coordinates } from "#location/value-objects/coordinates";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

const point = new Coordinates({
	latitude: Latitude.make(46.669_845),
	longitude: Longitude.make(-1.441_402),
});

function misses() {
	return Effect.succeed(Option.none<Coordinates>());
}
function finds() {
	return Effect.succeed(Option.some(point));
}
function fails() {
	return Effect.fail(new LocationProviderError({ message: "upstream down" }));
}

describe("firstLocated", () => {
	it("stops at the first attempt that places the address", async () => {
		let reached = 0;
		const result = await Effect.runPromise(
			firstLocated([
				misses,
				() => {
					reached += 1;
					return finds();
				},
				() => {
					reached += 10;
					return finds();
				},
			]),
		);
		expect(Option.isSome(result)).toBe(true);
		expect(reached).toBe(1);
	});

	it("asks the next backend when one fails", async () => {
		const result = await Effect.runPromise(firstLocated([fails, finds]));
		expect(Option.isSome(result)).toBe(true);
	});

	it("answers None when every attempt merely found nothing", async () => {
		const result = await Effect.runPromise(firstLocated([misses, misses]));
		expect(Option.isNone(result)).toBe(true);
	});

	it("raises the failure when every attempt failed", async () => {
		const outcome = await Effect.runPromise(
			Effect.result(firstLocated([fails, fails])),
		);
		expect(outcome._tag).toBe("Failure");
	});

	it("does not raise a failure that a later attempt answered past", async () => {
		const result = await Effect.runPromise(firstLocated([fails, misses]));
		expect(Option.isNone(result)).toBe(true);
	});

	it("does not raise a failure that an earlier attempt answered past", async () => {
		const result = await Effect.runPromise(firstLocated([misses, fails]));
		expect(Option.isNone(result)).toBe(true);
	});
});

function noMatches() {
	return Effect.succeed<ReadonlyArray<AddressMatch>>([]);
}
function matches(label: string) {
	return () =>
		Effect.succeed<ReadonlyArray<AddressMatch>>([
			new AddressMatch({
				label,
				address: new Address({
					street: Street.make(label),
					city: City.make("La Roche-sur-Yon"),
					postalCode: PostalCode.make("85000"),
					country: "FR",
				}),
				score: 1,
			}),
		]);
}
function failsToSuggest() {
	return Effect.fail(new LocationProviderError({ message: "upstream down" }));
}

describe("firstSuggested", () => {
	it("stops at the first backend that has something to suggest", async () => {
		const suggestions = await Effect.runPromise(
			firstSuggested([matches("Stade Henri Desgrange"), matches("Rue Henri")]),
		);
		expect(suggestions.map((entry) => entry.label)).toEqual([
			"Stade Henri Desgrange",
		]);
	});

	it("falls back to the next backend when the first knows nothing", async () => {
		const suggestions = await Effect.runPromise(
			firstSuggested([noMatches, matches("8 Rue Nationale")]),
		);
		expect(suggestions.map((entry) => entry.label)).toEqual([
			"8 Rue Nationale",
		]);
	});

	it("falls back to the next backend when the first is down", async () => {
		const suggestions = await Effect.runPromise(
			firstSuggested([failsToSuggest, matches("8 Rue Nationale")]),
		);
		expect(suggestions).toHaveLength(1);
	});

	it("raises the failure when every backend is down", async () => {
		const outcome = await Effect.runPromise(
			Effect.result(firstSuggested([failsToSuggest, failsToSuggest])),
		);
		expect(outcome._tag).toBe("Failure");
	});

	it("answers with nothing when no backend knows the query", async () => {
		const suggestions = await Effect.runPromise(
			firstSuggested([noMatches, noMatches]),
		);
		expect(suggestions).toEqual([]);
	});

	it("answers with nothing when one backend knew nothing and the other is down", async () => {
		const suggestions = await Effect.runPromise(
			firstSuggested([noMatches, failsToSuggest]),
		);
		expect(suggestions).toEqual([]);
	});
});
