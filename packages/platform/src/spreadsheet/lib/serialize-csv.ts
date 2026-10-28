type CsvDelimiter = ";" | ",";

const BOM = "﻿";

// A leading one of these makes a spreadsheet evaluate the cell as a formula.
const FORMULA_TRIGGERS = ["=", "+", "-", "@", "\t", "\r"];

function escapeCell(value: string, delimiter: CsvDelimiter): string {
	const inert = FORMULA_TRIGGERS.some((trigger) => value.startsWith(trigger))
		? `'${value}`
		: value;
	const needsQuotes =
		inert.includes(delimiter) ||
		inert.includes('"') ||
		inert.includes("\n") ||
		inert.includes("\r");
	return needsQuotes ? `"${inert.replaceAll('"', '""')}"` : inert;
}

// The BOM makes Excel read UTF-8; `;` is the default because Excel in a locale
// with a decimal comma (French, German…) splits on it, not on `,`.
export function serializeCsv(input: {
	readonly header: ReadonlyArray<string>;
	readonly rows: ReadonlyArray<ReadonlyArray<string>>;
	readonly delimiter?: CsvDelimiter;
}): string {
	const delimiter = input.delimiter ?? ";";
	const lines = [input.header, ...input.rows].map((row) =>
		row.map((cell) => escapeCell(cell, delimiter)).join(delimiter),
	);
	return `${BOM}${lines.join("\r\n")}\r\n`;
}
