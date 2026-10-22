import { describe, expect, it } from "bun:test";
import { distanceKm } from "#location/lib/distance-km";
import { Coordinates } from "#location/value-objects/coordinates";
import { Latitude } from "#location/value-objects/latitude";
import { Longitude } from "#location/value-objects/longitude";

function at(latitude: number, longitude: number): Coordinates {
	return Coordinates.make({
		latitude: Latitude.make(latitude),
		longitude: Longitude.make(longitude),
	});
}

const PARIS = at(48.8566, 2.3522);
const LYON = at(45.764, 4.8357);

describe("distanceKm", () => {
	it("is zero between a point and itself", () => {
		expect(distanceKm(PARIS, PARIS)).toBe(0);
	});

	it("measures Paris to Lyon at the known 391.5 km", () => {
		expect(distanceKm(PARIS, LYON)).toBeCloseTo(391.5, 1);
	});

	it("is symmetric", () => {
		expect(distanceKm(PARIS, LYON)).toBeCloseTo(distanceKm(LYON, PARIS), 9);
	});

	it("crosses the antimeridian the short way", () => {
		// 2° apart around 180°, not 358° the other way round.
		const west = at(0, 179);
		const east = at(0, -179);
		expect(distanceKm(west, east)).toBeCloseTo(222.4, 0);
	});

	it("measures a degree of latitude at about 111 km anywhere", () => {
		expect(distanceKm(at(0, 0), at(1, 0))).toBeCloseTo(111.19, 1);
		expect(distanceKm(at(60, 30), at(61, 30))).toBeCloseTo(111.19, 1);
	});
});
