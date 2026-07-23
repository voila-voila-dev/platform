import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://ui.voila.dev",
	integrations: [
		react(),
		starlight({
			title: "ui.voila.dev",
			description:
				"A source-shipped React + Tailwind component system. Copy the tokens, keep the components.",
			// Dark by default: `Head.astro` seeds the theme before Starlight's own
			// script runs, so a first-time visitor lands in dark and the toggle
			// still wins from then on.
			components: {
				Head: "./src/components/head.astro",
				// The wordmark is HTML text, not an <img>, so it can use the
				// webfont and follow the theme. See the component for why.
				SiteTitle: "./src/components/site-title.astro",
			},
			customCss: [
				"@voila.dev/ui-tokens/design-tokens.css",
				"./src/styles/docs.css",
			],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/voila-voila-dev/ui",
				},
			],
			editLink: {
				baseUrl:
					"https://github.com/voila-voila-dev/ui/edit/main/apps/ui.voila.dev/",
			},
			sidebar: [
				{
					label: "Start",
					items: [
						{ label: "Introduction", slug: "start/introduction" },
						{ label: "Installation", slug: "start/installation" },
						{ label: "Theming and tokens", slug: "start/theming" },
						{ label: "Project setup", slug: "start/project-setup" },
						{ label: "Your branding package", slug: "start/branding" },
					],
				},
				{
					label: "@voila.dev/ui",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui" } }],
				},
				{
					label: "@voila.dev/ui-icon",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-icon" } }],
				},
				{
					label: "@voila.dev/ui-tokens",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-tokens" } }],
				},
				{
					label: "@voila.dev/ui-chart",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-chart" } }],
				},
				{
					label: "@voila.dev/ui-datatable",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-datatable" } }],
				},
				{
					label: "@voila.dev/ui-spreadsheet",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-spreadsheet" } }],
				},
				{
					label: "@voila.dev/ui-map",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-map" } }],
				},
				{
					label: "@voila.dev/ui-filter",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-filter" } }],
				},
				{
					label: "@voila.dev/ui-landing",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-landing" } }],
				},
				{
					label: "@voila.dev/ui-email-block-editor",
					collapsed: true,
					items: [{ autogenerate: { directory: "ui-email-block-editor" } }],
				},
			],
		}),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
