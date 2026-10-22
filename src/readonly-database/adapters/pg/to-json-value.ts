import type { Schema } from "effect";

// pg hands back `Date`s, buffers, `bigint`s and the numbers JSON has no room
// for; the result is declared as JSON, so every cell is made one here.
export function toJsonValue(value: unknown): Schema.Json {
	if (value === undefined || value === null) return null;
	if (value instanceof Date) {
		// `infinity` and `-infinity` timestamps reach us as unrepresentable dates.
		return Number.isNaN(value.getTime()) ? String(value) : value.toISOString();
	}
	if (typeof value === "bigint") return value.toString();
	if (value instanceof Uint8Array) return `<${value.byteLength} bytes>`;
	if (Array.isArray(value)) return value.map(toJsonValue);
	if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, cell]) => [key, toJsonValue(cell)]),
		);
	}
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : String(value);
	}
	if (typeof value === "string" || typeof value === "boolean") return value;
	return String(value);
}
