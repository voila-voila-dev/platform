/**
 * The sidebar's section order, ported from the old Starlight `sidebar` config.
 * Pages inside a section are ordered by their `sidebar.order` frontmatter, then
 * alphabetically.
 *
 * This used to also carry an `order` array pinning an explicit page sequence
 * per section, which meant page order lived in two places. The `start` pages
 * were ordered by the pin and carried no `sidebar` block at all — the only six
 * pages of 194 like that, and the reason nothing noticed they were missing one.
 * The pin is gone; the frontmatter is the single source.
 */
export interface DocsSectionConfig {
	/** Human label shown as the group heading. */
	label: string;
	/** Directory under `src/content/docs` that feeds the section. */
	dir: string;
	/** Whether the group starts collapsed when it has no active page. */
	collapsed: boolean;
	/**
	 * Sub-groups, in the order they should render. A section that declares
	 * these is ordered by `category` frontmatter instead of `sidebar.order`, and
	 * every one of its pages must name a category here — except a single intro
	 * page with no `category` at all, which pins to the top.
	 */
	categories?: DocsCategoryConfig[];
	/**
	 * Entry in the landing page's package grid. The grid used to hardcode its
	 * own copy of all ten sections, in a different order and under different
	 * labels, so a new section appeared in the sidebar and nowhere else. It
	 * reads the manifest now, and this is where its ordering and copy live.
	 */
	showcase?: DocsShowcaseConfig;
}

export interface DocsShowcaseConfig {
	/**
	 * Position in the grid. Deliberately not the sidebar order: the sidebar is
	 * foundational-first, the landing page leads with what is hardest to build
	 * yourself.
	 */
	order: number;
	/** One line. Also the package's npm description — keep the two in step. */
	blurb: string;
}

export interface DocsCategoryConfig {
	/** The value pages carry in their `category` frontmatter. */
	id: string;
	/** Heading shown above the group in the sidebar. */
	label: string;
}

/**
 * The `ui` taxonomy. Not invented here: `ui/quick-start.mdx` already narrated
 * it as a prose "Page map" precisely because the sidebar could not show it.
 *
 * It replaces `sidebar.order` for this section. 86 pages sharing one numeric
 * scale had twelve colliding pairs that fell through to alphabetical, so the
 * intended grouping was already lost — and a new component meant renumbering
 * its neighbours or picking a collision.
 */
const uiCategories: DocsCategoryConfig[] = [
	{ id: "actions", label: "Actions" },
	{ id: "forms", label: "Forms" },
	{ id: "dates-and-time", label: "Dates & time" },
	{ id: "overlays", label: "Overlays" },
	{ id: "navigation", label: "Navigation" },
	{ id: "data-display", label: "Data display" },
	{ id: "feedback", label: "Feedback" },
	{ id: "layout", label: "Layout" },
];

export const docsSections: DocsSectionConfig[] = [
	{ label: "Start", dir: "start", collapsed: false },
	{
		label: "@voila.dev/ui",
		dir: "ui",
		collapsed: true,
		categories: uiCategories,
		showcase: {
			order: 10,
			blurb:
				"…and the 85 components underneath it all. One convention, the floor everything else stands on.",
		},
	},
	{
		label: "ui/icon",
		dir: "ui-icon",
		collapsed: true,
		showcase: {
			order: 8,
			blurb: "Icons by name, safe by default — store a string, render an icon.",
		},
	},
	{
		label: "ui/design-tokens",
		dir: "ui-tokens",
		collapsed: true,
		showcase: {
			order: 9,
			blurb: "Your whole brand in one CSS file. Change it, everything follows.",
		},
	},
	{
		label: "ui/chart",
		dir: "ui-chart",
		collapsed: true,
		showcase: {
			order: 4,
			blurb:
				"Charts with zero charting library. SVG you can read, scales included.",
		},
	},
	{
		label: "ui/datatable",
		dir: "ui-datatable",
		collapsed: true,
		showcase: {
			order: 3,
			blurb:
				"Sorting, pinning, CSV export — the table you keep rebuilding, finished.",
		},
	},
	{
		label: "ui/spreadsheet",
		dir: "ui-spreadsheet",
		collapsed: true,
		showcase: {
			order: 2,
			blurb:
				"An editable, virtualized grid your users will mistake for a native app.",
		},
	},
	{
		label: "ui/map",
		dir: "ui-map",
		collapsed: true,
		showcase: {
			order: 5,
			blurb:
				"Maps and a globe on free vector tiles. No API key, no bundle tax.",
		},
	},
	{
		label: "ui/filter",
		dir: "ui-filter",
		collapsed: true,
		showcase: {
			order: 6,
			blurb:
				"Composable filters that survive real product requirements — including geo.",
		},
	},
	{
		label: "ui/landing",
		dir: "ui-landing",
		collapsed: true,
		showcase: {
			order: 7,
			blurb: "Your marketing site, from the same system as your product.",
		},
	},
	{
		label: "ui/email-block-editor",
		dir: "ui-email-block-editor",
		collapsed: true,
		showcase: {
			order: 1,
			blurb:
				"The email template editor that lives in your app, not someone else's SaaS.",
		},
	},
];
