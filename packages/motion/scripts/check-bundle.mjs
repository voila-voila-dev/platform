/*
 * The bundle gate. Builds each entry in bundle-entries/ the way an app would
 * (minified, React external), then fails when an entry grows past its gzip
 * budget or when an entry outside the React layer retains React.
 *
 * Run from packages/motion: `bun run check-bundle`.
 */
import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { build } from "esbuild";

/** Gzip bytes. Raise one only with the reason in the commit message. */
const BUDGETS = {
	dom: 5_000,
	animate: 12_100,
	values: 12_100,
	sequence: 12_200,
	view: 13_600,
	react: 14_000,
};

const REACT = ["react", "react-dom", "react/jsx-runtime"];

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
		external: REACT,
		logLevel: "silent",
	});
	const gzip = gzipSync(result.outputFiles[0].contents).length;
	const budget = BUDGETS[name];
	const importsReact =
		name !== "react" &&
		Object.values(result.metafile.outputs).some((output) =>
			output.imports.some((entry) => REACT.includes(entry.path)),
		);
	const over = budget !== undefined && gzip > budget;
	console.log(
		`${name.padEnd(10)} ${String(gzip).padStart(6)} B gzip${budget ? ` / ${budget}` : ""}${over ? "  OVER BUDGET" : ""}${importsReact ? "  IMPORTS REACT" : ""}`,
	);
	if (over || importsReact) {
		failed = true;
	}
}

if (failed) {
	process.exit(1);
}
