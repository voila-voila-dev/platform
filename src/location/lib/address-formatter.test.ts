import { describe, expect, it } from "bun:test";
import { AddressFormatter } from "#location/lib/address-formatter";
import { Address } from "#location/value-objects/address";
import { City } from "#location/value-objects/city";
import type { CountryCode } from "#location/value-objects/country-code";
import { PostalCode } from "#location/value-objects/postal-code";
import { Street } from "#location/value-objects/street";

function address(
	country: CountryCode,
	street: string,
	postalCode: string,
	city: string,
) {
	return new Address({
		street: Street.make(street),
		city: City.make(city),
		postalCode: PostalCode.make(postalCode),
		country,
	});
}

const formatter = AddressFormatter.make();

describe("AddressFormatter", () => {
	it("writes a French address the way La Poste wants it", () => {
		expect(
			formatter.lines(address("FR", "8 Boulevard du Port", "80000", "Amiens"), {
				locale: "fr-FR",
				from: "FR",
			}),
		).toEqual(["8 Boulevard du Port", "80000 AMIENS"]);
	});

	it("adds the country line, in the reader's language, for mail from abroad", () => {
		expect(
			formatter.lines(address("DE", "Friedrichstraße 1", "10969", "Berlin"), {
				locale: "fr-FR",
				from: "FR",
			}),
		).toEqual(["Friedrichstraße 1", "10969 Berlin", "Allemagne"]);
	});

	it("follows each country's order", () => {
		const options = { locale: "en-US", from: "FR" } as const;
		expect(
			formatter.lines(
				address("GB", "10 Downing Street", "SW1A 2AA", "London"),
				options,
			),
		).toEqual(["10 Downing Street", "LONDON", "SW1A 2AA", "United Kingdom"]);
		expect(
			formatter.lines(address("LU", "2 rue du Fort", "2419", "Luxembourg"), {
				locale: "fr-FR",
				from: "LU",
			}),
		).toEqual(["2 rue du Fort", "L-2419 Luxembourg"]);
	});

	it("writes a Japanese address in its own order, and a romanised one the Latin way", () => {
		const options = { locale: "ja-JP", from: "JP" } as const;
		expect(
			formatter.lines(
				address("JP", "丸の内1-1", "100-0005", "千代田区"),
				options,
			),
		).toEqual(["〒100-0005", "千代田区", "丸の内1-1"]);
		expect(
			formatter.lines(
				address("JP", "1-1 Marunouchi", "100-0005", "Chiyoda-ku"),
				options,
			),
		).toEqual(["1-1 Marunouchi", "Chiyoda-ku", "100-0005"]);
	});

	it("takes an app's own template or formatter for a country", () => {
		const custom = AddressFormatter.make({
			formats: {
				FR: { template: "%A%n%Z %C" },
				DE: (de) => [`${de.street} · ${de.postalCode} ${de.city}`],
			},
		});
		const options = { locale: "fr-FR", from: "FR" } as const;
		expect(
			custom.lines(
				address("FR", "1 rue de la Paix", "75002", "Paris"),
				options,
			),
		).toEqual(["1 rue de la Paix", "75002 Paris"]);
		expect(
			custom.singleLine(
				address("DE", "Friedrichstraße 1", "10969", "Berlin"),
				options,
			),
		).toBe("Friedrichstraße 1 · 10969 Berlin, Allemagne");
	});
});
