/*
 * Fails the build on the three ways the docs go quietly wrong.
 *
 * `<PropTable of="X" />` renders nothing when `X` names no part, so a typo or a
 * renamed component leaves a page with an "## API" heading and no table under
 * it — visible to a reader, invisible to a build. An internal link to a page that
 * no longer exists 404s in production while every local preview looks fine. And
 * a JSX tag the page never imported throws only while that one page renders:
 * `start/installation.mdx` shipped `<Tabs.Root>` against a `Tabs` that has no
 * `.Root`, and the prerender logged it and carried on with `failOnError: true`
 * set, so the page went out broken.
 *
 * All three are the same failure mode the generated tables exist to end:
 * documentation drifting from the source without anything going red. Run from
 * the repo root: `bun scripts/check-docs.mjs` (bun, so the TypeScript extractor
 * imports directly).
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { readPropsManifest } from "../apps/ui.voila.dev/src/lib/props-extract.ts";

const repoRoot = path.join(import.meta.dirname, "..");
const contentDir = path.join(repoRoot, "apps/ui.voila.dev/src/content/docs");

function listPages() {
	return readdirSync(contentDir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
		.map((entry) => {
			const file = path.join(entry.parentPath, entry.name);
			const rel = path.relative(contentDir, file).replace(/\.mdx$/, "");
			return {
				file,
				rel,
				slug: `/${rel.split(path.sep).join("/")}`,
				text: readFileSync(file, "utf8"),
			};
		});
}

const pages = listPages();
const slugs = new Set(pages.map((page) => page.slug));
const problems = [];

const referenced = pages.flatMap((page) =>
	[...page.text.matchAll(/<PropTable\s+of="([^"]*)"/g)].map((match) => ({
		page,
		id: match[1],
		line: page.text.slice(0, match.index).split("\n").length,
	})),
);

if (referenced.length) {
	const manifest = await readPropsManifest();
	for (const use of referenced) {
		if (manifest[use.id]) continue;
		const near = Object.keys(manifest)
			.filter((id) => id.split(".")[0] === use.id.split(".")[0])
			.slice(0, 6);
		problems.push(
			`${path.relative(repoRoot, use.page.file)}:${use.line} — <PropTable of="${use.id}" /> names no component.${
				near.length ? ` Did you mean: ${near.join(", ")}?` : ""
			}`,
		);
	}
	console.log(
		`checked ${referenced.length} <PropTable> reference(s) against ${Object.keys(manifest).length} components`,
	);
}

for (const page of pages) {
	for (const match of page.text.matchAll(/\]\((\/[\w/-]+)\/?(#[\w-]+)?\)/g)) {
		const target = match[1].replace(/\/$/, "");
		// Section-relative depth only: `/ui/button`, not `/` or `/llms.txt`.
		if (target.split("/").length < 3) continue;
		if (slugs.has(target)) continue;
		problems.push(
			`${path.relative(repoRoot, page.file)}:${page.text.slice(0, match.index).split("\n").length} — link to ${target} matches no page.`,
		);
	}
}
console.log(`checked internal links across ${pages.length} pages`);

const srcDir = path.join(repoRoot, "apps/ui.voila.dev/src");
let memberChecks = 0;

/** Resolves an `@/…` specifier to the file it names, or undefined for a package. */
function resolveLocalModule(specifier) {
	if (!specifier.startsWith("@/")) return undefined;
	const base = path.join(srcDir, specifier.slice(2));
	for (const candidate of [
		`${base}.tsx`,
		`${base}.ts`,
		path.join(base, "index.tsx"),
		path.join(base, "index.ts"),
	]) {
		if (existsSync(candidate)) return candidate;
	}
	return undefined;
}

const exportCache = new Map();

/**
 * The names a module exports. Read with regexes rather than the type checker:
 * these are the docs app's own example files, which are plain `export function`
 * declarations by convention, and the sync TypeScript API is unavailable under
 * Bun anyway (see `props-extract.ts`). `export * from` is followed one level so
 * a barrel still resolves.
 */
function moduleExports(file, seen = new Set()) {
	const cached = exportCache.get(file);
	if (cached) return cached;
	if (seen.has(file)) return new Set();
	seen.add(file);
	const text = readFileSync(file, "utf8");
	const names = new Set();
	for (const match of text.matchAll(
		/^export\s+(?:async\s+)?(?:function|const|let|class|type|interface)\s+([A-Za-z_$][\w$]*)/gm,
	)) {
		names.add(match[1]);
	}
	for (const match of text.matchAll(/^export\s*\{([^}]*)\}/gm)) {
		for (const part of match[1].split(",")) {
			const name = part
				.replace(/^\s*type\s+/, "")
				.split(/\s+as\s+/)
				.pop()
				.trim();
			if (name) names.add(name);
		}
	}
	for (const match of text.matchAll(
		/^export\s+\*\s+from\s+["'](\.[^"']+)["']/gm,
	)) {
		const base = path.join(path.dirname(file), match[1]);
		for (const candidate of [
			`${base}.tsx`,
			`${base}.ts`,
			path.join(base, "index.ts"),
		]) {
			if (!existsSync(candidate)) continue;
			for (const name of moduleExports(candidate, seen)) names.add(name);
			break;
		}
	}
	exportCache.set(file, names);
	return names;
}

/**
 * Names the MDX provider supplies to every page, so using them needs no import.
 * `PropTable` is expanded by the remark transform before React ever sees it;
 * `Preview` comes from `mdxComponents`.
 */
const PROVIDED = new Set(["PropTable", "Preview"]);

for (const page of pages) {
	// Fenced blocks and inline code show tags as examples, not as JSX.
	const prose = page.text
		.replace(/```[\s\S]*?```/g, "")
		.replace(/`[^`\n]*`/g, "");
	const imported = new Set(
		[...prose.matchAll(/^import\s+([\s\S]*?)\s+from\s+["'][^"']+["']/gm)]
			.flatMap((match) => match[1].split(/[{},]/))
			.map((name) => name.replace(/^\s*(\*\s+as|type)\s+/, "").trim())
			.filter(Boolean)
			.map((name) =>
				name
					.split(/\s+as\s+/)
					.pop()
					.trim(),
			),
	);
	for (const match of prose.matchAll(/<([A-Z][\w]*)(\.[\w.]+)?[\s/>]/g)) {
		const base = match[1];
		if (imported.has(base) || PROVIDED.has(base)) continue;
		problems.push(
			`${path.relative(repoRoot, page.file)}:${prose.slice(0, match.index).split("\n").length} — <${base}${match[2] ?? ""}> is used but never imported.`,
		);
	}

	// Knowing the import resolves is not enough: `<Example.Default />` where the
	// module exports no `Default` renders nothing, and the page still builds — it
	// just ships with an empty preview frame. Every namespace import in these
	// pages is a local `@/…` module, so its exports can be read off the file
	// instead of resolved through the type checker.
	const namespaces = new Map();
	for (const match of prose.matchAll(
		/^import\s+\*\s+as\s+([\w$]+)\s+from\s+["']([^"']+)["']/gm,
	)) {
		const file = resolveLocalModule(match[2]);
		if (file) namespaces.set(match[1], file);
	}
	for (const match of prose.matchAll(/<([A-Z][\w]*)\.([\w]+)[\s/>]/g)) {
		const file = namespaces.get(match[1]);
		if (!file) continue;
		memberChecks += 1;
		if (moduleExports(file).has(match[2])) continue;
		problems.push(
			`${path.relative(repoRoot, page.file)}:${prose.slice(0, match.index).split("\n").length} — <${match[1]}.${match[2]}> is not exported by ${path.relative(repoRoot, file)}.`,
		);
	}
}
console.log(
	`checked JSX references across ${pages.length} pages, including ${memberChecks} namespace member(s)`,
);

if (problems.length) {
	console.error(`\n${problems.length} problem(s):`);
	for (const problem of problems) console.error(`  ${problem}`);
	process.exit(1);
}
console.log("docs check passed");
