import { Schema } from "effect";
import { ImportIssue } from "#bulk-import/payloads/import-issue";

export const ImportCellIssue = Schema.Struct({
	column: Schema.String,
	issue: ImportIssue,
});

export type ImportCellIssue = typeof ImportCellIssue.Type;

export const ImportRow = Schema.Struct({
	index: Schema.Int,
	values: Schema.Record(Schema.String, Schema.String),
	issues: Schema.Array(ImportCellIssue),
});

export type ImportRow = typeof ImportRow.Type;
