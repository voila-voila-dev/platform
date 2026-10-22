import type { Schema } from "effect";
import type { JsonRow } from "#readonly-database/services/readonly-database";

// Wider than email, phone, IBAN and address on purpose: a name column is what
// turns a row into a person.
const PII_COLUMN =
	/(^|_)(email|e_mail|phone|mobile|tel|iban|bic|address|street|address_line|postal_code|zip|first_name|last_name|full_name|display_name|birth|date_of_birth|ssn|social_security|passport|id_number|tax_id|siret|siren)(_|$)|(^|_)(line1|line2)$|\biban\b/iu;

export const MASKED_VALUE = "[masked]";

export function isPiiColumn(column: string): boolean {
	return PII_COLUMN.test(column);
}

export interface MaskOptions {
	readonly isPii?: (column: string) => boolean;
	readonly maskedValue?: Schema.Json;
}

export function maskRows(
	columns: ReadonlyArray<string>,
	rows: ReadonlyArray<JsonRow>,
	options: MaskOptions = {},
): {
	readonly rows: ReadonlyArray<JsonRow>;
	readonly masked: ReadonlyArray<string>;
} {
	const { isPii = isPiiColumn, maskedValue = MASKED_VALUE } = options;
	const masked = columns.filter(isPii);
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
