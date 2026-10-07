import { describe, expect, it } from "vitest";

import { compileChart } from "#/core/compile.ts";
import { defineChart } from "#/core/define-chart.ts";
import { findNearest, focusStops } from "#/core/nearest.ts";
import { geoDot, geoShape, projection } from "#/geo/geo.ts";

/** Two squares a degree apart, wound clockwise as d3-geo expects of an exterior ring. */
function square(name: string, west: number, missions: number) {
	return {
		type: "Feature" as const,
		properties: { name, missions },
		geometry: {
			type: "Polygon",
			coordinates: [
				[
					[west, 45],
					[west, 46],
					[west + 1, 46],
					[west + 1, 45],
					[west, 45],
				],
			],
		},
	};
}

const regions = [square("Ouest", 0, 10), square("Est", 2, 40)];
const collection = { type: "FeatureCollection" as const, features: regions };

describe("geo", () => {
	const scene = compileChart(
		defineChart({
			projection: projection("mercator", { domain: collection as never }),
			marks: [
				geoShape(regions, {
					name: (feature) => feature.properties.name,
					color: (feature) => feature.properties.missions,
					label: "Missions",
				}),
				geoDot([{ city: "Lyon", lon: 2.5, lat: 45.5 }], {
					longitude: "lon",
					latitude: "lat",
					name: "city",
					r: 5,
				}),
			],
		}),
		{ width: 400, height: 200 },
	);

	it("fits the domain into the plot and colours each region by its value", () => {
		expect(scene.scales.color?.kind).toBe("sequential");
		for (const point of scene.points) {
			expect(point.x).toBeGreaterThan(0);
			expect(point.x).toBeLessThan(400);
		}
		expect(scene.points.map((point) => point.title)).toEqual([
			"Ouest",
			"Est",
			"Lyon",
		]);
		expect(scene.points[0].x).toBeLessThan(scene.points[1].x);
	});

	it("hits the dot before the region under it", () => {
		const lyon = scene.points[2];
		const hit = findNearest(scene, focusStops(scene), lyon.x, lyon.y);
		expect(hit?.stop).toBe(2);
	});
});
