import { NUMERIC_DATA } from "#location/lib/generated/numeric-data";
import type { CountryCode } from "#location/value-objects/country-code";

export function numericCountryCode(country: CountryCode): number {
	return NUMERIC_DATA[country];
}
