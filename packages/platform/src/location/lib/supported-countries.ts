import { Schema } from "effect";
import type { CountryCode } from "#location/value-objects/country-code";

function make<const Supported extends CountryCode>(
	countries: readonly [Supported, ...Array<Supported>],
) {
	const SupportedCountry = Schema.Literals(countries);

	function per<Value>(
		make: (country: Supported) => Value,
	): Record<Supported, Value> {
		return Object.fromEntries(
			countries.map((country) => [country, make(country)]),
		) as Record<Supported, Value>;
	}

	return {
		countries,
		Schema: SupportedCountry,
		is: Schema.is(SupportedCountry),
		per,
	};
}

export const SupportedCountries = { make };
