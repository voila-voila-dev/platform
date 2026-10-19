import { Context, type Option } from "effect";
import type { ImportSchema } from "#bulk-import/lib/import-schema";
import type { ImportTarget } from "#bulk-import/value-objects/import-target";

export class ImportSchemas extends Context.Service<
	ImportSchemas,
	{
		readonly schemaFor: (target: ImportTarget) => Option.Option<ImportSchema>;
	}
>()("@voila.dev/platform/ImportSchemas") {}
