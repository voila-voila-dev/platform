import { exportKeyOf } from "./layout.ts";

export type ExportsMap = Readonly<
	Record<string, Readonly<Record<string, string>>>
>;

/**
 * The `exports` map lists exactly the entry points the folders define, each
 * with its source and the built files that mirror it, and no two entry points
 * claim the same subpath (an adapter named like a submodule).
 */
export function exportProblems(
	paths: ReadonlyArray<string>,
	exports: ExportsMap,
): ReadonlyArray<string> {
	const entries = new Map<string, Array<string>>();
	for (const path of paths) {
		const key = exportKeyOf(path);
		if (key !== undefined)
			entries.set(key, [...(entries.get(key) ?? []), path]);
	}
	const collisions = Array.from(entries)
		.filter(([, sources]) => sources.length > 1)
		.map(([key, sources]) => `${key} is claimed by ${sources.join(" and ")}`);
	const missing = Array.from(entries.keys())
		.filter((key) => exports[key] === undefined)
		.map((key) => `${key} is missing from exports`);
	const unexpected = Object.keys(exports)
		.filter((key) => !entries.has(key))
		.map((key) => `${key} matches no entry point`);
	const mismatched = Array.from(entries).flatMap(([key, sources]) => {
		const conditions = exports[key];
		const [source, ...others] = sources;
		return conditions === undefined || source === undefined || others.length > 0
			? []
			: conditionProblems(key, source, conditions);
	});
	return [...collisions, ...missing, ...unexpected, ...mismatched];
}

function conditionProblems(
	key: string,
	source: string,
	conditions: Readonly<Record<string, string>>,
): ReadonlyArray<string> {
	const expected: Record<string, string> = {
		"@voila.dev/source": `./src/${source}`,
		types: `./dist/${source.replace(/\.ts$/, ".d.ts")}`,
		default: `./dist/${source.replace(/\.ts$/, ".js")}`,
	};
	return Object.entries(expected)
		.filter(([condition, value]) => conditions[condition] !== value)
		.map(([condition, value]) => `${key}: ${condition} should be ${value}`);
}
