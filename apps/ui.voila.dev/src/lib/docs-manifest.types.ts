/** Shapes served by the `virtual:docs-manifest` module. */

export interface DocsManifestItem {
	/** Root-absolute route, e.g. `/ui/button`. */
	slug: string;
	title: string;
	description: string;
}

export interface DocsManifestGroup {
	/** The `category` value these pages carry. */
	id: string;
	/** Heading shown above the group in the sidebar. */
	label: string;
	items: DocsManifestItem[];
}

export interface DocsManifestSection {
	label: string;
	dir: string;
	collapsed: boolean;
	/**
	 * Every page in the section, in sidebar order — including the ones inside
	 * `groups`. Consumers that do not care about sub-grouping read this.
	 */
	items: DocsManifestItem[];
	/**
	 * Pages that sit above the groups: a section intro with no `category`.
	 * Empty for sections that are not grouped.
	 */
	intro: DocsManifestItem[];
	/** Sub-groups, in config order. Empty for sections ordered by number. */
	groups: DocsManifestGroup[];
}

export interface DocsShowcaseEntry {
	/** Package name without the scope, e.g. `ui-chart`. */
	name: string;
	/** Where the card links: the section's first page. */
	slug: string;
	blurb: string;
}

export interface DocsManifest {
	sections: DocsManifestSection[];
	/**
	 * The landing page's package grid, in its own order. Derived from the same
	 * section config as the sidebar, so a new section cannot appear in one and
	 * not the other.
	 */
	showcase: DocsShowcaseEntry[];
	/** Every page in sidebar order, for prev/next navigation. */
	flat: (DocsManifestItem & { section: string })[];
}

export interface DocsSearchDocument {
	slug: string;
	section: string;
	title: string;
	description: string;
	headings: string[];
	text: string;
}
