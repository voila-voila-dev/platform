import { Schema } from "effect";

export const ImportDraftStatus = Schema.Literals([
	"Reviewing",
	"Importing",
	"Imported",
]);

export type ImportDraftStatus = typeof ImportDraftStatus.Type;
