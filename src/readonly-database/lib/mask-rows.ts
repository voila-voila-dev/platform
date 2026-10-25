import type { Schema } from "effect";
import type { JsonRow } from "#readonly-database/services/readonly-database";

export const MASKED_VALUE = "[masked]";

export interface MaskOptions {
	// What counts as personal data is the application's: its column naming and
	// its jurisdiction (a SIRET, an SSN) decide.
	readonly piiColumns: RegExp | ((column: string) => boolean);
	readonly maskedValue?: Schema.Json;
}

function isPii(piiColumns: MaskOptions["piiColumns"], column: string) {
	// `search` ignores `lastIndex`, so a global pattern stays stateless.
	return typeof piiColumns === "function"
		? piiColumns(column)
		: column.search(piiColumns) !== -1;
}

export function maskRows(
	columns: ReadonlyArray<string>,
	rows: ReadonlyArray<JsonRow>,
	options: MaskOptions,
): {
	readonly rows: ReadonlyArray<JsonRow>;
	readonly masked: ReadonlyArray<string>;
} {
	const { piiColumns, maskedValue = MASKED_VALUE } = options;
	const masked = columns.filter((column) => isPii(piiColumns, column));
	if (masked.length === 0) return { rows, masked };
	const maskedSet = new Set(masked);
	return {
		masked,
		rows: rows.map((row) =>
			Object.fromEntries(
				Object.entries(row).map(([column, value]) => [
					column,
					maskedSet.has(column) && value !== null ? maskedValue : value,
				]),
			),
		),
	};
}
