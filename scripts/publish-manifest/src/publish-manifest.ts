type Json = Readonly<Record<string, unknown>>;

const PUBLISHED_FIELDS = ["exports", "imports"];

/**
 * The manifest as published: `exports` and `imports` point at the source in
 * the repository, and `publishConfig` holds their built counterparts, the way
 * pnpm reads it. Bun and npm do not swap them, so this does. Every other
 * field, and the order of the fields, stays as it is.
 */
export function publishManifest(manifest: Json): Json {
	const { publishConfig } = manifest;
	if (!isRecord(publishConfig)) return manifest;
	return Object.fromEntries(
		Object.entries(manifest).map(([field, value]) => {
			if (field === "publishConfig")
				return [field, withoutFields(publishConfig, PUBLISHED_FIELDS)];
			return [field, publishConfig[field] ?? value];
		}),
	);
}

function withoutFields(record: Json, fields: ReadonlyArray<string>): Json {
	return Object.fromEntries(
		Object.entries(record).filter(([field]) => !fields.includes(field)),
	);
}

function isRecord(value: unknown): value is Json {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
