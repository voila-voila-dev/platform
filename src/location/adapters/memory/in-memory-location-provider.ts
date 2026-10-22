import { Effect, Layer, Option } from "effect";
import { LocationProvider } from "#location/services/location-provider";
import { Address } from "#location/value-objects/address";
import { AddressMatch } from "#location/value-objects/address-match";
import { City } from "#location/value-objects/city";
import { Coordinates } from "#location/value-objects/coordinates";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

const PARIS = { latitude: 48.8566, longitude: 2.3522 };

function hashToUnit(text: string) {
	let hash = 0x81_1c_9d_c5;
	for (const character of text) {
		hash ^= character.codePointAt(0) ?? 0;
		hash = Math.imul(hash, 0x01_00_01_93);
	}
	return (hash >>> 0) / 0xff_ff_ff_ff;
}

// Same input, same point, scattered around Paris: stable fixtures, not geography.
function syntheticCoordinates(seed: string) {
	return new Coordinates({
		latitude: Latitude.make(PARIS.latitude + (hashToUnit(seed) - 0.5) * 4),
		longitude: Longitude.make(
			PARIS.longitude + (hashToUnit(`${seed}:lng`) - 0.5) * 4,
		),
	});
}

export const inMemoryLocationProvider = Layer.succeed(LocationProvider, {
	suggest: (query) =>
		Effect.succeed(
			query.query.trim().length === 0
				? []
				: [
						new AddressMatch({
							label: query.query,
							address: new Address({
								street: Street.make(query.query),
								city: City.make("Dev"),
								postalCode: PostalCode.make("00000"),
								country: query.country ?? "FR",
								coordinates: syntheticCoordinates(query.query),
							}),
							score: 1,
						}),
					],
		),
	geocode: (address) =>
		Effect.succeed(
			Option.some(
				syntheticCoordinates(
					`${address.street}|${address.postalCode}|${address.city}`,
				),
			),
		),
	geocodeLocality: (address) =>
		Effect.succeed(
			Option.some(
				syntheticCoordinates(`${address.postalCode}|${address.city}`),
			),
		),
});
