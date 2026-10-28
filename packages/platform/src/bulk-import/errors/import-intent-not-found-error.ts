import { Schema } from "effect";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";

export class ImportIntentNotFoundError extends Schema.TaggedError<ImportIntentNotFoundError>()(
	"ImportIntentNotFoundError",
	{ id: ImportIntentId },
) {}
