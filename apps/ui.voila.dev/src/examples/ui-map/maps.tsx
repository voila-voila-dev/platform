import { GlobeView } from "@voila.dev/ui-map/components/globe-view";
import { MapView } from "@voila.dev/ui-map/components/map-view";
import { RadiusMap } from "@voila.dev/ui-map/components/radius-map";

const FRAME = "h-80 w-full overflow-hidden rounded-lg border";
const NO_WEBGL = (
	<p className="p-6 text-muted-foreground text-sm">
		This browser has no WebGL, so the map cannot render.
	</p>
);

export function Basic() {
	return (
		<MapView
			className={FRAME}
			center={[2.3522, 48.8566]}
			zoom={11}
			unavailableFallback={NO_WEBGL}
		/>
	);
}

export function Globe() {
	return (
		<GlobeView
			className="h-96 w-full"
			spin={3}
			markers={[
				{ lngLat: [2.3522, 48.8566], pulse: true },
				{ lngLat: [-122.4194, 37.7749], pulse: true },
				{ lngLat: [139.6917, 35.6895] },
			]}
			options={{ cooperativeGestures: true }}
			unavailableFallback={NO_WEBGL}
		/>
	);
}

export function GlobeStill() {
	return (
		<GlobeView
			className="h-96 w-full"
			center={[-30, 25]}
			zoom={1.1}
			options={{ cooperativeGestures: true }}
			unavailableFallback={NO_WEBGL}
		/>
	);
}

export function Radius() {
	return (
		<RadiusMap
			className={FRAME}
			center={{ latitude: 47.2184, longitude: -1.5536 }}
			radiusKm={25}
			unavailableFallback={NO_WEBGL}
		/>
	);
}
