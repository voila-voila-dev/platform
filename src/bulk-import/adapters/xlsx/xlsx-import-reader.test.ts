import { describe, expect, it } from "bun:test";
import { Effect, Exit } from "effect";
import ExcelJS from "exceljs";
import { xlsxImportReader } from "#bulk-import/adapters/xlsx/xlsx-import-reader";

async function workbook(lines: ReadonlyArray<ReadonlyArray<unknown>>) {
	const book = new ExcelJS.Workbook();
	const sheet = book.addWorksheet("Contacts");
	for (const line of lines) sheet.addRow([...line]);
	return new Uint8Array(await book.xlsx.writeBuffer());
}

describe("xlsxImportReader", () => {
	it("reads the first worksheet as displayed", async () => {
		const bytes = await workbook([
			["Email", "Âge"],
			["a@x.fr", 31],
			["b@x.fr", null],
		]);

		expect(await Effect.runPromise(xlsxImportReader.read(bytes))).toStrictEqual(
			[
				["Email", "Âge"],
				["a@x.fr", "31"],
				["b@x.fr", ""],
			],
		);
	});

	it("rejects bytes that are no workbook", async () => {
		const exit = await Effect.runPromiseExit(
			xlsxImportReader.read(new TextEncoder().encode("email\na@x.fr")),
		);

		expect(Exit.isFailure(exit)).toBe(true);
	});
});
