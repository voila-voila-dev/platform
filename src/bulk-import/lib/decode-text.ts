import { Effect } from "effect";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";

export function decodeText(
	bytes: Uint8Array,
): Effect.Effect<string, ImportFileRejectedError> {
	return Effect.try({
		try: () => new TextDecoder("utf-8", { fatal: true }).decode(bytes),
		catch: () => new ImportFileRejectedError({ reason: "Unreadable" }),
	});
}
