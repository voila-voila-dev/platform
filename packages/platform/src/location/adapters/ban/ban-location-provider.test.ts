import { describe, expect, it } from "bun:test";
import { Effect, Option } from "effect";
import { makeBanLocationProvider } from "#location/adapters/ban/ban-location-provider";
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

function feature(overrides: Record<string, unknown> = {}) {
	return {
		geometry: { coordinates: [2.290_084, 49.897_442] },
		properties: {
			label: "8 Boulevard du Port 80000 Amiens",
			name: "8 Boulevard du Port",
			postcode: "80000",
			city: "Amiens",
			score: 0.97,
			...overrides,
		},
	};
}

const provider = makeBanLocationProvider({ fetch: fetchStub });

describe("banLocationProvider", () => {
	it("maps features to suggestions, reading coordinates as [lon, lat]", async () => {
		stubFetch({ type: "FeatureCollection", features: [feature()] });
		const result = await Effect.runPromise(
			provider.suggest({ query: "8 bd du port amiens" }),
		);
		expect(result).toHaveLength(1);
		const [suggestion] = result;
		if (suggestion === undefined) throw new Error("no suggestion");
		expect(suggestion.label).toBe("8 Boulevard du Port 80000 Amiens");
		expect<string>(suggestion.address.street).toBe("8 Boulevard du Port");
		expect<string>(suggestion.address.city).toBe("Amiens");
		expect<string>(suggestion.address.postalCode).toBe("80000");
		expect(suggestion.address.country).toBe("FR");
		expect<number | undefined>(suggestion.address.coordinates?.latitude).toBe(
			49.897_442,
		);
		expect<number | undefined>(suggestion.address.coordinates?.longitude).toBe(
			2.290_084,
		);
		expect(suggestion.score).toBe(0.97);
		expect(lastUrl).toContain("autocomplete=1");
	});

	it("skips features that fail value-object validation", async () => {
		stubFetch({
			features: [
				feature(),
				// Empty street name → Street.make throws → suggestion dropped.
				feature({ name: "", label: "no street" }),
			],
		});
		const result = await Effect.runPromise(provider.suggest({ query: "x" }));
		expect(result).toHaveLength(1);
	});

	it("geocodes a French address to Some(coordinates)", async () => {
		stubFetch({ features: [feature()] });
		const coordinates = await Effect.runPromise(
			provider.geocode(
				Address.make({
					street: Street.make("8 Boulevard du Port"),
					city: City.make("Amiens"),
					postalCode: PostalCode.make("80000"),
					country: "FR",
				}),
			),
		);
		expect<number>(Option.getOrThrow(coordinates).latitude).toBe(49.897_442);
	});

	it("skips a result answering another commune than the one asked for", async () => {
		// The mission that made this test exist: a stadium typed as a street, and
		// BAN ranking a same-sounding street 60 km away first.
		stubFetch({
			features: [
				feature({
					label: "Rue Henri Desgranges 17000 La Rochelle",
					name: "Rue Henri Desgranges",
					postcode: "17000",
					city: "La Rochelle",
					score: 0.478,
				}),
			],
		});
		const coordinates = await Effect.runPromise(
			provider.geocode(
				Address.make({
					street: Street.make("Stade Henri Desgrange"),
					city: City.make("La Roche sur Yon"),
					postalCode: PostalCode.make("85000"),
					country: "FR",
				}),
			),
		);
		expect(Option.isNone(coordinates)).toBe(true);
	});

	it("keeps the first result standing in the commune asked for", async () => {
		stubFetch({
			features: [
				feature({
					postcode: "17000",
					city: "La Rochelle",
					name: "Rue Henri Desgranges",
					score: 0.478,
				}),
				{
					geometry: { coordinates: [-1.441_402, 46.669_845] },
					properties: {
						label: "Boulevard Réaumur 85000 La Roche-sur-Yon",
						name: "Boulevard Réaumur",
						postcode: "85000",
						city: "La Roche-sur-Yon",
						score: 0.41,
					},
				},
			],
		});
		const coordinates = await Effect.runPromise(
			provider.geocode(
				Address.make({
					street: Street.make("Stade Henri Desgrange"),
					// Spelt without the hyphens BAN uses: the commune still matches.
					city: City.make("La Roche sur Yon"),
					postalCode: PostalCode.make("85000"),
					country: "FR",
				}),
			),
		);
		expect<number>(Option.getOrThrow(coordinates).latitude).toBe(46.669_845);
	});

	it("geocodes the commune alone, leaving the street out of the query", async () => {
		stubFetch({
			features: [
				{
					geometry: { coordinates: [-1.412_533, 46.670_848] },
					properties: {
						label: "La Roche-sur-Yon",
						name: "La Roche-sur-Yon",
						postcode: "85000",
						city: "La Roche-sur-Yon",
						score: 0.95,
					},
				},
			],
		});
		const coordinates = await Effect.runPromise(
			provider.geocodeLocality(
				Address.make({
					street: Street.make("Stade Henri Desgrange"),
					city: City.make("La Roche sur Yon"),
					postalCode: PostalCode.make("85000"),
					country: "FR",
				}),
			),
		);
		expect(Option.isSome(coordinates)).toBe(true);
		expect(lastUrl).not.toContain("Stade");
	});

	it("returns no suggestions for a non-French country without calling the API", async () => {
		let called = false;
		fetchImpl = () => {
			called = true;
			return Promise.resolve(new Response("{}"));
		};
		const result = await Effect.runPromise(
			provider.suggest({ query: "berlin", country: "DE" }),
		);
		expect(result).toHaveLength(0);
		expect(called).toBe(false);
	});

	it("geocodes a non-French address to None without calling the API", async () => {
		let called = false;
		fetchImpl = () => {
			called = true;
			return Promise.resolve(new Response("{}"));
		};
		const coordinates = await Effect.runPromise(
			provider.geocode(
				Address.make({
					street: Street.make("Friedrichstrasse 1"),
					city: City.make("Berlin"),
					postalCode: PostalCode.make("10117"),
					country: "DE",
				}),
			),
		);
		expect(Option.isNone(coordinates)).toBe(true);
		expect(called).toBe(false);
	});
});
