/*
 * The bundle gate. Builds each entry in bundle-entries/ the way an app would
 * (minified, React external), then fails when an entry grows past its gzip
 * budget or retains a module it must not: the core and the React layer stay
 * free of d3, which only the heavy layouts' own subpaths may pull in.
 *
 * Run from packages/chart: `bun run check-bundle`.
 */
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

/** Gzip bytes. Raise one only with the reason in the commit message. */
const BUDGETS = {
	line: 20_200,
	cartesian: 23_100,
	canvas: 21_700,
	polar: 22_200,
	stats: 24_800,
	contour: 25_900,
	voronoi: 29_900,
	hierarchy: 22_100,
	sankey: 21_400,
	force: 24_300,
	geo: 33_400,
	brush: 21_200,
};

const FORBIDDEN = [/node_modules\/d3-/];
/** The subpaths whose whole point is a d3 layout. Every other entry stays d3-free. */
const D3_ENTRIES = new Set([
	"contour",
	"voronoi",
	"hierarchy",
	"sankey",
	"force",
	"geo",
]);

const entriesDir = path.join(import.meta.dirname, "bundle-entries");
let failed = false;

for (const file of fs.readdirSync(entriesDir)) {
	const name = path.basename(file, path.extname(file));
	const result = await build({
		entryPoints: [path.join(entriesDir, file)],
		bundle: true,
		minify: true,
		format: "esm",
		write: false,
		metafile: true,
		jsx: "automatic",
		external: ["react", "react-dom", "react/jsx-runtime"],
		logLevel: "silent",
	});
	const gzip = gzipSync(result.outputFiles[0].contents).length;
	const budget = BUDGETS[name];
	const retained = D3_ENTRIES.has(name)
		? []
		: Object.keys(result.metafile.inputs).filter((input) =>
				FORBIDDEN.some((pattern) => pattern.test(input)),
			);
	const over = budget !== undefined && gzip > budget;
	console.log(
		`${name.padEnd(10)} ${String(gzip).padStart(6)} B gzip${budget ? ` / ${budget}` : ""}${over ? "  OVER BUDGET" : ""}`,
	);
	for (const input of retained) {
		console.log(`  forbidden input: ${input}`);
	}
	if (over || retained.length > 0) {
		failed = true;
	}
}

if (failed) {
	process.exit(1);
}
