/*
 * Builds one @voila.dev/* package into dist/, mirroring src/ file by file.
 * Run from the package directory: `bun ../../scripts/build-package.mjs`.
 *
 * No bundling — the exports globs ("./components/*" → dist/components/ui/*.js)
 * and consumer tree-shaking depend on the one-module-per-file layout. JS comes
 * from esbuild (ESM, automatic JSX, sourcemaps back to ../src), declarations
 * from tsc via tsconfig.build.json. Internal imports keep their `#/...`
 * specifiers; only the .ts/.tsx extensions become .js so the manifest's
 * `imports` field can point at dist/ in the published package.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

const pkgDir = process.cwd();
const srcDir = path.join(pkgDir, "src");
const distDir = path.join(pkgDir, "dist");

const isExcluded = (file) => /\.(test|stories)\.[^/]+$|\.d\.ts$/.test(file);

const walk = (dir) =>
	fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) return walk(full);
		return [full];
	});

const files = walk(srcDir).filter((f) => !isExcluded(f));
const tsFiles = files.filter((f) => /\.tsx?$/.test(f));
const assetFiles = files.filter((f) => /\.css$/.test(f));

fs.rmSync(distDir, { recursive: true, force: true });

// 1. JS: one output module per source module.
await build({
	entryPoints: tsFiles,
	outdir: distDir,
	outbase: srcDir,
	bundle: false,
	format: "esm",
	jsx: "automatic",
	target: "es2022",
	sourcemap: "linked",
});

// 2. Declarations (+ declarationMap pointing back into ../src).
execFileSync("bun", ["x", "tsc", "-p", "tsconfig.build.json"], {
	cwd: pkgDir,
	stdio: "inherit",
});

// 3. esbuild (bundle: false) and tsc both leave import specifiers untouched,
// so emitted files still say `#/lib/utils.ts`. Node reserves `#` for the
// manifest's `imports` field but rejects `#/...` specifiers outright
// (ERR_INVALID_MODULE_SPECIFIER), so dist gets plain relative paths instead —
// the one form every consumer resolves without ceremony.
const specifier = /((?:from\s*|import\s*\(?\s*)")((?:#|\.)[^"]*)\.tsx?(")/g;
for (const file of walk(distDir)) {
	if (!/\.(js|d\.ts)$/.test(file)) continue;
	const fileDir = path.dirname(file);
	const source = fs.readFileSync(file, "utf8");
	const rewritten = source.replace(specifier, (_, head, spec, tail) => {
		if (spec.startsWith("#/")) {
			const target = path.join(distDir, spec.slice(2));
			const relative = path.relative(fileDir, target).replaceAll("\\", "/");
			spec = relative.startsWith(".") ? relative : `./${relative}`;
		}
		return `${head}${spec}.js${tail}`;
	});
	if (rewritten !== source) fs.writeFileSync(file, rewritten);
}

// 4. CSS travels as-is; @source and @import are relative, so the mirrored
// layout keeps them valid (dist/styles.css scans dist/).
for (const file of assetFiles) {
	const dest = path.join(distDir, path.relative(srcDir, file));
	fs.mkdirSync(path.dirname(dest), { recursive: true });
	fs.copyFileSync(file, dest);
}

console.log(
	`built ${tsFiles.length} modules, ${assetFiles.length} assets → dist/`,
);
