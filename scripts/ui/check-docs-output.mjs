/*
 * Asserts on the *output* of a docs build, because the ways these docs break are
 * all silent. A page whose example import resolves to nothing still builds: the
 * preview renders an empty stage and the response is 200. A `<PropTable of="…" />`
 * naming nothing is removed by the remark transform, so an `## API` heading ships
 * with no table under it and the build stays green. `scripts/check-docs.mjs`
 * catches those at author time from the source; this catches them from the HTML
 * that actually shipped, which is the only artefact that cannot lie.
 *
 * Run after `bun run docs:build --force` — never against a `FULL TURBO` replay,
 * which reprints a previous pass's log without producing anything.
 *
 *   bun scripts/check-docs-output.mjs
 */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = path.join(import.meta.dirname, "..");
const clientDir = path.join(repoRoot, "apps/ui.voila.dev/dist/client");
const contentDir = path.join(repoRoot, "apps/ui.voila.dev/src/content/docs");

function listPages() {
	return readdirSync(clientDir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name === "index.html")
		.map((entry) => {
			const file = path.join(entry.parentPath, entry.name);
			return {
				route: `/${path.relative(clientDir, path.dirname(file)).split(path.sep).join("/")}`,
				html: readFileSync(file, "utf8"),
			};
		});
}

/**
 * The stage is the element the example renders into. Empty means the example
 * exported nothing renderable — the exact regression the split into one file per
 * page could have introduced 180 times over.
 */
const STAGE =
	/<div class="preview__stage[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;

const pages = listPages();
if (pages.length < 190) {
	console.error(
		`only ${pages.length} pages in dist/client — build first, with --force`,
	);
	process.exit(1);
}

/**
 * Routes whose `## API` is deliberately hand-written, declared in the page as
 * `{/* no-prop-table: why *␀/}`. Only one page qualifies today —
 * `ui/direction`, a bare re-export of Base UI's provider, so there is no source
 * under `packages/ui` for the extractor to read. The marker lives in the MDX
 * rather than in a list here so the exemption is visible to whoever is reading
 * the page, and it is stripped at compile time, which is why this reads the
 * source instead of looking for it in the HTML.
 */
const exempt = new Set(
	readdirSync(contentDir, { recursive: true, withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"))
		.filter((entry) =>
			readFileSync(path.join(entry.parentPath, entry.name), "utf8").includes(
				"no-prop-table:",
			),
		)
		.map(
			(entry) =>
				`/${path
					.relative(contentDir, path.join(entry.parentPath, entry.name))
					.replace(/\.mdx$/, "")
					.split(path.sep)
					.join("/")}`,
		),
);

const problems = [];
let stages = 0;
let tables = 0;
let apiHeadings = 0;

for (const page of pages) {
	for (const match of page.html.matchAll(STAGE)) {
		stages += 1;
		if (!match[1].trim())
			problems.push(`${page.route} — a preview stage rendered empty.`);
	}
	// An `## API` heading with no generated table under it is a page whose
	// `of=` named nothing, or one that promises an API it never printed.
	const api = page.html.match(/id="api"/g)?.length ?? 0;
	const table = page.html.match(/class="prop-table"/g)?.length ?? 0;
	apiHeadings += api;
	tables += table;
	if (
		api &&
		!table &&
		!page.html.includes("Plus every") &&
		!exempt.has(page.route)
	) {
		problems.push(
			`${page.route} — has an "API" heading but no generated table.`,
		);
	}
}

console.log(
	`${stages} preview stage(s) across ${pages.length} built pages; ${tables} generated table(s) under ${apiHeadings} API heading(s)`,
);

if (problems.length) {
	console.error(`\n${problems.length} problem(s):`);
	for (const problem of problems) console.error(`  ${problem}`);
	process.exit(1);
}
console.log("docs output check passed");
