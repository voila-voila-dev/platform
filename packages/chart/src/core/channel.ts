import type { ChartAccessor, ChartValue } from "#/core/types.ts";

/** Reads one channel off every datum. A missing field reads as `undefined`, never a throw. */
export function readChannel<TDatum, TValue>(
	data: ReadonlyArray<TDatum>,
	accessor: ChartAccessor<TDatum, TValue> | undefined,
): ReadonlyArray<TValue | undefined> {
	if (accessor === undefined) {
		return data.map(() => undefined);
	}
	if (typeof accessor === "function") {
		return data.map((datum, index) => accessor(datum, index));
	}
	return data.map(
		(datum) => (datum as Record<string, unknown>)[accessor] as TValue,
	);
}

/** The field name an accessor reads, for an axis or column heading. */
export function channelLabel<TDatum, TValue>(
	accessor: ChartAccessor<TDatum, TValue> | undefined,
): string | undefined {
	return typeof accessor === "string" ? accessor : undefined;
}

/** A value a scale can place: finite numbers, valid dates and strings. */
export function isPlaceable(value: unknown): value is ChartValue {
	if (typeof value === "number") {
		return Number.isFinite(value);
	}
	if (value instanceof Date) {
		return !Number.isNaN(value.getTime());
	}
	return typeof value === "string";
}

/** A number off a channel, or `undefined` for a gap. Numeric strings count. */
export function numericValue(value: unknown): number | undefined {
	if (typeof value === "number") {
		return Number.isFinite(value) ? value : undefined;
	}
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : undefined;
	}
	return undefined;
}

export function placeableValues(
	values: ReadonlyArray<unknown>,
): ReadonlyArray<ChartValue> {
	return values.filter(isPlaceable);
}
