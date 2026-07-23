import { cn } from "@voila.dev/ui/lib/utils";
import type maplibregl from "maplibre-gl";
import { type ReactNode, useCallback, useEffect, useState } from "react";
import { MapView } from "#/components/map-view.tsx";
import {
	circleBounds,
	circlePolygon,
	type GeoPoint,
} from "#/lib/geo-circle.ts";

const SOURCE_ID = "radius-map";
const FILL_LAYER = `${SOURCE_ID}-fill`;
const LINE_LAYER = `${SOURCE_ID}-line`;
const CENTER_LAYER = `${SOURCE_ID}-center`;

/**
 * The searched area, drawn: a geodesic circle of `radiusKm` around the chosen
 * place, with a dot on the place itself. The viewport follows the circle so the
 * whole area stays in frame while the radius slider moves.
 */
export function RadiusMap({
	center,
	radiusKm,
	color = "#1e3a8a",
	className,
	unavailableFallback,
}: {
	readonly center: GeoPoint;
	readonly radiusKm: number;
	/** Circle fill/stroke colour. Defaults to the kit's deep blue. */
	readonly color?: string;
	readonly className?: string;
	/** Shown when the environment has no WebGL; this package ships no copy. */
	readonly unavailableFallback?: ReactNode;
}) {
	const [map, setMap] = useState<maplibregl.Map | null>(null);

	// `onReady` replays after a theme-driven basemap swap, which drops custom
	// sources/layers: re-add them each time they are missing.
	const handleReady = useCallback(
		(instance: maplibregl.Map) => {
			if (instance.getSource(SOURCE_ID) === undefined) {
				instance.addSource(SOURCE_ID, {
					type: "geojson",
					data: { type: "FeatureCollection", features: [] },
				});
				instance.addLayer({
					id: FILL_LAYER,
					type: "fill",
					source: SOURCE_ID,
					filter: ["==", ["geometry-type"], "Polygon"],
					paint: { "fill-color": color, "fill-opacity": 0.12 },
				});
				instance.addLayer({
					id: LINE_LAYER,
					type: "line",
					source: SOURCE_ID,
					filter: ["==", ["geometry-type"], "Polygon"],
					paint: { "line-color": color, "line-width": 1.5 },
				});
				instance.addLayer({
					id: CENTER_LAYER,
					type: "circle",
					source: SOURCE_ID,
					filter: ["==", ["geometry-type"], "Point"],
					paint: {
						"circle-color": color,
						"circle-radius": 5,
						"circle-stroke-color": "#ffffff",
						"circle-stroke-width": 2,
					},
				});
			}
			setMap(instance);
		},
		[color],
	);

	useEffect(() => {
		if (map === null) {
			return;
		}
		const apply = () => {
			const source = map.getSource(SOURCE_ID) as
				| maplibregl.GeoJSONSource
				| undefined;
			if (source === undefined) {
				return;
			}
			source.setData({
				type: "FeatureCollection",
				features: [
					circlePolygon(center, radiusKm),
					{
						type: "Feature",
						geometry: {
							type: "Point",
							coordinates: [center.longitude, center.latitude],
						},
						properties: {},
					},
				],
			});
			const bounds = circleBounds(center, radiusKm);
			map.fitBounds(
				[
					[bounds.west, bounds.south],
					[bounds.east, bounds.north],
				],
				{ padding: 24, animate: false },
			);
		};
		if (map.isStyleLoaded()) {
			apply();
		} else {
			// "idle" (unlike "load") also fires after a theme-driven style swap.
			map.once("idle", apply);
		}
	}, [map, center, radiusKm]);

	return (
		<MapView
			className={cn("h-52 overflow-hidden rounded-lg border", className)}
			center={[center.longitude, center.latitude]}
			zoom={9}
			options={{ attributionControl: false }}
			onReady={handleReady}
			unavailableFallback={unavailableFallback}
		/>
	);
}
