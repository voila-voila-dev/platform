import { describe, expect, it } from "bun:test";
import { Effect, Option, Redacted } from "effect";
import { makeHereLocationProvider } from "#location/adapters/here/here-location-provider";
import { Address } from "#location/value-objects/address";
import { City } from "#location/value-objects/city";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

type FetchHandler = (
	input: string | URL | Request,
	init?: RequestInit,
) => Promise<Response>;

let fetchImpl: FetchHandler = () => Promise.resolve(new Response("{}"));
const fetchStub = Object.assign(
	(input: string | URL | Request, init?: RequestInit) => fetchImpl(input, init),
	{ preconnect: fetch.preconnect },
);

let lastUrl = "";
function stubFetch(payload: unknown) {
	fetchImpl = (input: string | URL | Request) => {
		lastUrl = String(input);
		return Promise.resolve(
			new Response(JSON.stringify(payload), {
				status: 200,
				headers: { "content-type": "application/json" },
			}),
		);
	};
}

function item(overrides: Record<string, unknown> = {}) {
	return {
		address: {
			label: "Friedrichstraße 1, 10969 Berlin, Deutschland",
			countryCode: "DEU",
			city: "Berlin",
			street: "Friedrichstraße",
			houseNumber: "1",
			postalCode: "10969",
			...overrides,
		},
		position: { lat: 52.500_17, lng: 13.3918 },
		scoring: { queryScore: 1 },
	};
}

const provider = makeHereLocationProvider({
	apiKey: Redacted.make("test-key"),
	fetch: fetchStub,
});

describe("hereLocationProvider", () => {
	it("answers a venue that stands on no street with its own name", async () => {
		stubFetch({
			items: [
				{
					id: "here:pds:place:250u09tv-desgrange",
					title: "Stade Henri Desgrange",
					resultType: "place",
					address: {
						label: "Stade Henri Desgrange, 85000 La Roche-sur-Yon, France",
						countryCode: "FRA",
						city: "La Roche-sur-Yon",
						postalCode: "85000",
					},
					position: { lat: 46.669_845, lng: -1.441_402 },
					scoring: { queryScore: 1 },
				},
			],
		});
		const result = await Effect.runPromise(
			provider.suggest({ query: "stade henri desgrange", country: "FR" }),
		);
		expect(result).toHaveLength(1);
		expect(result[0]?.name).toBe("Stade Henri Desgrange");
		expect(result[0]?.placeId).toBe("here:pds:place:250u09tv-desgrange");
		expect<string | undefined>(result[0]?.address.street).toBe(
			"Stade Henri Desgrange",
		);
		expect<string | undefined>(result[0]?.address.city).toBe(
			"La Roche-sur-Yon",
		);
	});

	it("names no venue on a street, so a street never reads as a place", async () => {
		stubFetch({ items: [item()] });
		const result = await Effect.runPromise(
			provider.suggest({ query: "friedrichstrasse 1", country: "DE" }),
		);
		expect(result[0]?.name).toBeUndefined();
		expect(result[0]?.placeId).toBeUndefined();
	});

	it("still skips a result that is neither a place nor an address", async () => {
		stubFetch({
			items: [
				{
					title: "La Roche-sur-Yon",
					resultType: "locality",
					address: {
						label: "La Roche-sur-Yon, France",
						countryCode: "FRA",
						city: "La Roche-sur-Yon",
						postalCode: "85000",
					},
					position: { lat: 46.670_166, lng: -1.426_857 },
					scoring: { queryScore: 1 },
				},
			],
		});
		const result = await Effect.runPromise(
			provider.suggest({ query: "la roche sur yon", country: "FR" }),
		);
		expect(result).toEqual([]);
	});

	it("maps items to suggestions, joining house number + street and reading lat/lng", async () => {
		stubFetch({ items: [item()] });
		const result = await Effect.runPromise(
			provider.suggest({
				query: "friedrichstrasse 1",
				country: "DE",
			}),
		);
		expect(result).toHaveLength(1);
		const [suggestion] = result;
		if (suggestion === undefined) throw new Error("no suggestion");
		expect<string>(suggestion.address.street).toBe("1 Friedrichstraße");
		expect<string>(suggestion.address.city).toBe("Berlin");
		expect<string>(suggestion.address.postalCode).toBe("10969");
		expect(suggestion.address.country).toBe("DE");
		expect<number | undefined>(suggestion.address.coordinates?.latitude).toBe(
			52.500_17,
		);
		expect<number | undefined>(suggestion.address.coordinates?.longitude).toBe(
			13.3918,
		);
		expect(suggestion.score).toBe(1);
	});

	it("sends the API key and alpha-3 country filter", async () => {
		stubFetch({ items: [item()] });
		await Effect.runPromise(provider.suggest({ query: "x", country: "DE" }));
		expect(lastUrl).toContain("apiKey=test-key");
		expect(lastUrl).toContain("in=countryCode%3ADEU");
	});

	it("reads the country of a result outside Europe", async () => {
		stubFetch({
			items: [
				item({
					label: "1-1 Marunouchi, Chiyoda-ku, Tokyo 100-0005, Japan",
					countryCode: "JPN",
					city: "Tokyo",
					street: "Marunouchi",
					houseNumber: "1-1",
					postalCode: "100-0005",
				}),
			],
		});
		const result = await Effect.runPromise(
			provider.suggest({ query: "marunouchi" }),
		);
		expect(result[0]?.address.country).toBe("JP");
	});

	it("accepts international (non 5-digit) postal codes", async () => {
		stubFetch({
			items: [
				item({
					countryCode: "GBR",
					city: "London",
					street: "Downing Street",
					houseNumber: "10",
					postalCode: "SW1A 2AA",
					label: "10 Downing Street, London, SW1A 2AA, United Kingdom",
				}),
			],
		});
		const result = await Effect.runPromise(
			provider.suggest({ query: "10 downing", country: "GB" }),
		);
		expect(result).toHaveLength(1);
		expect<string | undefined>(result[0]?.address.postalCode).toBe("SW1A 2AA");
	});

	it("skips items without a position", async () => {
		stubFetch({ items: [item(), { address: item().address }] });
		const result = await Effect.runPromise(
			provider.suggest({ query: "x", country: "DE" }),
		);
		expect(result).toHaveLength(1);
	});

	it("geocodes an address to Some(coordinates)", async () => {
		stubFetch({ items: [item()] });
		const coordinates = await Effect.runPromise(
			provider.geocode(
				Address.make({
					street: Street.make("Friedrichstraße 1"),
					city: City.make("Berlin"),
					postalCode: PostalCode.make("10969"),
					country: "DE",
				}),
			),
		);
		const point = Option.getOrThrow(coordinates);
		expect<number>(point.longitude).toBe(13.3918);
	});
});
