import { MapView } from "@voila.dev/ui/map-view";
import { FRAME, NO_WEBGL } from "./fixtures";

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
