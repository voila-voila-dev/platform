import { ALPHA3_DATA } from "#location/lib/generated/alpha3-data";
import type { CountryCode } from "#location/value-objects/country-code";

const COUNTRY_BY_ALPHA3 = new Map(
	Object.entries(ALPHA3_DATA).map(([alpha2, alpha3]) => [
		alpha3,
		alpha2 as CountryCode,
	]),
);

export function alpha3CountryCode(country: CountryCode): string {
	return ALPHA3_DATA[country];
}

export function countryCodeFromAlpha3(alpha3: string): CountryCode | undefined {
	return COUNTRY_BY_ALPHA3.get(alpha3.toUpperCase());
}
