import { Exit, Result, Schema } from "effect";
import {
	type ImportColumn,
	type ImportColumnKey,
	type ImportSchema,
	importColumnKeys,
	importRecordDecoder,
	isImportColumn,
} from "#bulk-import/lib/import-schema";
import type {
	ImportCellIssue,
	ImportRow,
} from "#bulk-import/value-objects/import-row";

function normalizeHeader(header: string): string {
	return header
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.replace(/[^a-z0-9]/gu, "");
}

function matchHeader(
	schema: ImportSchema,
	header: ReadonlyArray<string>,
): ReadonlyMap<string, number> | null {
	const normalizedHeader = header.map(normalizeHeader);
	const mapping = new Map<string, number>();
	const taken = new Set<number>();

	for (const [key, column] of Object.entries(schema.columns)) {
		for (const alias of [
			key,
			...(column.label === undefined ? [] : [column.label]),
			...(column.aliases ?? []),
		]) {
			const wanted = normalizeHeader(alias);
			const at = normalizedHeader.findIndex(
				(candidate, index) => candidate === wanted && !taken.has(index),
			);
			if (at !== -1) {
				mapping.set(key, at);
				taken.add(at);
				break;
			}
		}
	}

	return mapping.size === 0 ? null : mapping;
}

function checkCell(
	column: ImportColumn,
	raw: string,
): { readonly text: string; readonly issue?: Omit<ImportCellIssue, "column"> } {
	const text = raw.trim();
	if (text === "")
		return column.required === true
			? { text, issue: { issue: "required" } }
			: { text };
	const decoded = Schema.decodeUnknownResult(column.schema)(text);
	if (Result.isFailure(decoded))
		return {
			text,
			issue: {
				issue: "invalidValue",
				message: column.message ?? decoded.failure.message,
			},
		};
	return { text: Schema.encodeSync(column.schema)(decoded.success) };
}

// Duplicates are file-wide, so one edit can clear or raise an issue on another row.
export function validateImportRows<S extends ImportSchema>(
	schema: S,
	rows: ReadonlyArray<ImportRow>,
): ReadonlyArray<ImportRow<ImportColumnKey<S>>> {
	const seen = new Map<string, Set<string>>();
	const decodeRecord = importRecordDecoder(schema);

	return rows.map((row) => {
		const values = {} as Record<ImportColumnKey<S>, string>;
		const issues: Array<ImportCellIssue<ImportColumnKey<S>>> = [];
		let cellsValid = true;
		for (const key of importColumnKeys(schema)) {
			const column = schema.columns[key];
			if (column === undefined) continue;
			const cell = checkCell(column, row.values[key] ?? "");
			values[key] = cell.text;
			if (cell.issue !== undefined) {
				issues.push({ column: key, ...cell.issue });
				cellsValid = false;
				continue;
			}
			if (column.unique !== true || cell.text === "") continue;
			const taken = seen.get(key) ?? new Set<string>();
			seen.set(key, taken);
			if (taken.has(cell.text))
				issues.push({ column: key, issue: "duplicate" });
			else taken.add(cell.text);
		}
		if (cellsValid && schema.check !== undefined) {
			const record = decodeRecord(values);
			if (Exit.isSuccess(record))
				for (const issue of schema.check(record.value))
					if (isImportColumn(schema, issue.column))
						issues.push({ ...issue, column: issue.column });
		}
		return { index: row.index, values, issues };
	});
}

export function decodeImportTable<S extends ImportSchema>(
	schema: S,
	table: ReadonlyArray<ReadonlyArray<string>>,
): {
	readonly rows: ReadonlyArray<ImportRow<ImportColumnKey<S>>>;
	readonly missingColumns: ReadonlyArray<string>;
} {
	const mapping = matchHeader(schema, table[0] ?? []);
	// Spreadsheets write an emptied row as a line of bare separators.
	const lines = (mapping === null ? table : table.slice(1)).filter((line) =>
		line.some((cell) => cell.trim() !== ""),
	);
	const keys = Object.keys(schema.columns);

	const rows = lines.map((line, index) => ({
		index,
		values: Object.fromEntries(
			keys.map((key, position) => {
				const at = mapping === null ? position : mapping.get(key);
				return [key, at === undefined ? "" : (line[at] ?? "")];
			}),
		),
		issues: [],
	}));

	return {
		rows: validateImportRows(schema, rows),
		missingColumns:
			mapping === null
				? []
				: Object.entries(schema.columns)
						.filter(
							([key, column]) => column.required === true && !mapping.has(key),
						)
						.map(([key]) => key),
	};
}
