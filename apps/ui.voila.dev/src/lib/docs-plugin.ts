/**
 * Build-time plumbing for the docs content. Node-only: imported from
 * `vite.config.ts`, never from client code. Four jobs:
 *
 * - `docsPages()` enumerates every content slug so the static prerender does
 *   not depend on link crawling to find all 180+ pages.
 * - `docsManifest()` serves `virtual:docs-manifest` — the sidebar tree and the
 *   flat prev/next order — from frontmatter alone, without compiling MDX.
 * - `docsSearchIndex()` serves `virtual:docs-search-index` — the raw documents
 *   the ⌘K palette feeds to MiniSearch. A lazy virtual module rather than a
 *   JSON asset, so it code-splits away and only loads when search opens.
 * - `docsPropsWatch()` makes the dev server watch `packages/ui`, which the
 *   generated props tables are built from but nothing here imports.
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { toString as mdastToString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { Plugin } from "vite";
import { type DocFrontmatter, parseFrontmatter } from "./docs-frontmatter";
import type {
	DocsManifest,
	DocsManifestGroup,
	DocsManifestItem,
	DocsSearchDocument,
	DocsShowcaseEntry,
} from "./docs-manifest.types";
import { type DocsSectionConfig, docsSections } from "./docs-nav.config";
import { invalidatePropsManifest } from "./remark-prop-table";

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

function readManifest(): DocsManifest {
	const byDir = new Map<string, (DocFile & { fm: DocFrontmatter })[]>();
	for (const doc of listDocFiles()) {
		const fm = parseFrontmatter(
			path.relative(contentDir, doc.file),
			matter(readFileSync(doc.file, "utf8")).data,
		);
		const list = byDir.get(doc.dir) ?? [];
		list.push({ ...doc, fm });
		byDir.set(doc.dir, list);
	}

	// A directory of pages that no section claims renders nowhere: not in the
	// sidebar, not in prev/next, not in the breadcrumbs. Adding a section should
	// be a build error, not a page nobody can reach.
	const claimed = new Set(docsSections.map((section) => section.dir));
	const orphans = [...byDir.keys()].filter((dir) => !claimed.has(dir)).sort();
	if (orphans.length) {
		throw new Error(
			`content/docs has ${orphans.length} director(ies) with no entry in docsSections: ${orphans.join(", ")}. ` +
				"Add them to docs-nav.config.ts or their pages will not appear in the sidebar, prev/next or breadcrumbs.",
		);
	}

	const manifest: DocsManifest = { sections: [], flat: [], showcase: [] };
	const showcase: { order: number; entry: DocsShowcaseEntry }[] = [];
	for (const section of docsSections) {
		const docs = byDir.get(section.dir) ?? [];
		const { intro, groups, items } = section.categories
			? groupByCategory(section, docs)
			: orderByNumber(section, docs);
		manifest.sections.push({
			label: section.label,
			dir: section.dir,
			collapsed: section.collapsed,
			items,
			intro,
			groups,
		});
		manifest.flat.push(
			...items.map((item) => ({ ...item, section: section.label })),
		);

		if (section.showcase) {
			const landing = items[0];
			if (!landing) {
				throw new Error(
					`${section.dir} is in the landing page showcase but has no pages to link to.`,
				);
			}
			showcase.push({
				order: section.showcase.order,
				entry: {
					name: section.dir,
					slug: landing.slug,
					blurb: section.showcase.blurb,
				},
			});
		}
	}
	manifest.showcase = showcase
		.sort((a, b) => a.order - b.order)
		.map(({ entry }) => entry);
	return manifest;
}

type SectionDoc = DocFile & { fm: DocFrontmatter };

function toItem(doc: SectionDoc): DocsManifestItem {
	return {
		slug: doc.slug,
		title: doc.fm.title,
		description: doc.fm.description,
	};
}

interface OrderedSection {
	intro: DocsManifestItem[];
	groups: DocsManifestGroup[];
	items: DocsManifestItem[];
}

/** Sections without a taxonomy: `sidebar.order`, then alphabetical on ties. */
function orderByNumber(
	section: DocsSectionConfig,
	docs: SectionDoc[],
): OrderedSection {
	for (const doc of docs) {
		if (doc.fm.sidebar) continue;
		throw new Error(
			`${section.dir}/${doc.stem}.mdx — the "${section.label}" section is ordered by number, so the page needs a sidebar.order.`,
		);
	}
	const sorted = [...docs].sort(
		(a, b) =>
			(a.fm.sidebar?.order ?? 0) - (b.fm.sidebar?.order ?? 0) ||
			a.stem.localeCompare(b.stem),
	);
	return { intro: [], groups: [], items: sorted.map(toItem) };
}

/**
 * Sections with a taxonomy: grouped by `category` in the config's order, and
 * alphabetical by title inside each group, so adding a component never means
 * renumbering its neighbours.
 *
 * A page with no `category` is the section intro and pins above the groups.
 * More than one is a mistake — two unlabelled pages at the top of a sidebar is
 * not a shape anyone chose.
 */
function groupByCategory(
	section: DocsSectionConfig,
	docs: SectionDoc[],
): OrderedSection {
	const known = new Map(
		(section.categories ?? []).map((category) => [category.id, category]),
	);
	const intro: SectionDoc[] = [];
	const byCategory = new Map<string, SectionDoc[]>();

	for (const doc of docs) {
		const category = doc.fm.category;
		if (!category) {
			intro.push(doc);
			continue;
		}
		if (!known.has(category)) {
			throw new Error(
				`${section.dir}/${doc.stem}.mdx — category "${category}" is not one of the "${section.label}" categories: ${[...known.keys()].join(", ")}.`,
			);
		}
		const list = byCategory.get(category) ?? [];
		list.push(doc);
		byCategory.set(category, list);
	}

	if (intro.length > 1) {
		throw new Error(
			`${section.dir} has ${intro.length} pages with no category (${intro.map((d) => d.stem).join(", ")}). Only the section intro may omit it.`,
		);
	}

	const groups: DocsManifestGroup[] = [];
	for (const category of section.categories ?? []) {
		const list = byCategory.get(category.id);
		if (!list?.length) {
			throw new Error(
				`${section.dir} declares the "${category.id}" category but no page uses it. Remove it from docs-nav.config.ts or give a page that category.`,
			);
		}
		groups.push({
			id: category.id,
			label: category.label,
			items: list
				.sort((a, b) => a.fm.title.localeCompare(b.fm.title))
				.map(toItem),
		});
	}

	const introItems = intro.map(toItem);
	return {
		intro: introItems,
		groups,
		items: [...introItems, ...groups.flatMap((group) => group.items)],
	};
}

function readSearchDocuments(): DocsSearchDocument[] {
	const sectionLabel = new Map(docsSections.map((s) => [s.dir, s.label]));
	const parser = unified().use(remarkParse);
	return listDocFiles().map((doc) => {
		const { data, content } = matter(readFileSync(doc.file, "utf8"));
		const fm = parseFrontmatter(path.relative(contentDir, doc.file), data);
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
			title: fm.title,
			description: fm.description,
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

/**
 * Dev only: a props table is generated from `packages/ui`, which Vite has no
 * reason to watch — nothing in the docs imports the source. Without this, a prop
 * added to a component keeps showing the old table until the server restarts.
 */
export function docsPropsWatch(): Plugin {
	const packageSrc = path.join(
		import.meta.dirname,
		"../../../../packages/ui/src",
	);
	return {
		name: "voila:docs-props-watch",
		configureServer(server) {
			server.watcher.add(packageSrc);
			server.watcher.on("all", (_event, file) => {
				if (!file.startsWith(packageSrc)) return;
				invalidatePropsManifest();
				// The tables are baked into the compiled MDX, so every page that
				// carries one has to be recompiled.
				for (const mod of server.moduleGraph.idToModuleMap.values()) {
					if (mod.id?.endsWith(".mdx"))
						server.moduleGraph.invalidateModule(mod);
				}
				server.ws.send({ type: "full-reload" });
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
