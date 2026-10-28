import { describe, expect, it } from "bun:test";
import { Effect, Option } from "effect";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";
import { tzLookupTimeZoneResolver } from "#time-zone/adapters/tz-lookup/tz-lookup-time-zone-resolver";
import { TimeZoneResolverService } from "#time-zone/services/time-zone-resolver-service";

function resolve(latitude: Latitude, longitude: Longitude) {
	return Effect.gen(function* () {
		const resolver = yield* TimeZoneResolverService;
		return yield* resolver.resolve({ latitude, longitude });
	}).pipe(Effect.provide(tzLookupTimeZoneResolver));
}

describe("tzLookupTimeZoneResolver", () => {
	it("resolves mainland France and its overseas territories to their own zones", async () => {
		const zones = await Effect.runPromise(
			Effect.all([
				resolve(Latitude.make(48.8566), Longitude.make(2.3522)),
				resolve(Latitude.make(14.6161), Longitude.make(-61.0588)),
				resolve(Latitude.make(-20.8821), Longitude.make(55.4507)),
			]),
		);
		expect(zones).toEqual([
			Option.some("Europe/Paris"),
			Option.some("America/Martinique"),
			Option.some("Indian/Reunion"),
		]);
	});

	it("fails on a point outside the globe", async () => {
		const error = await Effect.runPromise(
			resolve(91 as Latitude, Longitude.make(0)).pipe(Effect.flip),
		);
		expect(error._tag).toBe("TimeZoneResolverError");
		expect([error.latitude, error.longitude]).toEqual([91, 0]);
	});
});
