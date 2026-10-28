import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Glob } from "bun";

export interface SourceFile {
	/** Relative to `src/`. */
	readonly path: string;
	readonly imports: ReadonlyArray<string>;
}

/** The shipped source files and what each imports; tests and their helpers are left out. */
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

/** Where a `#` import lands, relative to `src/`; `undefined` for a package import. */
export function resolveImport(specifier: string): string | undefined {
	return specifier.startsWith("#") ? `${specifier.slice(1)}.ts` : undefined;
}

export function isRelative(specifier: string): boolean {
	return specifier.startsWith(".");
}

function isTestFile(path: string): boolean {
	return path.endsWith(".test.ts") || path.endsWith(".test-helper.ts");
}
