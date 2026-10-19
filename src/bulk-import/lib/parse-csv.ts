const CANDIDATE_DELIMITERS = [",", ";", "\t"] as const;

export type CsvDelimiter = (typeof CANDIDATE_DELIMITERS)[number];

interface CsvTable {
	readonly rows: ReadonlyArray<ReadonlyArray<string>>;
	readonly delimiter: CsvDelimiter;
}

const BOM = "﻿";
function isLineBreak(character: string | undefined): boolean {
	return character === "\n" || character === "\r";
}

function firstLineOutsideQuotes(text: string): string {
	let line = "";
	let inQuotes = false;

	for (let index = 0; index < text.length; index += 1) {
		const character = text[index];
		if (character === '"') {
			// A doubled quote is an escaped quote, not a close.
			if (inQuotes && text[index + 1] === '"') {
				index += 1;
				continue;
			}
			inQuotes = !inQuotes;
			continue;
		}
		if (inQuotes) continue;
		if (isLineBreak(character)) break;
		line += character;
	}

	return line;
}

export function sniffCsvDelimiter(text: string): CsvDelimiter {
	const line = firstLineOutsideQuotes(text);
	let best: CsvDelimiter = ",";
	let bestCount = 0;

	for (const delimiter of CANDIDATE_DELIMITERS) {
		const count = line.split(delimiter).length - 1;
		if (count > bestCount) {
			best = delimiter;
			bestCount = count;
		}
	}

	return best;
}

interface FieldRead {
	readonly value: string;
	readonly next: number;
}

function readQuotedField(text: string, start: number): FieldRead {
	let value = "";
	let index = start + 1;

	while (index < text.length) {
		if (text[index] !== '"') {
			value += text[index];
			index += 1;
			continue;
		}
		if (text[index + 1] === '"') {
			value += '"';
			index += 2;
			continue;
		}
		index += 1;
		break;
	}

	return { value, next: index };
}

function readPlainField(
	text: string,
	start: number,
	delimiter: CsvDelimiter,
): FieldRead {
	let index = start;
	while (
		index < text.length &&
		text[index] !== delimiter &&
		!isLineBreak(text[index])
	) {
		index += 1;
	}
	// Unquoted cells are trimmed; quoted ones keep their padding verbatim.
	return { value: text.slice(start, index).trim(), next: index };
}

export function parseCsv(input: string): CsvTable {
	const text = input.startsWith(BOM) ? input.slice(BOM.length) : input;
	const delimiter = sniffCsvDelimiter(text);

	const rows: Array<Array<string>> = [];
	let row: Array<string> = [];
	let index = 0;

	function endRow() {
		// A blank line parses as one empty cell; that is not a record.
		if (!(row.length === 1 && row[0] === "")) rows.push(row);
		row = [];
	}

	while (index < text.length) {
		const field =
			text[index] === '"'
				? readQuotedField(text, index)
				: readPlainField(text, index, delimiter);
		row.push(field.value);
		index = field.next;

		if (index >= text.length) break;
		if (text[index] === delimiter) {
			index += 1;
			// A trailing delimiter means one more (empty) cell.
			if (index >= text.length) row.push("");
			continue;
		}
		// Swallow the LF of a CRLF pair so it does not open a second row.
		index += text[index] === "\r" && text[index + 1] === "\n" ? 2 : 1;
		endRow();
	}

	if (row.length > 0) endRow();

	return { rows, delimiter };
}
