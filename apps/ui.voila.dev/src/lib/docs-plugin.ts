/**
 * Build-time plumbing for the docs content. Node-only: imported from
 * `vite.config.ts`, never from client code. Three jobs:
 *
 * - `docsPages()` enumerates every content slug so the static prerender does
 *   not depend on link crawling to find all 180+ pages.
 * - `docsManifest()` serves `virtual:docs-manifest` — the sidebar tree and the
 *   flat prev/next order — from frontmatter alone, without compiling MDX.
 * - `docsSearchIndex()` serves `virtual:docs-search-index` — the raw documents
 *   the ⌘K palette feeds to MiniSearch. A lazy virtual module rather than a
 *   JSON asset, so it code-splits away and only loads when search opens.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Plugin } from "vite";
import type {
	DocsManifest,
	DocsManifestItem,
	DocsSearchDocument,
} from "./docs-manifest.types";
import { docsSections } from "./docs-nav.config";

const contentDir = path.join(import.meta.dirname, "../content/docs");

interface DocFile {
	/** Absolute path to the .mdx file. */
	file: string;
	/** Root-absolute route, e.g. `/ui/button`. */
	slug: string;
	/** Directory under content/docs, e.g. `ui`. */
	dir: string;
	/** File stem, e.g. `button`. */
	stem: string;
}

function listDocFiles(): DocFile[] {
	const out: DocFile[] = [];
	for (const entry of readdirSync(contentDir, {
		recursive: true,
		withFileTypes: true,
	})) {
		if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;
		const file = path.join(entry.parentPath, entry.name);
		const rel = path.relative(contentDir, file).replace(/\.mdx$/, "");
		const segments = rel.split(path.sep);
		out.push({
			file,
			slug: `/${segments.join("/")}`,
			dir: segments.slice(0, -1).join("/"),
			stem: segments[segments.length - 1] ?? "",
		});
	}
	return out;
}

interface DocFrontmatter {
	title?: string;
	description?: string;
	sidebar?: { order?: number; label?: string };
}

function readManifest(): DocsManifest {
	const byDir = new Map<string, (DocFile & { fm: DocFrontmatter })[]>();
	for (const doc of listDocFiles()) {
		const fm = matter(readFileSync(doc.file, "utf8")).data as DocFrontmatter;
		const list = byDir.get(doc.dir) ?? [];
		list.push({ ...doc, fm });
		byDir.set(doc.dir, list);
	}

	const manifest: DocsManifest = { sections: [], flat: [] };
	for (const section of docsSections) {
		const docs = byDir.get(section.dir) ?? [];
		docs.sort((a, b) => {
			const pin = (d: DocFile) => {
				const i = section.order?.indexOf(d.stem) ?? -1;
				return i === -1 ? Number.MAX_SAFE_INTEGER : i;
			};
			const order = (d: DocFile & { fm: DocFrontmatter }) =>
				d.fm.sidebar?.order ?? Number.MAX_SAFE_INTEGER;
			return (
				pin(a) - pin(b) || order(a) - order(b) || a.stem.localeCompare(b.stem)
			);
		});
		const items: DocsManifestItem[] = docs.map((d) => ({
			slug: d.slug,
			title: d.fm.sidebar?.label ?? d.fm.title ?? d.stem,
			description: d.fm.description ?? "",
		}));
		manifest.sections.push({
			label: section.label,
			dir: section.dir,
			collapsed: section.collapsed,
			items,
		});
		manifest.flat.push(
			...items.map((item) => ({ ...item, section: section.label })),
		);
	}
	return manifest;
}

function readSearchDocuments(): DocsSearchDocument[] {
	const sectionLabel = new Map(docsSections.map((s) => [s.dir, s.label]));
	const parser = unified().use(remarkParse);
	return listDocFiles().map((doc) => {
		const { data, content } = matter(readFileSync(doc.file, "utf8"));
		const fm = data as DocFrontmatter;
		// Strip ESM and JSX lines so remark-parse sees plain markdown; the odd
		// leftover angle bracket only adds noise words, which MiniSearch shrugs at.
		const markdown = content
			.split("\n")
			.filter((line) => !/^\s*(import |export |<\/?[A-Z])/.test(line))
			.join("\n");
		const tree = parser.parse(markdown);
		const headings: string[] = [];
		visit(tree, "heading", (node) => {
			headings.push(mdastToString(node));
		});
		let text = "";
		visit(tree, ["paragraph", "tableCell", "listItem"], (node) => {
			text += `${mdastToString(node)} `;
		});
		return {
			slug: doc.slug,
			section: sectionLabel.get(doc.dir.split("/")[0] ?? "") ?? doc.dir,
			title: fm.title ?? doc.stem,
			description: fm.description ?? "",
			headings,
			text: text.slice(0, 8000),
		};
	});
}

/** Prerender targets for the Start plugin: every content page. */
export function docsPages(): { path: string }[] {
	return listDocFiles().map((doc) => ({ path: doc.slug }));
}

function virtualJsonPlugin(
	name: string,
	moduleId: string,
	build: () => unknown,
): Plugin {
	const resolvedId = `\0${moduleId}`;
	return {
		name,
		resolveId(id) {
			return id === moduleId ? resolvedId : undefined;
		},
		load(id) {
			if (id !== resolvedId) return undefined;
			return `export default JSON.parse(${JSON.stringify(JSON.stringify(build()))});`;
		},
		configureServer(server) {
			// Any content edit may reorder the sidebar or change the index.
			server.watcher.add(contentDir);
			server.watcher.on("all", (_event, file) => {
				if (!file.startsWith(contentDir)) return;
				const mod = server.moduleGraph.getModuleById(resolvedId);
				if (mod) server.moduleGraph.invalidateModule(mod);
			});
		},
	};
}

export function docsManifest(): Plugin {
	return virtualJsonPlugin(
		"voila:docs-manifest",
		"virtual:docs-manifest",
		readManifest,
	);
}

export function docsSearchIndex(): Plugin {
	return virtualJsonPlugin(
		"voila:docs-search-index",
		"virtual:docs-search-index",
		readSearchDocuments,
	);
}
