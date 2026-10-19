import { Schema } from "effect";

export const ImportIssue = Schema.Literals([
	"missingColumn",
	"required",
	"invalidValue",
	"duplicate",
]);

export type ImportIssue = typeof ImportIssue.Type;
