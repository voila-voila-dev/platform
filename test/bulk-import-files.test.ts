import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { Effect, Layer, Schema, SchemaTransformation } from "effect";
import { inMemoryBulkImport } from "#bulk-import/adapters/memory/in-memory-bulk-import";
import { xlsxImportReader } from "#bulk-import/adapters/xlsx/xlsx-import-reader";
import { BulkImport } from "#bulk-import/lib/bulk-import";
import { csvImportReader } from "#bulk-import/lib/csv-import-reader";
import { ImportSchema } from "#bulk-import/lib/import-schema";
import { jsonImportReader } from "#bulk-import/lib/json-import-reader";
import { ImportReaders } from "#bulk-import/services/import-readers";

// Files as Excel, Google Sheets and an API export write them.
function fixture(fileName: string) {
	return Bun.file(
		join(import.meta.dir, "fixtures", "bulk-import", fileName),
	).bytes();
}

const spreadsheetCsv = [
	["Prénom", "Nom", "E-mail", "Téléphone", "Inscrit le", "Note"],
	[
		"Zoé",
		"Lefèvre",
		"zoe.lefevre@exemple.fr",
		"06 12 34 56 78",
		"14/03/2024",
		'Cliente "fidèle"; préfère le mail',
	],
	[
		"Jérôme",
		"Dupont-Garçon",
		"JEROME@EXEMPLE.FR",
		"+33 6 98 76 54 32",
		"02/01/2025",
		"Rappeler\nle lundi",
	],
	["Anaïs", "Œuvray", "pas-une-adresse", "", "", ""],
];

const lastCsvLine = [
	"Jürgen",
	"Müller",
	"jurgen@exemple.de",
	"",
	"",
	"Panier à 120 €",
];

describe("csvImportReader on real files", () => {
	it("reads Excel's UTF-8 CSV: BOM, semicolons, CRLF, quoted line breaks", async () => {
		expect(
			await Effect.runPromise(
				csvImportReader.read(await fixture("contacts-excel-utf8.csv")),
			),
		).toStrictEqual([...spreadsheetCsv, ["", "", "", "", "", ""], lastCsvLine]);
	});

	it("reads Excel's plain CSV, which is Windows-1252", async () => {
		expect(
			await Effect.runPromise(
				csvImportReader.read(await fixture("contacts-excel-windows-1252.csv")),
			),
		).toStrictEqual([...spreadsheetCsv, ["", "", "", "", "", ""], lastCsvLine]);
	});

	it("reads Google Sheets' CSV: commas, no final line break", async () => {
		expect(
			await Effect.runPromise(
				csvImportReader.read(await fixture("contacts-google-sheets.csv")),
			),
		).toStrictEqual([...spreadsheetCsv, lastCsvLine]);
	});
});

describe("jsonImportReader on a real file", () => {
	it("reads an export of typed records, some keys missing", async () => {
		expect(
			await Effect.runPromise(
				jsonImportReader.read(await fixture("contacts-export.json")),
			),
		).toStrictEqual([
			[
				"prenom",
				"nom",
				"email",
				"telephone",
				"inscrit_le",
				"newsletter",
				"tags",
			],
			[
				"Zoé",
				"Lefèvre",
				"zoe.lefevre@exemple.fr",
				"06 12 34 56 78",
				"2024-03-14",
				"true",
				'["fidèle"]',
			],
			[
				"Jérôme",
				"Dupont-Garçon",
				"JEROME@EXEMPLE.FR",
				"+33 6 98 76 54 32",
				"2025-01-02",
				"false",
				"[]",
			],
			["Anaïs", "Œuvray", "pas-une-adresse", "", "", "false", ""],
			["Jürgen", "Müller", "jurgen@exemple.de", "", "", "true", '["panier"]'],
		]);
	});
});

describe("xlsxImportReader on a real file", () => {
	it("reads the first worksheet: rich text, dates, formulas, booleans", async () => {
		expect(
			await Effect.runPromise(
				xlsxImportReader.read(await fixture("contacts-excel.xlsx")),
			),
		).toStrictEqual([
			[
				"Prénom",
				"Nom",
				"E-mail",
				"Téléphone",
				"Inscrit le",
				"Newsletter",
				"Nom complet",
			],
			[
				"Zoé",
				"Lefèvre",
				"zoe.lefevre@exemple.fr",
				"06 12 34 56 78",
				"2024-03-14",
				"true",
				"Zoé Lefèvre",
			],
			[
				"Jérôme",
				"Dupont-Garçon",
				"JEROME@EXEMPLE.FR",
				"+33 6 98 76 54 32",
				"2025-01-02",
				"false",
				"Jérôme Dupont-Garçon",
			],
			["Anaïs", "Œuvray", "pas-une-adresse", "", "", "false", "Anaïs Œuvray"],
			[
				"Jürgen",
				"Müller",
				"jurgen@exemple.de",
				"",
				"",
				"true",
				"Jürgen Müller",
			],
		]);
	});
});

describe("an intent from each real file", () => {
	const contactsImport = BulkImport.make(
		ImportSchema.make({
			target: "contacts",
			columns: {
				prenom: { schema: Schema.String },
				nom: { schema: Schema.String },
				email: {
					schema: Schema.String.pipe(
						Schema.decode(SchemaTransformation.toLowerCase()),
					).check(Schema.isIncluding("@")),
					required: true,
					unique: true,
				},
				telephone: { schema: Schema.String },
			},
		}),
	);
	const layer = Layer.mergeAll(
		inMemoryBulkImport().layer,
		Layer.succeed(ImportReaders, [
			csvImportReader,
			jsonImportReader,
			xlsxImportReader,
		]),
	);

	for (const fileName of [
		"contacts-excel-utf8.csv",
		"contacts-excel-windows-1252.csv",
		"contacts-google-sheets.csv",
		"contacts-export.json",
		"contacts-excel.xlsx",
	])
		it(`reads the same contacts from ${fileName}`, async () => {
			const intent = await Effect.runPromise(
				Effect.flatMap(
					Effect.promise(() => fixture(fileName)),
					(content) => contactsImport.create({ fileName, content }),
				).pipe(Effect.provide(layer)),
			);

			expect(intent.rows.map((row) => row.values)).toStrictEqual([
				{
					prenom: "Zoé",
					nom: "Lefèvre",
					email: "zoe.lefevre@exemple.fr",
					telephone: "06 12 34 56 78",
				},
				{
					prenom: "Jérôme",
					nom: "Dupont-Garçon",
					email: "jerome@exemple.fr",
					telephone: "+33 6 98 76 54 32",
				},
				{
					prenom: "Anaïs",
					nom: "Œuvray",
					email: "pas-une-adresse",
					telephone: "",
				},
				{
					prenom: "Jürgen",
					nom: "Müller",
					email: "jurgen@exemple.de",
					telephone: "",
				},
			]);
			expect(intent.rows.map((row) => row.issues)).toStrictEqual([
				[],
				[],
				[
					{
						column: "email",
						issue: "invalidValue",
						message: 'Expected a string including "@"',
					},
				],
				[],
			]);
		});
});
