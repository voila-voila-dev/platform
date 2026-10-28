import { describe, expect, it } from "bun:test";
import { numericCountryCode } from "#location/lib/numeric-country-code";

describe("numericCountryCode", () => {
	it("gives the ISO 3166-1 numeric code, without its leading zeros", () => {
		expect(numericCountryCode("FR")).toBe(250);
		expect(numericCountryCode("AF")).toBe(4);
	});
});
