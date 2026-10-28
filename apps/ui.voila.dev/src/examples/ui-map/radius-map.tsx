import { RadiusMap } from "@voila.dev/ui/radius-map";
import { FRAME, NO_WEBGL } from "./fixtures";

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
