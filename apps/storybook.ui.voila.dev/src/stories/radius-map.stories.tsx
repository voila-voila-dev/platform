import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { RadiusMap } from "@voila.dev/ui/radius-map";

const meta = {
	title: "UI/RadiusMap",
	component: RadiusMap,
	tags: ["autodocs"],
	args: {
		className: "h-80 w-full overflow-hidden rounded-lg border",
		center: { latitude: 47.2184, longitude: -1.5536 },
		radiusKm: 25,
		unavailableFallback: "The map cannot be displayed in this environment.",
	},
	argTypes: {
		radiusKm: { control: { type: "range", min: 1, max: 200, step: 1 } },
	},
} satisfies Meta<typeof RadiusMap>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A tight radius — the circle should still frame sensibly at city scale. */
export const SmallRadius: Story = {
	args: { radiusKm: 3 },
};

/** Wide enough that the map has to zoom out to keep the circle in view. */
export const LargeRadius: Story = {
	args: { radiusKm: 150 },
};

export const DarkMode: Story = {
	parameters: { themes: { themeOverride: "dark" } },
};
