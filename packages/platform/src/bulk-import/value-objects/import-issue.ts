import { Schema } from "effect";

export const ImportIssue = Schema.Literals([
	"required",
	"invalidValue",
	"duplicate",
]);

export type ImportIssue = typeof ImportIssue.Type;
