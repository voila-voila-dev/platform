import { Context, type Effect, type Option } from "effect";
import type { LocationProviderError } from "#location/errors/location-provider-error";
import type { Address } from "#location/value-objects/address";
import type { AddressMatch } from "#location/value-objects/address-match";
import type { AddressSuggestQuery } from "#location/value-objects/address-suggest-query";
import type { Coordinates } from "#location/value-objects/coordinates";

export class LocationProvider extends Context.Service<
	LocationProvider,
	{
		readonly suggest: (
			query: AddressSuggestQuery,
		) => Effect.Effect<ReadonlyArray<AddressMatch>, LocationProviderError>;
		// None rather than a far-away guess when the address lands nowhere near its city.
		readonly geocode: (
			address: Address,
		) => Effect.Effect<Option.Option<Coordinates>, LocationProviderError>;
		// The city itself: the coarse fallback once no provider could place the address.
		readonly geocodeLocality: (
			address: Address,
		) => Effect.Effect<Option.Option<Coordinates>, LocationProviderError>;
	}
>()("@voila.dev/platform/LocationProvider") {}
