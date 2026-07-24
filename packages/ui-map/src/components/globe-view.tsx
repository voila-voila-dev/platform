import { Skeleton } from "@voila.dev/ui/components/skeleton";
import { cn } from "@voila.dev/ui/lib/utils";
import type maplibregl from "maplibre-gl";
import { type ComponentProps, lazy, type ReactNode, Suspense } from "react";

/** A point of interest on the globe, rendered as a token-coloured dot. */
export type GlobeMarker = {
	/** `[longitude, latitude]` in WGS84 degrees. */
	readonly lngLat: readonly [number, number];
	/** Adds a slow expanding ring behind the dot. */
	readonly pulse?: boolean;
};

/**
 * `MapView`'s sibling, same contract: free key-less OpenFreeMap basemaps
 * ("liberty" light / "dark" dark) following the `.dark` subtree live, both
 * overridable via `styleUrl`. The differences are the projection — MapLibre's
 * native globe — plus an optional auto-rotation and declarative markers.
 */
export type GlobeViewProps = Omit<ComponentProps<"div">, "children"> & {
	/**
	 * Vector style URL. Read once, on mount; defaults to the OpenFreeMap
	 * "liberty" basemap — or its "dark" variant while inside a `.dark` subtree,
	 * following theme switches. An explicit URL opts out of theme following.
	 */
	readonly styleUrl?: string;
	/** Initial center `[longitude, latitude]`. Read once, on mount. */
	readonly center?: readonly [number, number];
	/** Initial zoom. Read once, on mount. */
	readonly zoom?: number;
	/**
	 * Auto-rotation speed in degrees of longitude per second; `0` (the default)
	 * disables it. Rotation pauses while the pointer is down and is skipped
	 * entirely under `prefers-reduced-motion`. Read once, on mount.
	 */
	readonly spin?: number;
	/** Markers to place, coloured from the token palette. Read once, on mount. */
	readonly markers?: ReadonlyArray<GlobeMarker>;
	/**
	 * Extra MapLibre constructor options (`cooperativeGestures`,
	 * `attributionControl`…). Read once, on mount.
	 */
	readonly options?: Omit<
		maplibregl.MapOptions,
		"container" | "style" | "center" | "zoom"
	>;
	/**
	 * Called once the basemap, globe projection and atmosphere are ready, with
	 * the live MapLibre instance. A theme switch swaps the basemap style (which
	 * drops custom sources/layers) and calls this again, so the setup must
	 * tolerate re-runs. The instance is removed on unmount.
	 */
	readonly onReady?: (map: maplibregl.Map) => void;
	/**
	 * Rendered in place of the globe when WebGL is unavailable
	 * (sandboxed/headless browsers, disabled GPU). Defaults to a static globe
	 * outline drawn in `--muted`.
	 */
	readonly unavailableFallback?: ReactNode;
};

// Same discipline as `MapView`: `maplibre-gl` weighs ~270 kB gzipped, so the
// rendering body lives in its own module and only downloads once a globe
// actually mounts. Type-only imports of `maplibre-gl` stay free.
const GlobeViewImplementation = lazy(() =>
	import("#/components/globe-view-implementation.tsx").then((module) => ({
		default: module.GlobeViewImplementation,
	})),
);

/**
 * A 3D globe on MapLibre's native globe projection and the same free, key-less
 * vector tiles as `MapView`. The atmosphere halo is tinted from the token
 * palette (`--primary` in dark mode, a soft slate in light), the space behind
 * the globe stays transparent so the surrounding section's background shows
 * through, and the MapLibre runtime is code-split behind a pulsing skeleton.
 */
export function GlobeView({ className, ...props }: GlobeViewProps) {
	return (
		<Suspense
			fallback={
				<div
					data-slot="globe-view"
					className={cn("h-[70vh] w-full overflow-hidden", className)}
				>
					<Skeleton className="mx-auto aspect-square h-full max-w-full rounded-full" />
				</div>
			}
		>
			<GlobeViewImplementation className={className} {...props} />
		</Suspense>
	);
}
