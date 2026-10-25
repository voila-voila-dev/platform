import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import ExcelJS from "exceljs";
import { xlsxSpreadsheetRenderer } from "#spreadsheet/adapters/xlsx/xlsx-spreadsheet-renderer";
import { cell, mergedCell } from "#spreadsheet/lib/spreadsheet-cell-builders";
import { SpreadsheetService } from "#spreadsheet/services/spreadsheet-service";
import type { SpreadsheetDocument } from "#spreadsheet/value-objects/spreadsheet-document";

// A 1×1 transparent PNG.
const PIXEL = Uint8Array.from(
	atob(
		"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
	),
	(character) => character.charCodeAt(0),
);

async function render(document: SpreadsheetDocument) {
	const bytes = await Effect.runPromise(
		SpreadsheetService.use((renderer) => renderer.render(document)).pipe(
			Effect.provide(xlsxSpreadsheetRenderer),
		),
	);
	const workbook = new ExcelJS.Workbook();
	await workbook.xlsx.load(new Uint8Array(bytes).buffer);
	return workbook;
}

describe("xlsxSpreadsheetRenderer", () => {
	it("writes each sheet's cells, merges, widths, heights and frozen rows", async () => {
		const workbook = await render({
			sheets: [
				{
					name: "Commande",
					columns: [{ width: 30 }, {}],
					freezeRows: 1,
					rows: [
						{ cells: [mergedCell("Titre", 2, { bold: true })], height: 40 },
						{
							cells: [
								cell("Total"),
								cell(12.5, {
									numberFormat: "#,##0.00",
									fillColor: "EEEEEE",
									border: true,
								}),
							],
						},
						{ cells: [cell(null), cell("après")] },
					],
				},
				{ name: "Vide", rows: [] },
			],
		});

		expect(workbook.worksheets.map((sheet) => sheet.name)).toStrictEqual([
			"Commande",
			"Vide",
		]);
		const sheet = workbook.getWorksheet("Commande");
		if (sheet === undefined) throw new Error("no sheet");
		expect(sheet.getCell("A1").value).toBe("Titre");
		expect(sheet.getCell("A1").font.bold).toBe(true);
		expect(sheet.getCell("B1").isMerged).toBe(true);
		expect(sheet.getRow(1).height).toBe(40);
		expect(sheet.getColumn(1).width).toBe(30);
		expect(sheet.getCell("B2").value).toBe(12.5);
		expect(sheet.getCell("B2").numFmt).toBe("#,##0.00");
		expect(sheet.getCell("B2").fill).toMatchObject({
			fgColor: { argb: "FFEEEEEE" },
		});
		expect(sheet.getCell("B2").border.top?.style).toBe("thin");
		expect(sheet.getCell("A3").value).toBeNull();
		expect(sheet.getCell("B3").value).toBe("après");
		expect(sheet.views[0]).toMatchObject({ state: "frozen", ySplit: 1 });
	});

	it("draws a sheet's images", async () => {
		const workbook = await render({
			sheets: [
				{
					name: "Logo",
					rows: [{ cells: [cell(null)], height: 45 }],
					images: [
						{
							content: PIXEL,
							extension: "png",
							column: 0.15,
							row: 0.15,
							widthPx: 52,
							heightPx: 52,
						},
					],
				},
			],
		});

		expect(workbook.getWorksheet("Logo")?.getImages()).toHaveLength(1);
	});
});
