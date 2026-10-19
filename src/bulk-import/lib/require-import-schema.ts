import { Effect, Option } from "effect";
import { ImportTargetNotFoundError } from "#bulk-import/errors/import-target-not-found-error";
import { ImportSchemas } from "#bulk-import/services/import-schemas";
import type { ImportTarget } from "#bulk-import/value-objects/import-target";

export function requireImportSchema(target: ImportTarget) {
	return Effect.flatMap(Effect.service(ImportSchemas), (schemas) =>
		Option.match(schemas.schemaFor(target), {
			onNone: () => Effect.fail(new ImportTargetNotFoundError({ target })),
			onSome: Effect.succeed,
		}),
	);
}
