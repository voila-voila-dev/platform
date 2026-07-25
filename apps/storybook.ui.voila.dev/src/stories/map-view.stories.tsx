import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { MapView } from "@voila.dev/ui/map/map-view";
import maplibregl from "maplibre-gl";

const meta = {
	title: "UI/MapView",
	component: MapView,
	tags: ["autodocs"],
	args: {
		center: [2.3522, 48.8566],
		zoom: 11,
		// Defaults merge via cn, so overriding the height is enough.
		className: "h-96",
		unavailableFallback: "The map cannot be displayed in this environment.",
	},
} satisfies Meta<typeof MapView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FranceOverview: Story = {
	args: {
		center: [2.2137, 46.2276],
		zoom: 5,
	},
};

/**
 * The dark OpenFreeMap basemap is picked up automatically under `.dark`. The
 * component watches for theme class changes, so the addon override is enough
 * even though it applies its class in an effect, after the map mounted.
 */
export const DarkMode: Story = {
	parameters: { themes: { themeOverride: "dark" } },
};

/** Composing markers through `onReady` — how feature code builds on the basemap. */
export const WithMarker: Story = {
	args: {
		onReady: (map) => {
			const marker = new maplibregl.Marker()
				.setLngLat([2.3522, 48.8566])
				.addTo(map);
			marker.getElement().dataset.testid = "story-marker";
		},
	},
};

/**
 * Forces the WebGL-unavailable path for the fallback story: canvases mounted
 * under a `[data-webgl-unavailable]` wrapper get no rendering context, so the
 * MapLibre constructor throws there. Scoped by ancestry instead of a global
 * patch-and-restore, which would race with StrictMode's double-run effects;
 * canvases in every other story keep their real context.
 */
const originalGetContext = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function (
	this: HTMLCanvasElement,
	...args: Parameters<typeof originalGetContext>
) {
	if (this.closest("[data-webgl-unavailable]") !== null) {
		return null;
	}
	return originalGetContext.apply(this, args as never) as ReturnType<
		HTMLCanvasElement["getContext"]
	>;
} as typeof originalGetContext;

export const UnavailableFallback: Story = {
	decorators: [
		(StoryComponent) => (
			<div data-webgl-unavailable>
				<StoryComponent />
			</div>
		),
	],
};
