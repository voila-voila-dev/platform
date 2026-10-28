import { afterEach, describe, expect, it } from "bun:test";
import { Option } from "effect";
import { countryCodeFromName, countryName } from "#location/lib/country-names";

const displayNames = Intl.DisplayNames;

describe("countryName", () => {
	afterEach(() => {
		Reflect.set(Intl, "DisplayNames", displayNames);
	});

	it("names the country in the locale", () => {
		expect(countryName("DE", "fr-FR")).toBe("Allemagne");
		expect(countryName("DE", "en-US")).toBe("Germany");
	});

	it("falls back to the code without Intl.DisplayNames, like on Hermes", () => {
		Reflect.deleteProperty(Intl, "DisplayNames");
		expect(countryName("FR", "fr-FR")).toBe("FR");
	});
});

describe("countryCodeFromName", () => {
	it("reads a code in any case", () => {
		expect(countryCodeFromName(" fr ")).toEqual(Option.some("FR"));
	});

	it("reads a name in the given languages, ignoring case and accents", () => {
		expect(countryCodeFromName("etats-unis", ["fr"])).toEqual(
			Option.some("US"),
		);
		expect(countryCodeFromName("Allemagne")).toEqual(Option.none());
		expect(countryCodeFromName("Germany")).toEqual(Option.some("DE"));
	});

	it("is none for text naming no country", () => {
		expect(countryCodeFromName("Atlantis", ["fr", "en"])).toEqual(
			Option.none(),
		);
	});
});
