import { describe, expect, it } from "bun:test";
import { SupportedCountries } from "#location/lib/supported-countries";

const Markets = SupportedCountries.make(["FR", "LU"]);

describe("SupportedCountries", () => {
	it("builds one entry per supported country", () => {
		expect(Markets.per((country) => country.toLowerCase())).toEqual({
			FR: "fr",
			LU: "lu",
		});
	});

	it("tells a supported country from any other", () => {
		expect(Markets.is("LU")).toBe(true);
		expect(Markets.is("DE")).toBe(false);
	});
});
