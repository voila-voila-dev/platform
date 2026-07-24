/** Shapes served by the `virtual:docs-manifest` module. */

export interface DocsManifestItem {
	/** Root-absolute route, e.g. `/ui/button`. */
	slug: string;
	title: string;
	description: string;
}

export interface DocsManifestSection {
	label: string;
	dir: string;
	collapsed: boolean;
	items: DocsManifestItem[];
}

export interface DocsManifest {
	sections: DocsManifestSection[];
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
