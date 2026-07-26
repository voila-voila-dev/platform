/**
 * The default basemap styles, kept out of `map-view-implementation.tsx` so a
 * consumer can read them without pulling the lazily-loaded MapLibre chunk into
 * its graph.
 */
export const DEFAULT_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";

export const DEFAULT_DARK_STYLE_URL =
	"https://tiles.openfreemap.org/styles/dark";
