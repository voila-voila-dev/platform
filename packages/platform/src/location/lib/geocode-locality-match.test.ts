import { describe, expect, it } from "bun:test";
import { geocodeMatchesLocality } from "#location/lib/geocode-locality-match";

describe("geocodeMatchesLocality", () => {
	it("rejects the commune that made this check exist", () => {
		expect(
			geocodeMatchesLocality(
				{ postalCode: "85000", city: "La Roche sur Yon" },
				{ postalCode: "17000", city: "La Rochelle" },
			),
		).toBe(false);
	});

	it("accepts a city spelt without the hyphens the geocoder uses", () => {
		expect(
			geocodeMatchesLocality(
				{ postalCode: "", city: "La Roche sur Yon" },
				{ postalCode: "85000", city: "La Roche-sur-Yon" },
			),
		).toBe(true);
	});

	it("accepts a neighbouring postal code of the same city", () => {
		expect(
			geocodeMatchesLocality(
				{ postalCode: "75001", city: "Paris" },
				{ postalCode: "75011", city: "Paris" },
			),
		).toBe(true);
	});

	it("accepts a commune the caller spelt their own way, on its postal code", () => {
		expect(
			geocodeMatchesLocality(
				{ postalCode: "35400", city: "Saint Malo" },
				{ postalCode: "35400", city: "Saint-Malo" },
			),
		).toBe(true);
	});

	it("rejects an answer that names neither the code nor the city", () => {
		expect(
			geocodeMatchesLocality(
				{ postalCode: "85000", city: "La Roche sur Yon" },
				{ postalCode: "", city: "" },
			),
		).toBe(false);
	});
});
