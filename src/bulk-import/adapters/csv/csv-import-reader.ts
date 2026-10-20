import { Effect } from "effect";
import { parseCsv } from "#bulk-import/adapters/csv/parse-csv";
import { decodeText } from "#bulk-import/lib/decode-text";
import type { ImportReader } from "#bulk-import/services/import-reader";
import { ImportFormat } from "#bulk-import/value-objects/import-format";

export const csvImportReader: ImportReader = {
	format: ImportFormat.make("csv"),
	read: (bytes) => Effect.sync(() => parseCsv(decodeText(bytes))),
};
