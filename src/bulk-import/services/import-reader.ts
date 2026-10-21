import type { Effect } from "effect";
import type { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import type { ImportFormat } from "#bulk-import/value-objects/import-format";

// A file read as a table: one array of cells per line, the header line included.
export interface ImportReader {
	readonly format: ImportFormat;
	readonly read: (
		bytes: Uint8Array,
	) => Effect.Effect<
		ReadonlyArray<ReadonlyArray<string>>,
		ImportFileRejectedError
	>;
}
