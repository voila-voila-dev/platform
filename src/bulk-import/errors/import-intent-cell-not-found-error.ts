import { Schema } from "effect";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";
import { NonNegativeInt } from "#core/value-objects/non-negative-int";

export class ImportIntentCellNotFoundError extends Schema.TaggedError<ImportIntentCellNotFoundError>()(
	"ImportIntentCellNotFoundError",
	{ id: ImportIntentId, rowIndex: NonNegativeInt, column: Schema.String },
) {}
