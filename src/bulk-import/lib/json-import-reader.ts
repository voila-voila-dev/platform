import { Effect } from "effect";
import { ImportFileRejectedError } from "#bulk-import/errors/import-file-rejected-error";
import { decodeText } from "#bulk-import/lib/decode-text";
import type { ImportReader } from "#bulk-import/services/import-readers";

function cellText(value: unknown): string {
	if (value === null || value === undefined) return "";
	if (typeof value === "string") return value.trim();
	if (typeof value === "object") return JSON.stringify(value);
	return String(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

// An array of objects reads as a header of every key, in order of first
// appearance, then one line per object; an array of arrays reads as is.
export function jsonTable(
	value: unknown,
): ReadonlyArray<ReadonlyArray<string>> | undefined {
	if (!Array.isArray(value)) return undefined;
	if (value.every(Array.isArray))
		return value.map((line: ReadonlyArray<unknown>) => line.map(cellText));
	if (!value.every(isRecord)) return undefined;
	const header = [...new Set(value.flatMap((record) => Object.keys(record)))];
	return [
		header,
		...value.map((record) => header.map((key) => cellText(record[key]))),
	];
}

export const jsonImportReader: ImportReader = {
	format: "json",
	read: (bytes) =>
		Effect.try({
			try: () => jsonTable(JSON.parse(decodeText(bytes))),
			catch: () => new ImportFileRejectedError({ reason: "unreadable" }),
		}).pipe(
			Effect.flatMap((table) =>
				table === undefined
					? Effect.fail(new ImportFileRejectedError({ reason: "unreadable" }))
					: Effect.succeed(table),
			),
		),
};
