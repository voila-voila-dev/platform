import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { GlobeView } from "@voila.dev/ui/globe-view";

const meta = {
	title: "UI/GlobeView",
	component: GlobeView,
	tags: ["autodocs"],
	args: {
		className: "h-96",
		options: { cooperativeGestures: true },
		unavailableFallback: "The globe cannot be displayed in this environment.",
	},
} satisfies Meta<typeof GlobeView>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Spinning, which is what the globe is for — a hero, not a data surface. */
export const Default: Story = {
	args: { spin: 3 },
};

/**
 * Held still at a framing. Reach for this when the globe sits beside copy that
 * the motion would otherwise compete with.
 */
export const Still: Story = {
	args: { center: [-30, 25], zoom: 1.1 },
};

export const WithMarkers: Story = {
	args: {
		spin: 3,
		markers: [
			{ lngLat: [2.3522, 48.8566], pulse: true },
			{ lngLat: [-122.4194, 37.7749], pulse: true },
			{ lngLat: [139.6917, 35.6895] },
		],
	},
};

/** The dark basemap is picked up from the theme class, as on `MapView`. */
export const DarkMode: Story = {
	args: { spin: 3 },
	parameters: { themes: { themeOverride: "dark" } },
};
