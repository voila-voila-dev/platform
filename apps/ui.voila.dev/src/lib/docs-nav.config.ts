/**
 * The sidebar's section order, ported from the old Starlight `sidebar` config.
 * Pages inside a section are ordered by their `sidebar.order` frontmatter,
 * then alphabetically — except where `order` pins an explicit sequence.
 */
export interface DocsSectionConfig {
	/** Human label shown as the group heading. */
	label: string;
	/** Directory under `src/content/docs` that feeds the section. */
	dir: string;
	/** Whether the group starts collapsed when it has no active page. */
	collapsed: boolean;
	/** Explicit page order (file stems); anything unlisted sorts after. */
	order?: string[];
}

export const docsSections: DocsSectionConfig[] = [
	{
		label: "Start",
		dir: "start",
		collapsed: false,
		order: [
			"introduction",
			"installation",
			"working-with-ai",
			"theming",
			"project-setup",
			"branding",
		],
	},
	{ label: "@voila.dev/ui", dir: "ui", collapsed: true },
	{ label: "@voila.dev/ui-icon", dir: "ui-icon", collapsed: true },
	{ label: "@voila.dev/ui-tokens", dir: "ui-tokens", collapsed: true },
	{ label: "@voila.dev/ui-chart", dir: "ui-chart", collapsed: true },
	{ label: "@voila.dev/ui-datatable", dir: "ui-datatable", collapsed: true },
	{
		label: "@voila.dev/ui-spreadsheet",
		dir: "ui-spreadsheet",
		collapsed: true,
	},
	{ label: "@voila.dev/ui-map", dir: "ui-map", collapsed: true },
	{ label: "@voila.dev/ui-filter", dir: "ui-filter", collapsed: true },
	{ label: "@voila.dev/ui-landing", dir: "ui-landing", collapsed: true },
	{
		label: "@voila.dev/ui-email-block-editor",
		dir: "ui-email-block-editor",
		collapsed: true,
	},
];
