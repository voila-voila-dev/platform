import { GlobeView } from "@voila.dev/ui/globe-view";
import { NO_WEBGL } from "./fixtures";

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
