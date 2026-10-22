import { Option, Schema } from "effect";
import type { Language } from "#locale/value-objects/language";
import type { Locale } from "#locale/value-objects/locale";
import {
	COUNTRY_CODES,
	CountryCode,
} from "#location/value-objects/country-code";

// Hermes (React Native) has no Intl.DisplayNames: the code stands in for the name.
export function countryName(country: CountryCode, locale: Locale): string {
	return typeof Intl.DisplayNames === "function"
		? (new Intl.DisplayNames([locale], { type: "region" }).of(country) ??
				country)
		: country;
}

function normalizeText(value: string): string {
	return value
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();
}

const lookups = new Map<string, Map<string, CountryCode>>();

function lookupIn(languages: ReadonlyArray<Language>) {
	const cacheKey = languages.join(",");
	const cached = lookups.get(cacheKey);
	if (cached !== undefined) return cached;
	const lookup = new Map<string, CountryCode>();
	for (const language of languages) {
		const displayNames = new Intl.DisplayNames([language], { type: "region" });
		for (const code of COUNTRY_CODES) {
			const name = displayNames.of(code);
			if (name !== undefined && !lookup.has(normalizeText(name))) {
				lookup.set(normalizeText(name), code);
			}
		}
	}
	lookups.set(cacheKey, lookup);
	return lookup;
}

// A code ("FR") or a name in one of the languages ("France", "Allemagne"), ignoring case and accents.
export function countryCodeFromName(
	value: string,
	languages: ReadonlyArray<Language> = ["en"],
): Option.Option<CountryCode> {
	const asCode = value.trim().toUpperCase();
	if (Schema.is(CountryCode)(asCode)) return Option.some(asCode);
	return Option.fromNullishOr(lookupIn(languages).get(normalizeText(value)));
}
