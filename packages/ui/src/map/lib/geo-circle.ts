/** A WGS84 point. Structural, so any `{ latitude, longitude }` fits. */
export type GeoPoint = {
	readonly latitude: number;
	readonly longitude: number;
};

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;
const toDegrees = (radians: number): number => (radians * 180) / Math.PI;

/** Structural GeoJSON Polygon feature, assignable to a MapLibre geojson source. */
export type CirclePolygonFeature = {
	readonly type: "Feature";
	readonly geometry: {
		readonly type: "Polygon";
		readonly coordinates: [number, number][][];
	};
	readonly properties: Record<string, never>;
};

/**
 * A geodesic circle around `center` as a closed GeoJSON Polygon ring
 * (`segments` + 1 points, first == last), for MapLibre fill/line layers such
 * as the intervention-radius overlay. Each ring point is projected with the
 * direct great-circle formula, so the drawn radius stays true at any latitude
 * (a naive degree offset would flatten the circle away from the equator).
 */
export const circlePolygon = (
	center: GeoPoint,
	radiusKm: number,
	segments = 64,
): CirclePolygonFeature => {
	const angularDistance = radiusKm / EARTH_RADIUS_KM;
	const centerLatitude = toRadians(center.latitude);
	const centerLongitude = toRadians(center.longitude);
	const ring: [number, number][] = [];
	for (let step = 0; step <= segments; step++) {
		const bearing = (step / segments) * 2 * Math.PI;
		const pointLatitude = Math.asin(
			Math.sin(centerLatitude) * Math.cos(angularDistance) +
				Math.cos(centerLatitude) *
					Math.sin(angularDistance) *
					Math.cos(bearing),
		);
		const pointLongitude =
			centerLongitude +
			Math.atan2(
				Math.sin(bearing) *
					Math.sin(angularDistance) *
					Math.cos(centerLatitude),
				Math.cos(angularDistance) -
					Math.sin(centerLatitude) * Math.sin(pointLatitude),
			);
		ring.push([toDegrees(pointLongitude), toDegrees(pointLatitude)]);
	}
	return {
		type: "Feature",
		geometry: { type: "Polygon", coordinates: [ring] },
		properties: {},
	};
};

/**
 * The circle's bounding box (WGS84 degrees), for `fitBounds`. Derived from the
 * ring points so it shares the geodesic math above.
 */
export const circleBounds = (
	center: GeoPoint,
	radiusKm: number,
): { west: number; south: number; east: number; north: number } => {
	const ring = circlePolygon(center, radiusKm).geometry.coordinates[0];
	let west = Number.POSITIVE_INFINITY;
	let south = Number.POSITIVE_INFINITY;
	let east = Number.NEGATIVE_INFINITY;
	let north = Number.NEGATIVE_INFINITY;
	for (const [longitude, latitude] of ring) {
		west = Math.min(west, longitude);
		south = Math.min(south, latitude);
		east = Math.max(east, longitude);
		north = Math.max(north, latitude);
	}
	return { west, south, east, north };
};
