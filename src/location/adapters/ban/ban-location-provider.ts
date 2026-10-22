import { Duration, Effect, Layer, Option, Schema } from "effect";
import { LocationProviderError } from "#location/errors/location-provider-error";
import { DEFAULT_ADDRESS_SUGGESTION_LIMIT } from "#location/lib/address-suggestion-limit";
import { geocodeMatchesLocality } from "#location/lib/geocode-locality-match";
import { LocationProvider } from "#location/services/location-provider";
import { Address } from "#location/value-objects/address";
import { AddressMatch } from "#location/value-objects/address-match";
import { City } from "#location/value-objects/city";
import { Coordinates } from "#location/value-objects/coordinates";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

// The French Base Adresse Nationale: keyless and free, French addresses only.
const SEARCH_ENDPOINT = "https://api-adresse.data.gouv.fr/search/";

// BAN's first row can be the wrong city while the right one sits just under it.
const GEOCODE_CANDIDATE_LIMIT = 5;

function answerField<Field extends Schema.Top>(field: Field) {
	return Schema.optionalKey(Schema.NullOr(field));
}

const BanFeature = Schema.Struct({
	geometry: answerField(
		Schema.Struct({
			coordinates: answerField(Schema.Tuple([Schema.Number, Schema.Number])),
		}),
	),
	properties: answerField(
		Schema.Struct({
			label: answerField(Schema.String),
			name: answerField(Schema.String),
			postcode: answerField(Schema.String),
			city: answerField(Schema.String),
			score: answerField(Schema.Number),
		}),
	),
});
type BanFeature = typeof BanFeature.Type;

const BanResponse = Schema.Struct({
	features: answerField(Schema.Array(BanFeature)),
});
type BanResponse = typeof BanResponse.Type;

// GeoJSON order: [longitude, latitude].
function toCoordinates(
	coordinates: readonly [number, number] | null | undefined,
): Coordinates | null {
	if (coordinates === undefined || coordinates === null) return null;
	const [longitude, latitude] = coordinates;
	return new Coordinates({
		latitude: Latitude.make(latitude),
		longitude: Longitude.make(longitude),
	});
}

function textOrEmpty(value: string | null | undefined): string {
	return value ?? "";
}

// A feature that is no valid address (a city with no street…) is skipped, not a failure.
function toMatch(feature: BanFeature): AddressMatch | null {
	const properties = feature.properties;
	if (properties === undefined || properties === null) return null;
	const coordinates = toCoordinates(feature.geometry?.coordinates);
	if (coordinates === null) return null;
	try {
		return new AddressMatch({
			label: textOrEmpty(properties.label),
			address: new Address({
				street: Street.make(textOrEmpty(properties.name)),
				city: City.make(textOrEmpty(properties.city)),
				postalCode: PostalCode.make(textOrEmpty(properties.postcode)),
				country: "FR",
				coordinates,
			}),
			score: properties.score ?? 0,
		});
	} catch {
		return null;
	}
}

function locatedInCity(
	response: BanResponse,
	address: Address,
): Option.Option<Coordinates> {
	for (const feature of response.features ?? []) {
		const properties = feature.properties;
		if (properties === undefined || properties === null) continue;
		const matches = geocodeMatchesLocality(address, {
			postalCode: textOrEmpty(properties.postcode),
			city: textOrEmpty(properties.city),
		});
		if (!matches) continue;
		const coordinates = toCoordinates(feature.geometry?.coordinates);
		if (coordinates !== null) return Option.some(coordinates);
	}
	return Option.none();
}

export interface BanLocationProviderOptions {
	readonly timeout?: Duration.Input;
	readonly endpoint?: string;
	readonly fetch?: typeof fetch;
}

export function makeBanLocationProvider(
	options: BanLocationProviderOptions = {},
): typeof LocationProvider.Service {
	const fetchFunction = options.fetch ?? fetch;
	const endpoint = options.endpoint ?? SEARCH_ENDPOINT;
	const timeoutMillis = Duration.toMillis(options.timeout ?? "15 seconds");
	const decodeResponse = Schema.decodeUnknownSync(BanResponse);

	function search(query: string, limit: number, autocomplete: boolean) {
		return Effect.tryPromise({
			try: async () => {
				const url = new URL(endpoint);
				url.searchParams.set("q", query);
				url.searchParams.set("limit", String(limit));
				if (autocomplete) url.searchParams.set("autocomplete", "1");
				const response = await fetchFunction(url, {
					headers: { accept: "application/json" },
					signal: AbortSignal.timeout(timeoutMillis),
				});
				if (!response.ok) {
					throw new Error(`BAN ${response.status}: ${await response.text()}`);
				}
				return decodeResponse(await response.json());
			},
			catch: (cause) =>
				new LocationProviderError({
					message: `BAN request failed: ${String(cause)}`,
				}),
		}).pipe(
			Effect.withSpan(`outbound.ban.${autocomplete ? "suggest" : "geocode"}`, {
				attributes: { partner: "ban", "location.country": "FR" },
			}),
		);
	}

	return {
		suggest: (query) =>
			query.country !== undefined && query.country !== "FR"
				? Effect.succeed([])
				: search(
						query.query,
						query.limit ?? DEFAULT_ADDRESS_SUGGESTION_LIMIT,
						true,
					).pipe(
						Effect.map((response) =>
							(response.features ?? []).flatMap(
								(feature) => toMatch(feature) ?? [],
							),
						),
					),
		geocode: (address) =>
			address.country !== "FR"
				? Effect.succeed(Option.none())
				: search(
						`${address.street} ${address.postalCode} ${address.city}`,
						GEOCODE_CANDIDATE_LIMIT,
						false,
					).pipe(Effect.map((response) => locatedInCity(response, address))),
		// No street: a venue name would drag the answer back to the street that misled geocode.
		geocodeLocality: (address) =>
			address.country !== "FR"
				? Effect.succeed(Option.none())
				: search(
						`${address.postalCode} ${address.city}`,
						GEOCODE_CANDIDATE_LIMIT,
						false,
					).pipe(Effect.map((response) => locatedInCity(response, address))),
	};
}

export function banLocationProvider(options: BanLocationProviderOptions = {}) {
	return Layer.succeed(LocationProvider, makeBanLocationProvider(options));
}
