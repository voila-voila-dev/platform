import type maplibregl from "maplibre-gl";
import { type ComponentProps, lazy, type ReactNode, Suspense } from "react";
import { cn } from "#/lib/utils.ts";
import { Skeleton } from "#/skeleton/components/skeleton.tsx";

/** A geographic bounding box in WGS84 (EPSG:4326) degrees. */
export type MapBounds = {
	readonly west: number;
	readonly south: number;
	readonly east: number;
	readonly north: number;
};

/**
 * Free, key-less vector basemaps. "liberty" is the light default; the "dark"
 * variant is selected automatically while the component sits inside a `.dark`
 * subtree, and the basemap restyles live when that class toggles. Both are
 * overridable via the `styleUrl` prop (e.g. a MapTiler/Mapbox style for richer
 * cartography). The URL constants live in `map-view-implementation.tsx` with
 * the rest of the runtime map code.
 */
interface Props extends Omit<ComponentProps<"div">, "children"> {
	/**
	 * Vector style URL. Read once, on mount; defaults to the OpenFreeMap
	 * "liberty" basemap — or its "dark" variant while inside a `.dark` subtree,
	 * following theme switches. An explicit URL opts out of theme following.
	 */
	readonly styleUrl?: string;
	/**
	 * Initial center `[longitude, latitude]`. Read once, on mount; defaults to
	 * `[2.3522, 48.8566]`.
	 */
	readonly center?: readonly [number, number];
	/** Initial zoom. Read once, on mount; defaults to `5`. */
	readonly zoom?: number;
	/**
	 * Extra MapLibre constructor options (`maxBounds`, `cooperativeGestures`,
	 * `attributionControl`…). Read once, on mount.
	 */
	readonly options?: Omit<
		maplibregl.MapOptions,
		"container" | "style" | "center" | "zoom"
	>;
	/**
	 * Called once the basemap and its style are ready, with the live MapLibre
	 * instance — add sources, layers and markers here. A theme switch swaps the
	 * basemap style (which drops custom sources/layers) and calls this again, so
	 * the setup must tolerate re-runs. The instance is removed on unmount, so
	 * don't retain it past the component's lifetime.
	 */
	readonly onReady?: (map: maplibregl.Map) => void;
	/**
	 * Called after the view settles — once on load and after every pan/zoom — with
	 * the current bounds and zoom. Drives viewport-scoped data fetching.
	 */
	readonly onMoveEnd?: (bounds: MapBounds, zoom: number) => void;
	/**
	 * Rendered in place of the map when the basemap can't initialize because the
	 * environment has no WebGL (sandboxed/headless browsers, disabled GPU). This
	 * package is translation-agnostic, so consumers pass their own localized node.
	 */
	readonly unavailableFallback?: ReactNode;
}

// `maplibre-gl` weighs ~270 kB gzipped, so the rendering body lives in its own
// module and only downloads once a map actually mounts. Type-only imports of
// `maplibre-gl` (like the one above) stay free — they're erased at compile time.
const MapViewImplementation = lazy(() =>
	import("#/map-view/components/map-view-implementation.tsx").then(
		(module) => ({
			default: module.MapViewImplementation,
		}),
	),
);

/**
 * Thin, reusable MapLibre GL basemap: it owns the canvas, lifecycle, navigation
 * control and resize handling, and surfaces the instance (`onReady`) and view
 * changes (`onMoveEnd`). It is deliberately presentational and data-agnostic, so
 * any feature — the admin map's clustered entities, a single freelancer-profile
 * pin, a client office — composes its own sources/layers on top.
 *
 * The MapLibre runtime is code-split: while its chunk downloads, a skeleton
 * with the same frame pulses in place, matching the tile-streaming placeholder
 * the loaded map shows next.
 */
export function MapView({ className, ...props }: Props) {
	return (
		<Suspense
			fallback={
				<div
					data-slot="map-view"
					className={cn("h-[70vh] w-full overflow-hidden", className)}
				>
					<Skeleton className="h-full w-full rounded-none" />
				</div>
			}
		>
			<MapViewImplementation className={className} {...props} />
		</Suspense>
	);
}
