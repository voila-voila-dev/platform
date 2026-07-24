import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@voila.dev/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import type { GlobeViewProps } from "#/components/globe-view.tsx";
import {
	DEFAULT_DARK_STYLE_URL,
	DEFAULT_STYLE_URL,
} from "#/components/map-view-implementation.tsx";

/** A whole hemisphere in frame — the sensible default for a globe. */
const DEFAULT_CENTER: readonly [number, number] = [2.3522, 30];
const DEFAULT_ZOOM = 1.4;

/**
 * Resolves a CSS colour expression (`var(--primary)`, `color-mix(…)`) to the
 * `rgba()` string MapLibre's style parser accepts. The probe element gives the
 * expression the right custom-property scope; the 1×1 canvas normalises
 * whatever colour space the computed value serialises to.
 */
function resolveCssColor(
	scope: HTMLElement,
	expression: string,
	fallback: string,
): string {
	const probe = document.createElement("span");
	probe.style.display = "none";
	probe.style.color = expression;
	scope.appendChild(probe);
	const computed = getComputedStyle(probe).color;
	probe.remove();
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const context = canvas.getContext("2d");
	if (context === null) {
		return fallback;
	}
	context.fillStyle = fallback;
	context.fillStyle = computed;
	context.fillRect(0, 0, 1, 1);
	const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
	return `rgba(${r}, ${g}, ${b}, ${((a ?? 0) / 255).toFixed(3)})`;
}

/** The default WebGL-less fallback: a static globe outline in `--muted`. */
function StaticGlobeOutline() {
	return (
		<svg
			aria-hidden
			viewBox="0 0 100 100"
			className="mx-auto aspect-square h-full max-w-full text-muted"
		>
			<title>Globe unavailable</title>
			<circle
				cx="50"
				cy="50"
				r="48"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<ellipse
				cx="50"
				cy="50"
				rx="24"
				ry="48"
				fill="none"
				stroke="currentColor"
			/>
			<ellipse
				cx="50"
				cy="50"
				rx="44"
				ry="48"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.5"
			/>
			<line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" />
			<path d="M 7 26 A 60 60 0 0 1 93 26" fill="none" stroke="currentColor" />
			<path d="M 7 74 A 60 60 0 0 0 93 74" fill="none" stroke="currentColor" />
		</svg>
	);
}

/**
 * The MapLibre-backed body of `GlobeView`, loaded through `React.lazy` from
 * `globe-view.tsx` so the ~270 kB runtime never rides along with a page that
 * merely links to it. Import `GlobeView` instead of using this directly.
 */
export function GlobeViewImplementation({
	styleUrl,
	center = DEFAULT_CENTER,
	zoom = DEFAULT_ZOOM,
	spin = 0,
	markers = [],
	options,
	className,
	onReady,
	unavailableFallback,
	...props
}: GlobeViewProps) {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const onReadyRef = useRef(onReady);
	onReadyRef.current = onReady;
	// Initial view, style, rotation and markers are captured on mount only;
	// later prop changes don't re-center, restyle or re-pin.
	const initialRef = useRef({ center, zoom, styleUrl, spin, markers, options });
	const [unavailable, setUnavailable] = useState(false);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const container = containerRef.current;
		if (container === null) {
			return;
		}
		const initial = initialRef.current;
		const themedStyleUrl = () =>
			container.closest(".dark") === null
				? DEFAULT_STYLE_URL
				: DEFAULT_DARK_STYLE_URL;
		const defaultStyleUrl = themedStyleUrl();
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
			// WebGL is required and isn't available in this environment.
			setUnavailable(true);
			return;
		}

		// Markers are DOM overlays, so they survive `setStyle` and are added once.
		for (const marker of initial.markers) {
			const element = document.createElement("span");
			element.className = "relative flex size-3";
			if (marker.pulse) {
				const ring = document.createElement("span");
				ring.className =
					"absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none";
				element.appendChild(ring);
			}
			const dot = document.createElement("span");
			dot.className =
				"relative inline-flex size-3 rounded-full bg-primary shadow-[0_0_10px_2px] shadow-primary/50";
			element.appendChild(dot);
			new maplibregl.Marker({ element })
				.setLngLat([marker.lngLat[0], marker.lngLat[1]])
				.addTo(instance);
		}

		// Projection and sky are style-level state: a theme switch's `setStyle`
		// drops them, so `handleReady` re-applies both on every style load.
		const handleReady = () => {
			instance.setProjection({ type: "globe" });
			const dark = container.closest(".dark") !== null;
			// Indigo `--primary` glow in dark mode, a soft slate halo in light —
			// resolved from the live token values so a rebrand retints the globe.
			const halo = resolveCssColor(
				container,
				dark
					? "color-mix(in oklab, var(--primary) 65%, transparent)"
					: "color-mix(in oklab, var(--muted-foreground) 45%, transparent)",
				dark ? "rgba(99, 102, 241, 0.65)" : "rgba(100, 116, 139, 0.45)",
			);
			const fog = resolveCssColor(
				container,
				dark
					? "color-mix(in oklab, var(--primary) 25%, transparent)"
					: "color-mix(in oklab, var(--muted-foreground) 20%, transparent)",
				dark ? "rgba(99, 102, 241, 0.25)" : "rgba(100, 116, 139, 0.2)",
			);
			instance.setSky({
				// Transparent space, so the section's `bg-background` shows through.
				"sky-color": "rgba(0, 0, 0, 0)",
				"horizon-color": halo,
				"fog-color": fog,
				"sky-horizon-blend": 0.8,
				"horizon-fog-blend": 0.5,
				"fog-ground-blend": 0.9,
				"atmosphere-blend": 0.8,
			});
			setLoaded(true);
			onReadyRef.current?.(instance);
		};
		if (instance.isStyleLoaded()) {
			handleReady();
		} else {
			instance.once("load", handleReady);
		}

		// Same live theme following as `MapView`.
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

		// Auto-rotation: a rAF loop nudging the longitude, paused while the
		// pointer is down so a drag never fights the spin, skipped entirely under
		// reduced motion. `jumpTo` (not `easeTo`) keeps each step animation-free.
		let frame = 0;
		let interacting = false;
		const handlePointerDown = () => {
			interacting = true;
		};
		const handlePointerUp = () => {
			interacting = false;
		};
		if (initial.spin !== 0 && !prefersReducedMotion) {
			container.addEventListener("pointerdown", handlePointerDown);
			window.addEventListener("pointerup", handlePointerUp);
			let last: number | undefined;
			const step = (now: number) => {
				if (last !== undefined && !interacting) {
					const current = instance.getCenter();
					instance.jumpTo({
						center: [
							current.lng + (initial.spin * (now - last)) / 1000,
							current.lat,
						],
					});
				}
				last = now;
				frame = requestAnimationFrame(step);
			};
			frame = requestAnimationFrame(step);
		}

		const resizeObserver = new ResizeObserver(() => instance.resize());
		resizeObserver.observe(container);
		return () => {
			cancelAnimationFrame(frame);
			container.removeEventListener("pointerdown", handlePointerDown);
			window.removeEventListener("pointerup", handlePointerUp);
			themeObserver?.disconnect();
			resizeObserver.disconnect();
			instance.remove();
		};
	}, []);

	return (
		<div
			data-slot="globe-view"
			className={cn(
				"h-[70vh] w-full overflow-hidden",
				"dark:[&_.maplibregl-ctrl]:hue-rotate-180 dark:[&_.maplibregl-ctrl]:invert",
				className,
			)}
			{...props}
		>
			{unavailable ? (
				<div data-slot="globe-view-fallback" className="h-full w-full p-4">
					{unavailableFallback ?? <StaticGlobeOutline />}
				</div>
			) : (
				<div
					ref={containerRef}
					data-slot="globe-view-canvas"
					data-loaded={loaded}
					// Keep this className identical across renders — MapLibre adds its
					// own class to the node imperatively (see MapView for the story).
					className="h-full w-full"
				/>
			)}
		</div>
	);
}
