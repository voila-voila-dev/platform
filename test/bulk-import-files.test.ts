import { describe, expect, it } from "bun:test";
import { join } from "node:path";
import { Effect, Layer } from "effect";
import { inMemoryImportDraftRepository } from "#bulk-import/adapters/memory/in-memory-import-draft-repository";
import { staticImportSchemas } from "#bulk-import/adapters/memory/static-import-schemas";
import { xlsxImportReader } from "#bulk-import/adapters/xlsx/xlsx-import-reader";
import { csvImportReader } from "#bulk-import/lib/csv-import-reader";
import { jsonImportReader } from "#bulk-import/lib/json-import-reader";
import { ImportReaders } from "#bulk-import/services/import-readers";
import { CreateImportDraftUseCase } from "#bulk-import/use-cases/create-import-draft-use-case";
import { ImportTarget } from "#bulk-import/value-objects/import-target";
import { StaffActor } from "#core/actor/staff-actor";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";
import { UserId } from "#core/value-objects/user-id";

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

describe("a draft from each real file", () => {
	const contacts = ImportTarget.make("contacts");
	const layer = Layer.mergeAll(
		inMemoryImportDraftRepository().layer,
		incrementingIdGenerator().layer,
		staticImportSchemas({
			contacts: {
				columns: [
					{ key: "prenom", headerAliases: [] },
					{ key: "nom", headerAliases: [] },
					{
						key: "email",
						headerAliases: [],
						required: true,
						unique: true,
						normalize: (value) => value.toLowerCase(),
						validate: (value) => value.includes("@"),
					},
					{ key: "telephone", headerAliases: [] },
				],
			},
		}),
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
			const draft = await Effect.runPromise(
				Effect.flatMap(
					Effect.promise(() => fixture(fileName)),
					(content) =>
						CreateImportDraftUseCase.execute({
							actor: new StaffActor({
								userId: UserId.make("00000000-0000-0000-0000-0000000000a1"),
							}),
							payload: {
								target: contacts,
								targetId: null,
								targetLabel: null,
								fileName,
								content,
							},
						}),
				).pipe(Effect.provide(layer)),
			);

			expect(draft.missingColumns).toStrictEqual([]);
			expect(draft.rows.map((row) => row.values)).toStrictEqual([
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
			expect(draft.rows.map((row) => row.issues)).toStrictEqual([
				[],
				[],
				[{ column: "email", issue: "invalidValue" }],
				[],
			]);
		});
});
