import { Effect, Layer, Schema } from "effect";
import tzLookup from "tz-lookup";
import { TimeZoneResolverError } from "#time-zone/errors/time-zone-resolver-error";
import { TimeZoneResolverService } from "#time-zone/services/time-zone-resolver-service";
import { TimeZone } from "#time-zone/value-objects/time-zone";

// tz-lookup bundles its polygons (no network, no fs) and covers overseas
// territories whose zone differs from their country's mainland. Its dataset and
// the runtime's can drift, hence the decode to `None` instead of a failure.
const decodeTimeZone = Schema.decodeUnknownOption(TimeZone);

export const tzLookupTimeZoneResolver = Layer.succeed(TimeZoneResolverService, {
	resolve: (coordinates) =>
		Effect.try({
			try: () =>
				decodeTimeZone(tzLookup(coordinates.latitude, coordinates.longitude)),
			catch: (cause) =>
				new TimeZoneResolverError({
					...coordinates,
					reason: String(cause),
				}),
		}),
});
