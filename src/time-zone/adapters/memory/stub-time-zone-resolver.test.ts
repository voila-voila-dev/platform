import { describe, expect, it } from "bun:test";
import { Effect, Option } from "effect";
import { Coordinates } from "#location/value-objects/coordinates";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { stubTimeZoneResolver } from "#time-zone/adapters/memory/stub-time-zone-resolver";
import { TimeZoneResolverService } from "#time-zone/services/time-zone-resolver-service";

const paris = Coordinates.make({
	latitude: Latitude.make(48.8566),
	longitude: Longitude.make(2.3522),
});

function resolve() {
	return Effect.gen(function* () {
		const resolver = yield* TimeZoneResolverService;
		return yield* resolver.resolve(paris);
	});
}

describe("stubTimeZoneResolver", () => {
	it("resolves every point to the zone it is given", async () => {
		const zone = await Effect.runPromise(
			resolve().pipe(
				Effect.provide(stubTimeZoneResolver("America/Martinique").layer),
			),
		);
		expect(zone).toEqual(Option.some("America/Martinique"));
	});

	it("resolves nothing without a zone", async () => {
		const zone = await Effect.runPromise(
			resolve().pipe(Effect.provide(stubTimeZoneResolver().layer)),
		);
		expect(zone).toEqual(Option.none());
	});
});
