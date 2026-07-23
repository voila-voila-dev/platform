// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useSpreadsheetColumnSizing } from "#/hooks/use-spreadsheet-column-sizing.ts";

const STORAGE_KEY = "test.column-sizing";
const COLUMN_IDS = ["name", "sku", "price"];

afterEach(() => {
	cleanup();
	window.localStorage.clear();
});

const renderSizing = (columnIds: readonly string[] = COLUMN_IDS) =>
	renderHook(() =>
		useSpreadsheetColumnSizing({ storageKey: STORAGE_KEY, columnIds }),
	);

const stored = () => window.localStorage.getItem(STORAGE_KEY);

describe("useSpreadsheetColumnSizing", () => {
	it("starts empty so every column follows its declared default width", () => {
		expect(renderSizing().result.current.columnSizing).toEqual({});
	});

	it("persists a resize and reads it back on the next mount", () => {
		const first = renderSizing();
		act(() => {
			first.result.current.onColumnSizingChange({ name: 320 });
		});
		expect(first.result.current.columnSizing).toEqual({ name: 320 });
		expect(stored()).toBe(JSON.stringify({ name: 320 }));
		cleanup();
		expect(renderSizing().result.current.columnSizing).toEqual({ name: 320 });
	});

	it("drops widths for columns the table no longer declares", () => {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ name: 320, retired: 120 }),
		);
		expect(renderSizing().result.current.columnSizing).toEqual({ name: 320 });
	});

	it("drops out-of-range and non-numeric widths rather than wedging a column", () => {
		window.localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ name: 4, sku: 9000, price: "wide" }),
		);
		expect(renderSizing().result.current.columnSizing).toEqual({});
	});

	it("falls back to the defaults when the entry is corrupt", () => {
		window.localStorage.setItem(STORAGE_KEY, "{not json");
		expect(renderSizing().result.current.columnSizing).toEqual({});
	});

	it("clears the stored widths on reset", () => {
		const screen = renderSizing();
		act(() => {
			screen.result.current.onColumnSizingChange({ name: 320 });
		});
		act(() => {
			screen.result.current.reset();
		});
		expect(screen.result.current.columnSizing).toEqual({});
		expect(stored()).toBe("{}");
	});
});
