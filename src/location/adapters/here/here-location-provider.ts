import { Duration, Effect, Layer, Option, Redacted, Schema } from "effect";
import { LocationProviderError } from "#location/errors/location-provider-error";
import { DEFAULT_ADDRESS_SUGGESTION_LIMIT } from "#location/lib/address-suggestion-limit";
import { alpha3CountryCode, countryCodeFromAlpha3 } from "#location/lib/alpha3";
import { geocodeMatchesLocality } from "#location/lib/geocode-locality-match";
import { LocationProvider } from "#location/services/location-provider";
import { Address } from "#location/value-objects/address";
import { AddressMatch } from "#location/value-objects/address-match";
import { City } from "#location/value-objects/city";
import { Coordinates } from "#location/value-objects/coordinates";
import type { CountryCode } from "#location/value-objects/country-code";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

// HERE Geocoding & Search v7: every country, venues as well as streets.
const GEOCODE_ENDPOINT = "https://geocode.search.hereapi.com/v1/geocode";

// HERE's first row can be the wrong city while the right one sits just under it.
const GEOCODE_CANDIDATE_LIMIT = 5;

const HereItem = Schema.Struct({
	id: Schema.optionalKey(Schema.String),
	title: Schema.optionalKey(Schema.String),
	resultType: Schema.optionalKey(Schema.String),
	address: Schema.optionalKey(
		Schema.Struct({
			label: Schema.optionalKey(Schema.String),
			countryCode: Schema.optionalKey(Schema.String),
			city: Schema.optionalKey(Schema.String),
			street: Schema.optionalKey(Schema.String),
			houseNumber: Schema.optionalKey(Schema.String),
			postalCode: Schema.optionalKey(Schema.String),
		}),
	),
	position: Schema.optionalKey(
		Schema.Struct({
			lat: Schema.optionalKey(Schema.Number),
			lng: Schema.optionalKey(Schema.Number),
		}),
	),
	scoring: Schema.optionalKey(
		Schema.Struct({ queryScore: Schema.optionalKey(Schema.Number) }),
	),
});
type HereItem = typeof HereItem.Type;

const HereResponse = Schema.Struct({
	items: Schema.optionalKey(Schema.Array(HereItem)),
});
type HereResponse = typeof HereResponse.Type;

function toCoordinates(position: HereItem["position"]): Coordinates | null {
	if (position?.lat === undefined || position.lng === undefined) return null;
	return new Coordinates({
		latitude: Latitude.make(position.lat),
		longitude: Longitude.make(position.lng),
	});
}

function isPlace(item: HereItem): boolean {
	return item.resultType === "place";
}

// A venue often stands on no street of its own: its name takes the street line.
function toStreetLine(item: HereItem): string {
	const address = item.address ?? {};
	const line = [address.houseNumber, address.street]
		.filter((part) => part !== undefined && part.length > 0)
		.join(" ");
	if (line.length > 0) return line;
	return isPlace(item) ? (item.title ?? "") : "";
}

// Only a place HERE both names and identifies reads as a venue.
function placeFields(item: HereItem): { name?: string; placeId?: string } {
	if (!isPlace(item)) return {};
	const name = item.title ?? "";
	const id = item.id ?? "";
	if (name.length === 0 || id.length === 0) return {};
	return { name, placeId: id };
}

// An item that is no valid address (a city, no position…) is skipped, not a failure.
function toMatch(
	item: HereItem,
	requested: CountryCode | undefined,
): AddressMatch | null {
	const address = item.address;
	if (address === undefined) return null;
	const coordinates = toCoordinates(item.position);
	if (coordinates === null) return null;
	const country =
		requested ??
		(address.countryCode === undefined
			? undefined
			: countryCodeFromAlpha3(address.countryCode));
	if (country === undefined) return null;
	try {
		return new AddressMatch({
			label: address.label ?? item.title ?? "",
			address: new Address({
				street: Street.make(toStreetLine(item)),
				city: City.make(address.city ?? ""),
				postalCode: PostalCode.make(address.postalCode ?? ""),
				country,
				coordinates,
			}),
			score: item.scoring?.queryScore ?? 0,
			...placeFields(item),
		});
	} catch {
		return null;
	}
}

function locatedInCity(
	response: HereResponse,
	address: Address,
): Option.Option<Coordinates> {
	for (const item of response.items ?? []) {
		const matches = geocodeMatchesLocality(address, {
			postalCode: item.address?.postalCode ?? "",
			city: item.address?.city ?? "",
		});
		if (!matches) continue;
		const coordinates = toCoordinates(item.position);
		if (coordinates !== null) return Option.some(coordinates);
	}
	return Option.none();
}

export interface HereLocationProviderOptions {
	readonly apiKey: Redacted.Redacted<string>;
	readonly timeout?: Duration.Input;
	readonly endpoint?: string;
	readonly fetch?: typeof fetch;
}

export function makeHereLocationProvider(
	options: HereLocationProviderOptions,
): typeof LocationProvider.Service {
	const fetchFunction = options.fetch ?? fetch;
	const endpoint = options.endpoint ?? GEOCODE_ENDPOINT;
	const timeoutMillis = Duration.toMillis(options.timeout ?? "15 seconds");
	const decodeResponse = Schema.decodeUnknownSync(HereResponse);

	function search(
		query: string,
		limit: number,
		country: CountryCode | undefined,
		operation: "suggest" | "geocode",
	) {
		return Effect.tryPromise({
			try: async () => {
				const url = new URL(endpoint);
				url.searchParams.set("q", query);
				url.searchParams.set("limit", String(limit));
				if (country !== undefined) {
					url.searchParams.set(
						"in",
						`countryCode:${alpha3CountryCode(country)}`,
					);
				}
				url.searchParams.set("apiKey", Redacted.value(options.apiKey));
				const response = await fetchFunction(url, {
					headers: { accept: "application/json" },
					signal: AbortSignal.timeout(timeoutMillis),
				});
				if (!response.ok) {
					throw new Error(`HERE ${response.status}: ${await response.text()}`);
				}
				return decodeResponse(await response.json());
			},
			catch: (cause) =>
				new LocationProviderError({
					message: `HERE request failed: ${String(cause)}`,
				}),
		}).pipe(
			Effect.withSpan(`outbound.here.${operation}`, {
				attributes: { partner: "here", "location.country": country ?? "any" },
			}),
		);
	}

	return {
		suggest: (query) =>
			search(
				query.query,
				query.limit ?? DEFAULT_ADDRESS_SUGGESTION_LIMIT,
				query.country,
				"suggest",
			).pipe(
				Effect.map((response) =>
					(response.items ?? []).flatMap(
						(item) => toMatch(item, query.country) ?? [],
					),
				),
			),
		geocode: (address) =>
			search(
				`${address.street} ${address.postalCode} ${address.city}`,
				GEOCODE_CANDIDATE_LIMIT,
				address.country,
				"geocode",
			).pipe(Effect.map((response) => locatedInCity(response, address))),
		// No street: a venue name would drag the answer back to the street that misled geocode.
		geocodeLocality: (address) =>
			search(
				`${address.postalCode} ${address.city}`,
				GEOCODE_CANDIDATE_LIMIT,
				address.country,
				"geocode",
			).pipe(Effect.map((response) => locatedInCity(response, address))),
	};
}

export function hereLocationProvider(options: HereLocationProviderOptions) {
	return Layer.succeed(LocationProvider, makeHereLocationProvider(options));
}
