import type { ImportIssue } from "#bulk-import/value-objects/import-issue";
import type { ImportRowResult } from "#bulk-import/value-objects/import-row-result";

export interface ImportCellIssue<Column extends string = string> {
	readonly column: Column;
	readonly issue: ImportIssue;
	readonly message?: string;
}

// The cells as text, canonical once valid: what the review screen shows and edits.
export interface ImportRow<Column extends string = string> {
	readonly index: number;
	readonly values: Readonly<Record<Column, string>>;
	readonly issues: ReadonlyArray<ImportCellIssue<Column>>;
	readonly result?: ImportRowResult;
}
