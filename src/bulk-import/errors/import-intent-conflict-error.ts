import { Schema } from "effect";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";

// Someone else changed the intent since it was read, or is importing a batch of it.
export class ImportIntentConflictError extends Schema.TaggedError<ImportIntentConflictError>()(
	"ImportIntentConflictError",
	{ id: ImportIntentId },
) {}
