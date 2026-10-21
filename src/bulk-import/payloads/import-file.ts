import { Schema } from "effect";
import { ImportFormat } from "#bulk-import/value-objects/import-format";

export const ImportFileFields = {
	fileName: Schema.String,
	format: Schema.optional(ImportFormat),
	content: Schema.Uint8ArrayFromBase64,
};
