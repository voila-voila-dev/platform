import type { Coordinates } from "#location/value-objects/coordinates";

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

// Haversine: a sphere is a fraction of a percent off the ellipsoid at travel distances.
export function distanceKm(from: Coordinates, to: Coordinates): number {
	const latitudeDelta = toRadians(to.latitude - from.latitude);
	const longitudeDelta = toRadians(to.longitude - from.longitude);
	const a =
		Math.sin(latitudeDelta / 2) ** 2 +
		Math.cos(toRadians(from.latitude)) *
			Math.cos(toRadians(to.latitude)) *
			Math.sin(longitudeDelta / 2) ** 2;
	return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
