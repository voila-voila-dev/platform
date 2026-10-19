import { Schema } from "effect";

export const ImportDraftStatus = Schema.Literals([
	"reviewing",
	"importing",
	"imported",
]);

export type ImportDraftStatus = typeof ImportDraftStatus.Type;
