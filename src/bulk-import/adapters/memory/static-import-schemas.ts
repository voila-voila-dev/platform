import { Layer, Option } from "effect";
import type { ImportSchema } from "#bulk-import/lib/import-schema";
import { ImportSchemas } from "#bulk-import/services/import-schemas";

export function staticImportSchemas(
	schemas: Readonly<Record<string, ImportSchema>>,
) {
	return Layer.succeed(ImportSchemas, {
		schemaFor: (target) => Option.fromNullishOr(schemas[target]),
	});
}
