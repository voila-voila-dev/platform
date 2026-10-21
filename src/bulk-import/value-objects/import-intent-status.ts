import { Schema } from "effect";

export const ImportIntentStatus = Schema.Literals([
	"reviewing",
	"importing",
	"imported",
]);

export type ImportIntentStatus = typeof ImportIntentStatus.Type;
