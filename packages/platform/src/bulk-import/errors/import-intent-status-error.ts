import { Schema } from "effect";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";
import { ImportIntentStatus } from "#bulk-import/value-objects/import-intent-status";

// Cells are edited while reviewing only, and nothing is left to import once imported.
export class ImportIntentStatusError extends Schema.TaggedError<ImportIntentStatusError>()(
	"ImportIntentStatusError",
	{ id: ImportIntentId, status: ImportIntentStatus },
) {}
