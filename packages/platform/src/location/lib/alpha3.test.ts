import { describe, expect, it } from "bun:test";
import { alpha3CountryCode, countryCodeFromAlpha3 } from "#location/lib/alpha3";

describe("alpha-3 country codes", () => {
	it("reads both ways", () => {
		expect(alpha3CountryCode("DE")).toBe("DEU");
		expect(countryCodeFromAlpha3("deu")).toBe("DE");
		expect(countryCodeFromAlpha3("XXX")).toBeUndefined();
	});
});
