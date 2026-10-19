import { Option, Schema } from "effect";
import type { ImportIssue } from "#bulk-import/payloads/import-issue";
import type { ImportRow } from "#bulk-import/payloads/import-row";

export interface ImportColumn {
	readonly key: string;
	readonly headerAliases: ReadonlyArray<string>;
	readonly required?: boolean;
	readonly unique?: boolean;
	readonly normalize?: (value: string) => string;
	readonly validate?: (value: string) => boolean;
}

export interface ImportSchema {
	readonly columns: ReadonlyArray<ImportColumn>;
}

export interface DecodedImport {
	readonly rows: ReadonlyArray<ImportRow>;
	readonly missingColumns: ReadonlyArray<string>;
	readonly hasHeaderRow: boolean;
}

export function cellMatchesSchema(schema: Schema.Decoder<unknown>) {
	return (value: string): boolean =>
		Option.isSome(Schema.decodeUnknownOption(schema)(value));
}

function normalizeHeader(header: string): string {
	return header
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9]/gu, "");
}

function matchHeaderRow(
	schema: ImportSchema,
	header: ReadonlyArray<string>,
): ReadonlyMap<string, number> | null {
	const normalizedHeader = header.map(normalizeHeader);
	const mapping = new Map<string, number>();
	const taken = new Set<number>();

	for (const column of schema.columns) {
		for (const alias of [column.key, ...column.headerAliases]) {
			const wanted = normalizeHeader(alias);
			const at = normalizedHeader.findIndex(
				(candidate, index) => candidate === wanted && !taken.has(index),
			);
			if (at !== -1) {
				mapping.set(column.key, at);
				taken.add(at);
				break;
			}
		}
	}

	return mapping.size === 0 ? null : mapping;
}

function canonicalValue(column: ImportColumn, raw: string): string {
	const trimmed = raw.trim();
	return column.normalize === undefined ? trimmed : column.normalize(trimmed);
}

type SeenValues = ReadonlyMap<string, Map<string, number>>;

function duplicateIssue(
	column: ImportColumn,
	value: string,
	rowIndex: number,
	seenValues: SeenValues,
): ImportIssue | null {
	const seen = seenValues.get(column.key);
	if (seen === undefined) return null;

	const owner = seen.get(value);
	if (owner === undefined) {
		seen.set(value, rowIndex);
		return null;
	}
	return owner === rowIndex ? null : "Duplicate";
}

function cellIssue(
	column: ImportColumn,
	raw: string,
	rowIndex: number,
	missing: ReadonlySet<string>,
	seenValues: SeenValues,
): ImportIssue | null {
	if (missing.has(column.key)) return "MissingColumn";

	const value = canonicalValue(column, raw);
	if (value === "") return column.required === true ? "Required" : null;
	if (column.validate !== undefined && !column.validate(value))
		return "InvalidValue";
	return duplicateIssue(column, value, rowIndex, seenValues);
}

// Duplicates are file-wide, so one edit can clear or raise an issue on another row.
export function revalidateImportRows(
	schema: ImportSchema,
	rows: ReadonlyArray<ImportRow>,
	missingColumns: ReadonlyArray<string> = [],
): ReadonlyArray<ImportRow> {
	const missing = new Set(missingColumns);
	const seenValues = new Map<string, Map<string, number>>(
		schema.columns
			.filter((column) => column.unique === true)
			.map((column) => [column.key, new Map()]),
	);

	return rows.map((row) => ({
		...row,
		issues: schema.columns.flatMap((column) => {
			const issue = cellIssue(
				column,
				row.values[column.key] ?? "",
				row.index,
				missing,
				seenValues,
			);
			return issue === null ? [] : [{ column: column.key, issue }];
		}),
	}));
}

// Columns are matched by header when the first line names any of them, by
// position otherwise.
export function decodeImportTable(
	schema: ImportSchema,
	table: ReadonlyArray<ReadonlyArray<string>>,
): DecodedImport {
	if (table.length === 0)
		return { rows: [], missingColumns: [], hasHeaderRow: false };

	const mapping = matchHeaderRow(schema, table[0] ?? []);
	const lines = mapping === null ? table : table.slice(1);

	function indexOf(column: ImportColumn, position: number) {
		return mapping === null ? position : mapping.get(column.key);
	}

	const missingColumns = schema.columns
		.filter(
			(column, position) =>
				column.required === true && indexOf(column, position) === undefined,
		)
		.map((column) => column.key);

	const rows = lines.map((line, index) => ({
		index,
		values: Object.fromEntries(
			schema.columns.map((column, position) => {
				const at = indexOf(column, position);
				const raw = at === undefined ? "" : (line[at] ?? "");
				return [column.key, canonicalValue(column, raw)];
			}),
		),
		issues: [],
	}));

	return {
		rows: revalidateImportRows(schema, rows, missingColumns),
		missingColumns,
		hasHeaderRow: mapping !== null,
	};
}

export function validImportRows(
	rows: ReadonlyArray<ImportRow>,
): ReadonlyArray<ImportRow> {
	return rows.filter((row) => row.issues.length === 0);
}
