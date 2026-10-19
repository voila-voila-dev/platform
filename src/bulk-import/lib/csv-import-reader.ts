import { Effect } from "effect";
import { decodeText } from "#bulk-import/lib/decode-text";
import { parseCsv } from "#bulk-import/lib/parse-csv";
import type { ImportReader } from "#bulk-import/services/import-readers";

export const csvImportReader: ImportReader = {
	format: "csv",
	read: (bytes) => Effect.sync(() => parseCsv(decodeText(bytes)).rows),
};
