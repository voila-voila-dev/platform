import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { Glob } from "bun";

// The layout the rules read:
//   src/index.ts, src/core/**   the core, exported as `@voila.dev/platform`
//   src/<brick>/**              a brick, exported as `@voila.dev/platform/<brick>`
//   …/drizzle/**, …/server/**   server only: never reaches a browser bundle

export interface SourceFile {
	readonly path: string;
	readonly imports: ReadonlyArray<string>;
}

export type BrickDependency = readonly [from: string, to: string];

const SERVER_FOLDERS = new Set(["drizzle", "server"]);
const SERVER_PACKAGES = [/^drizzle-orm(\/|$)/, /^node:/, /^bun(:|$)/];

export function listSourceFiles(sourceRoot: string): ReadonlyArray<SourceFile> {
	const transpiler = new Bun.Transpiler({ loader: "ts" });
	return Array.from(new Glob("**/*.ts").scanSync({ cwd: sourceRoot }))
		.filter((path) => !isTestFile(path))
		.sort()
		.map((path) => ({
			path,
			imports: transpiler
				.scanImports(readFileSync(join(sourceRoot, path), "utf8"))
				.map((entry) => entry.path),
		}));
}

/** The brick a file belongs to, or `undefined` for the core. Paths are relative to `src/`. */
export function brickOf(path: string): string | undefined {
	const [first, ...rest] = path.split("/");
	if (rest.length === 0 || first === "core") return undefined;
	return first;
}

export function isServerOnly(path: string): boolean {
	return path.split("/").some((segment) => SERVER_FOLDERS.has(segment));
}

/** Where a relative import lands, relative to `src/`; `undefined` for a package import. */
export function resolveImport(
	from: string,
	specifier: string,
): string | undefined {
	if (!specifier.startsWith(".")) return undefined;
	return relative("/src", resolve("/src", dirname(from), specifier));
}

/** The core imports no brick, and a brick imports another only when the dependency is written down. */
export function undeclaredBrickImports(
	files: ReadonlyArray<SourceFile>,
	allowed: ReadonlyArray<BrickDependency>,
): ReadonlyArray<string> {
	const declared = new Set(allowed.map(([from, to]) => `${from} → ${to}`));
	return files.flatMap((file) =>
		file.imports.flatMap((specifier) => {
			const target = resolveImport(file.path, specifier);
			if (target === undefined) return [];
			const to = brickOf(target);
			if (to === undefined) return [];
			const from = brickOf(file.path);
			if (from === to) return [];
			if (from !== undefined && declared.has(`${from} → ${to}`)) return [];
			return [`${file.path} imports ${specifier} (${from ?? "core"} → ${to})`];
		}),
	);
}

/** A file outside `drizzle/` and `server/` may end up in a browser bundle, so it imports nothing server only. */
export function serverImportsInBrowserCode(
	files: ReadonlyArray<SourceFile>,
): ReadonlyArray<string> {
	return files
		.filter((file) => !isServerOnly(file.path))
		.flatMap((file) =>
			file.imports
				.filter((specifier) => {
					const target = resolveImport(file.path, specifier);
					return target === undefined
						? SERVER_PACKAGES.some((pattern) => pattern.test(specifier))
						: isServerOnly(target);
				})
				.map((specifier) => `${file.path} imports ${specifier}`),
		);
}

/** Each export names its source and the built files next to it, and the source exists. */
export function brokenExports(
	packageRoot: string,
	exports: Record<string, Record<string, string>>,
): ReadonlyArray<string> {
	return Object.entries(exports).flatMap(([subpath, conditions]) => {
		const source = conditions["@voila.dev/source"];
		if (source === undefined)
			return [`${subpath} has no @voila.dev/source condition`];
		const built = source.replace(/^\.\/src\//, "./dist/");
		const problems = [
			existsSync(join(packageRoot, source))
				? []
				: [`${subpath}: ${source} does not exist`],
			conditions.types === built.replace(/\.ts$/, ".d.ts")
				? []
				: [`${subpath}: types should be ${built.replace(/\.ts$/, ".d.ts")}`],
			conditions.default === built.replace(/\.ts$/, ".js")
				? []
				: [`${subpath}: default should be ${built.replace(/\.ts$/, ".js")}`],
		];
		return problems.flat();
	});
}

function isTestFile(path: string): boolean {
	return path.endsWith(".test.ts") || path.endsWith(".test-helper.ts");
}
