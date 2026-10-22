import { describe, expect, it } from "bun:test";
import { DEFAULT_SPREADSHEET_CELL_STYLE } from "#spreadsheet/constants/default-spreadsheet-cell-style";
import { cell, mergedCell } from "#spreadsheet/lib/spreadsheet-cell-builders";

describe("cell builders", () => {
	it("leaves an unstyled cell without a style", () => {
		expect(cell("Ada")).toStrictEqual({ value: "Ada" });
	});

	it("completes a partial style with the defaults", () => {
		expect(mergedCell(3, 2, { bold: true })).toStrictEqual({
			value: 3,
			colSpan: 2,
			style: { ...DEFAULT_SPREADSHEET_CELL_STYLE, bold: true },
		});
	});
});
