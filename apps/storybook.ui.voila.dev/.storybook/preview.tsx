import { withThemeByClassName } from "@storybook/addon-themes";
import type { Preview } from "@storybook/tanstack-react";

import { applyPalette, PALETTES } from "./palettes";

import "../src/styles/globals.css";

const preview: Preview = {
	decorators: [
		// Applies the toolbar palette to the preview document. Stories render inside
		// this iframe, so the stylesheet goes in its head, not the manager's.
		(Story, context) => {
			applyPalette(String(context.globals.palette ?? "default"));
			return <Story />;
		},
		withThemeByClassName({
			themes: {
				light: "light",
				dark: "dark",
			},
			defaultTheme: "light",
		}),
	],
	initialGlobals: {
		palette: "default",
	},
	globalTypes: {
		palette: {
			description: "The @voila.dev/ui theme every story renders in",
			toolbar: {
				title: "Theme",
				icon: "paintbrush",
				dynamicTitle: true,
				items: PALETTES.map((palette) => ({
					value: palette.id,
					title: palette.title,
				})),
			},
		},
	},
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
