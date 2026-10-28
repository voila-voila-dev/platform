declare module "*.mdx" {
	import type { MDXComponents } from "mdx/types";
	import type { ComponentType } from "react";
	import type { TocEntry } from "@/lib/remark-toc-export";

	export const frontmatter: {
		title: string;
		description: string;
		sidebar?: { order?: number; label?: string };
	};
	export const toc: TocEntry[];
	const MDXContent: ComponentType<{ components?: MDXComponents }>;
	export default MDXContent;
}

declare module "virtual:docs-manifest" {
	import type { DocsManifest } from "@/lib/docs-manifest.types";

	const manifest: DocsManifest;
	export default manifest;
}

declare module "virtual:docs-search-index" {
	import type { DocsSearchDocument } from "@/lib/docs-manifest.types";

	const documents: DocsSearchDocument[];
	export default documents;
}
