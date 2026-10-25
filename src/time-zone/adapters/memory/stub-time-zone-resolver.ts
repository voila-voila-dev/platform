import { Effect, Layer, Option } from "effect";
import { TimeZoneResolverService } from "#time-zone/services/time-zone-resolver-service";
import type { TimeZone } from "#time-zone/value-objects/time-zone";

export function stubTimeZoneResolver(timeZone?: TimeZone) {
	return {
		layer: Layer.succeed(TimeZoneResolverService, {
			resolve: () => Effect.succeed(Option.fromUndefinedOr(timeZone)),
		}),
	};
}
