import { exportKeyOf } from "./layout.ts";

type PathMap = Readonly<Record<string, string>>;

/** The fields of `package.json` that point at files. */
export interface Manifest {
	readonly exports?: PathMap;
	readonly imports?: PathMap;
	readonly publishConfig?: {
		readonly exports?: PathMap;
		readonly imports?: PathMap;
	};
}

/**
 * `exports` lists exactly the entry points the folders define, pointing at
 * their source, and `publishConfig.exports` lists the same subpaths, pointing
 * at the built files. No two entry points claim the same subpath (an adapter
 * named like a submodule).
 */
export function exportProblems(
	paths: ReadonlyArray<string>,
	manifest: Manifest,
): ReadonlyArray<string> {
	const exports = manifest.exports ?? {};
	const published = manifest.publishConfig?.exports ?? {};
	const entries = new Map<string, Array<string>>();
	for (const path of paths) {
		const key = exportKeyOf(path);
		if (key !== undefined)
			entries.set(key, [...(entries.get(key) ?? []), path]);
	}
	const collisions = Array.from(entries)
		.filter(([, sources]) => sources.length > 1)
		.map(([key, sources]) => `${key} is claimed by ${sources.join(" and ")}`);
	const unexpected = [
		...Object.keys(exports).filter((key) => !entries.has(key)),
		...Object.keys(published).filter((key) => !entries.has(key)),
	].map((key) => `${key} matches no entry point`);
	const mismatched = Array.from(entries).flatMap(([key, sources]) => {
		const [source, ...others] = sources;
		if (source === undefined || others.length > 0) return [];
		return [
			expectPath(`exports["${key}"]`, exports[key], `./src/${source}`),
			expectPath(
				`publishConfig.exports["${key}"]`,
				published[key],
				`./dist/${source.replace(/\.ts$/, ".js")}`,
			),
		].flat();
	});
	return [...collisions, ...unexpected, ...mismatched];
}

/** `#` imports read the source in the repository and the built files once published. */
export function importMapProblems(manifest: Manifest): ReadonlyArray<string> {
	return [
		expectPath('imports["#*"]', manifest.imports?.["#*"], "./src/*.ts"),
		expectPath(
			'publishConfig.imports["#*"]',
			manifest.publishConfig?.imports?.["#*"],
			"./dist/*.js",
		),
	].flat();
}

function expectPath(
	field: string,
	actual: string | undefined,
	expected: string,
): ReadonlyArray<string> {
	if (actual === expected) return [];
	return actual === undefined
		? [`${field} is missing: it should be ${expected}`]
		: [`${field} should be ${expected}, not ${actual}`];
}
