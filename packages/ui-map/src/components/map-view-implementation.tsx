import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@voila.dev/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { MapViewProps } from "#/components/map-view.tsx";

export const DEFAULT_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
export const DEFAULT_DARK_STYLE_URL =
	"https://tiles.openfreemap.org/styles/dark";

/** Western Europe — a sensible default frame for the whole dataset. */
const DEFAULT_CENTER: readonly [number, number] = [2.3522, 48.8566];
const DEFAULT_ZOOM = 5;

/**
 * The MapLibre-backed body of `MapView`. This module owns the only runtime
 * import of `maplibre-gl` (and its stylesheet) in the package, so it is loaded
 * through `React.lazy` from `map-view.tsx` — keeping the heavy dependency out
 * of every bundle that merely links to the map component. Import `MapView`
 * from `#/components/map-view.tsx` instead of using this directly.
 */
export function MapViewImplementation({
	styleUrl,
	center = DEFAULT_CENTER,
	zoom = DEFAULT_ZOOM,
	options,
	className,
	onReady,
	onMoveEnd,
	unavailableFallback,
	...props
}: MapViewProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const onReadyRef = useRef(onReady);
	onReadyRef.current = onReady;
	const onMoveEndRef = useRef(onMoveEnd);
	onMoveEndRef.current = onMoveEnd;
	// Initial view, style and options are captured on mount only; later prop
	// changes don't re-center or restyle.
	const initialRef = useRef({ center, zoom, styleUrl, options });
	// Set when the basemap can't initialize (no WebGL: sandboxed/headless
	// browsers, disabled GPU); we render a fallback instead of crashing.
	const [unavailable, setUnavailable] = useState(false);
	// Tiles stream in for a few seconds after mount; pulse the box until the
	// style is ready so the wait doesn't read as a broken blank map.
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		if (container === null) {
			return;
		}
		const initial = initialRef.current;
		// Mirrors the CSS `dark` variant (`.dark *`): default to the dark basemap
		// under a themed subtree when no explicit style was given.
		const themedStyleUrl = () =>
			container.closest(".dark") === null
				? DEFAULT_STYLE_URL
				: DEFAULT_DARK_STYLE_URL;
		const defaultStyleUrl = themedStyleUrl();
		// MapLibre already skips ease/fly camera animations under reduced motion,
		// but tile crossfades are opt-out only; mirror the preference here.
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		let instance: maplibregl.Map;
		try {
			instance = new maplibregl.Map({
				...(prefersReducedMotion ? { fadeDuration: 0 } : undefined),
				...initial.options,
				container,
				style: initial.styleUrl ?? defaultStyleUrl,
				center: [initial.center[0], initial.center[1]],
				zoom: initial.zoom,
			});
		} catch {
			// WebGL is required and isn't available in this environment. Surface a
			// fallback rather than letting the throw bubble out of the effect.
			setUnavailable(true);
			return;
		}
		instance.addControl(new maplibregl.NavigationControl(), "top-right");

		const emitMove = () => {
			const bounds = instance.getBounds();
			onMoveEndRef.current?.(
				{
					west: bounds.getWest(),
					south: bounds.getSouth(),
					east: bounds.getEast(),
					north: bounds.getNorth(),
				},
				instance.getZoom(),
			);
		};
		const handleReady = () => {
			setLoaded(true);
			onReadyRef.current?.(instance);
			emitMove();
		};
		if (instance.isStyleLoaded()) {
			handleReady();
		} else {
			instance.once("load", handleReady);
		}
		instance.on("moveend", emitMove);

		// Follow theme switches: the `.dark` class can land after mount (theme
		// providers and Storybook's themes addon apply it in an effect) or toggle
		// live. Swap the basemap when it does and replay `handleReady` once the new
		// style is in, so consumers re-add the sources/layers the swap dropped.
		let themeObserver: MutationObserver | undefined;
		if (initial.styleUrl === undefined) {
			let appliedStyleUrl = defaultStyleUrl;
			themeObserver = new MutationObserver(() => {
				const nextStyleUrl = themedStyleUrl();
				if (nextStyleUrl === appliedStyleUrl) {
					return;
				}
				appliedStyleUrl = nextStyleUrl;
				instance.setStyle(nextStyleUrl);
				instance.once("style.load", handleReady);
			});
			themeObserver.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["class"],
				subtree: true,
			});
		}

		// The container may finish sizing after construction (flex/grid, sidebar
		// toggles); keep the canvas matched so tiles fill the box.
		const resizeObserver = new ResizeObserver(() => instance.resize());
		resizeObserver.observe(container);
		return () => {
			themeObserver?.disconnect();
			resizeObserver.disconnect();
			instance.remove();
		};
	}, []);

	return (
		<div
			data-slot="map-view"
			className={cn(
				"h-[70vh] w-full overflow-hidden rounded-lg border",
				// MapLibre ships white control chrome (zoom buttons, attribution);
				// invert it — hue-rotated back so link colors survive — when the map
				// sits in a dark subtree.
				"dark:[&_.maplibregl-ctrl]:hue-rotate-180 dark:[&_.maplibregl-ctrl]:invert",
				className,
			)}
			{...props}
		>
			{unavailable ? (
				<div
					data-slot="map-view-fallback"
					className="flex h-full w-full items-center justify-center p-4 text-center text-muted-foreground text-sm"
				>
					{unavailableFallback}
				</div>
			) : (
				<div
					ref={containerRef}
					data-slot="map-view-canvas"
					data-loaded={loaded}
					// The className must stay identical across renders: MapLibre adds
					// its own `maplibregl-map` class (relative + overflow clipping) to
					// this node imperatively, and any className change makes React
					// rewrite the attribute and drop it — the map then escapes the box.
					className="h-full w-full data-[loaded=false]:animate-pulse data-[loaded=false]:bg-muted motion-reduce:animate-none"
				/>
			)}
		</div>
	);
}
