// A geocoder answers its best row however poor: asked for a venue it does not hold
// ("Stade Henri Desgrange 85000 La Roche sur Yon"), BAN answers a same-sounding street
// 60 km away. An answer counts only in the city asked for: same postal code or same name.
function normalizePlaceName(value: string): string {
	return value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/gu, "")
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, " ")
		.trim();
}

export interface GeocodeLocality {
	readonly postalCode: string;
	readonly city: string;
}

export function geocodeMatchesLocality(
	requested: GeocodeLocality,
	resolved: GeocodeLocality,
): boolean {
	const requestedPostalCode = requested.postalCode.trim();
	const resolvedPostalCode = resolved.postalCode.trim();
	if (
		requestedPostalCode.length > 0 &&
		requestedPostalCode === resolvedPostalCode
	) {
		return true;
	}
	const requestedCity = normalizePlaceName(requested.city);
	return (
		requestedCity.length > 0 &&
		requestedCity === normalizePlaceName(resolved.city)
	);
}
