import { Context, type Effect, type Option } from "effect";
import type { Coordinates } from "#location/value-objects/coordinates";
import type { TimeZoneResolverError } from "#time-zone/errors/time-zone-resolver-error";
import type { TimeZone } from "#time-zone/value-objects/time-zone";

/** Finds the zone a point lies in; `None` when the zone is not one of `TIME_ZONES`, so the caller falls back to its default. */
export class TimeZoneResolverService extends Context.Service<
	TimeZoneResolverService,
	{
		readonly resolve: (
			coordinates: Coordinates,
		) => Effect.Effect<Option.Option<TimeZone>, TimeZoneResolverError>;
	}
>()("@voila.dev/platform/TimeZoneResolverService") {}
