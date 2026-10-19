import { Schema } from "effect";

export const ImportFormat = Schema.NonEmptyString.pipe(
	Schema.brand("ImportFormat"),
);

export type ImportFormat = typeof ImportFormat.Type;

export function importFormatOf(fileName: string): ImportFormat | undefined {
	const extension = fileName.split(".").at(-1)?.toLowerCase();
	return extension === undefined || extension === fileName.toLowerCase()
		? undefined
		: ImportFormat.make(extension);
}
