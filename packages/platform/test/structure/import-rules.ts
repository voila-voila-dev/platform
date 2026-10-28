import { describe, type Location, locate } from "./layout.ts";
import { isRelative, resolveImport, type SourceFile } from "./source-files.ts";

/** `[from, to]` between two modules: `["link-tracking/click", "link-tracking/link"]`. */
export type ModuleDependency = readonly [from: string, to: string];

const RUNTIME_PACKAGES = [/^node:/, /^bun(:|$)/];

/**
 * Every import that breaks a rule:
 * - files import each other through `#`, never a relative path;
 * - the core imports no module;
 * - a module's domain and contract import no adapter, no runtime module and
 *   no adapter library (the optional peer dependencies);
 * - an adapter imports only adapters of its own name: the core's, and those
 *   of the modules its module depends on (`link/drizzle` → `search/drizzle`);
 * - a module imports another only when the dependency is declared, except a
 *   module re-exporting its own submodules.
 */
export function importViolations(
	files: ReadonlyArray<SourceFile>,
	dependencies: ReadonlyArray<ModuleDependency>,
	adapterPackages: ReadonlyArray<string>,
): ReadonlyArray<string> {
	const declared = new Set(dependencies.map(dependencyKey));
	return files.flatMap((file) => {
		const from = locate(file.path);
		return file.imports.flatMap((specifier) => {
			const problem = checkImport(from, specifier, declared, adapterPackages);
			return problem === undefined
				? []
				: [`${file.path} imports ${specifier}: ${problem}`];
		});
	});
}

/** Declared dependencies no import uses any more. */
export function unusedDependencies(
	files: ReadonlyArray<SourceFile>,
	dependencies: ReadonlyArray<ModuleDependency>,
): ReadonlyArray<string> {
	const used = new Set(
		files.flatMap((file) => {
			const from = locate(file.path).module;
			return file.imports.flatMap((specifier) => {
				const target = resolveImport(specifier);
				const to = target === undefined ? undefined : locate(target).module;
				return from === undefined || to === undefined || from === to
					? []
					: [dependencyKey([from, to])];
			});
		}),
	);
	return dependencies.map(dependencyKey).filter((key) => !used.has(key));
}

function checkImport(
	from: Location,
	specifier: string,
	declared: ReadonlySet<string>,
	adapterPackages: ReadonlyArray<string>,
): string | undefined {
	if (isRelative(specifier)) return "import it through #, not a relative path";
	const target = resolveImport(specifier);
	const isAdapter = from.part.kind === "adapter";
	if (target === undefined) {
		if (isAdapter) return undefined;
		if (RUNTIME_PACKAGES.some((pattern) => pattern.test(specifier)))
			return `${describe(from)} may run in a browser`;
		if (adapterPackages.some((name) => isPackage(specifier, name)))
			return `${describe(from)} may not use an adapter library`;
		return undefined;
	}
	const to = locate(target);
	if (to.part.kind === "adapter") {
		if (from.part.kind !== "adapter")
			return `${describe(from)} imports no adapter`;
		if (from.part.name !== to.part.name)
			return "an adapter imports only adapters of its own name";
		if (to.module === undefined || to.module === from.module) return undefined;
	}
	if (to.module === undefined) return undefined;
	if (from.module === undefined) return "the core imports no module";
	if (from.module === to.module || isSubmodule(to.module, from.module))
		return undefined;
	if (declared.has(dependencyKey([from.module, to.module]))) return undefined;
	return `undeclared dependency ${from.module} → ${to.module}`;
}

function isSubmodule(module: string, parent: string): boolean {
	return module.startsWith(`${parent}/`);
}

function isPackage(specifier: string, name: string): boolean {
	return specifier === name || specifier.startsWith(`${name}/`);
}

function dependencyKey([from, to]: ModuleDependency): string {
	return `${from} → ${to}`;
}

/** Package imports the manifest does not declare as a peer dependency (`node:` and `bun` aside). */
export function undeclaredPackages(
	files: ReadonlyArray<SourceFile>,
	peerDependencies: ReadonlyArray<string>,
): ReadonlyArray<string> {
	return files.flatMap((file) =>
		file.imports
			.filter(
				(specifier) =>
					resolveImport(specifier) === undefined &&
					!isRelative(specifier) &&
					!RUNTIME_PACKAGES.some((pattern) => pattern.test(specifier)) &&
					!peerDependencies.includes(packageName(specifier)),
			)
			.map((specifier) => `${file.path} imports ${specifier}`),
	);
}

function packageName(specifier: string): string {
	const segments = specifier.split("/");
	return (
		specifier.startsWith("@") ? segments.slice(0, 2) : segments.slice(0, 1)
	).join("/");
}
