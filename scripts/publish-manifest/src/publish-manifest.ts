type Json = Readonly<Record<string, unknown>>;

export interface Workspace {
	readonly versions: Readonly<Record<string, string>>;
	/** The default catalog is keyed by "". */
	readonly catalogs: Readonly<Record<string, Readonly<Record<string, string>>>>;
}

const PUBLISHED_FIELDS = ["exports", "imports"];
const DEPENDENCY_FIELDS = [
	"dependencies",
	"peerDependencies",
	"optionalDependencies",
];

/**
 * The manifest as published: `exports` and `imports` point at the source in
 * the repository, and `publishConfig` holds their built counterparts, the way
 * pnpm reads it. Bun and npm do not swap them, so this does. npm does not
 * read `workspace:` and `catalog:` ranges either, so they become the versions
 * they stand for, and `devDependencies`, which no consumer installs, go.
 * Every other field, and the order of the fields, stays as it is.
 */
export function publishManifest(manifest: Json, workspace: Workspace): Json {
	const publishConfig = isRecord(manifest.publishConfig)
		? manifest.publishConfig
		: undefined;
	return Object.fromEntries(
		Object.entries(manifest)
			.filter(([field]) => field !== "devDependencies")
			.map(([field, value]) => {
				if (field === "publishConfig" && publishConfig)
					return [field, withoutFields(publishConfig, PUBLISHED_FIELDS)];
				if (DEPENDENCY_FIELDS.includes(field) && isRecord(value))
					return [field, resolvedRanges(value, workspace)];
				if (publishConfig && PUBLISHED_FIELDS.includes(field))
					return [field, publishConfig[field] ?? value];
				return [field, value];
			}),
	);
}

function resolvedRanges(dependencies: Json, workspace: Workspace): Json {
	return Object.fromEntries(
		Object.entries(dependencies).map(([name, range]) => [
			name,
			resolvedRange(name, String(range), workspace),
		]),
	);
}

function resolvedRange(
	name: string,
	range: string,
	workspace: Workspace,
): string {
	if (range.startsWith("workspace:")) {
		const version = workspace.versions[name];
		if (version === undefined)
			throw new Error(`${name} is not a package of this workspace`);
		const prefix = range.slice("workspace:".length);
		if (prefix === "*") return version;
		if (prefix === "^" || prefix === "~") return `${prefix}${version}`;
		return prefix;
	}
	if (range.startsWith("catalog:")) {
		const catalog = range.slice("catalog:".length);
		const version = workspace.catalogs[catalog]?.[name];
		if (version === undefined)
			throw new Error(`${name} is not in the ${catalog || "default"} catalog`);
		return version;
	}
	return range;
}

function withoutFields(record: Json, fields: ReadonlyArray<string>): Json {
	return Object.fromEntries(
		Object.entries(record).filter(([field]) => !fields.includes(field)),
	);
}

function isRecord(value: unknown): value is Json {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
