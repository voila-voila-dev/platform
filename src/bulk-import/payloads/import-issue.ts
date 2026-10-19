import { Schema } from "effect";

export const ImportIssue = Schema.Literals([
	"MissingColumn",
	"Required",
	"InvalidValue",
	"Duplicate",
]);

export type ImportIssue = typeof ImportIssue.Type;
