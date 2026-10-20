import { describe, expect, it } from "bun:test";
import { Effect, Schema, SchemaTransformation } from "effect";
import { inMemoryBulkImport } from "#bulk-import/adapters/memory/in-memory-bulk-import";
import { ImportIntent } from "#bulk-import/aggregates/import-intent";
import {
	BulkImport as Bulk,
	type BulkImport,
} from "#bulk-import/lib/bulk-import";
import { csvImportReader } from "#bulk-import/lib/csv-import-reader";
import { ImportSchema } from "#bulk-import/lib/import-schema";
import { ImportIntentRepository } from "#bulk-import/services/import-intent-repository";
import { ImportFormat } from "#bulk-import/value-objects/import-format";
import type { ImportRowResult } from "#bulk-import/value-objects/import-row-result";

const Email = Schema.String.pipe(
	Schema.decode(SchemaTransformation.toLowerCase()),
).check(Schema.isIncluding("@"));

const columns = {
	name: { schema: Schema.String, label: "Nom" },
	email: {
		schema: Email,
		label: "E-mail",
		required: true,
		unique: true,
		message: "Une adresse e-mail",
	},
} as const;

const contactsSchema = ImportSchema.make({ target: "contacts", columns });
const contactsImport = Bulk.make(contactsSchema, { limits: { batchSize: 2 } });
const productsImport = Bulk.make(
	ImportSchema.make({ target: "products", columns }),
);

type ContactsImport = BulkImport<typeof contactsSchema>;

function upload(fileName: string, text: string, format?: string) {
	return contactsImport.create({
		fileName,
		...(format === undefined ? {} : { format: ImportFormat.make(format) }),
		content: new TextEncoder().encode(text),
	});
}

function createAll(
	batch: Parameters<Parameters<ContactsImport["importNextBatch"]>[1]>[0],
) {
	return Effect.succeed(batch.map((): ImportRowResult => "created"));
}

describe("BulkImport.create", () => {
	it("reads a CSV into an intent whose problems wait for review", async () => {
		const { layer } = inMemoryBulkImport();
		const intent = await Effect.runPromise(
			upload(
				"contacts.csv",
				"Nom;E-mail\nMarie;M@X.FR\nPaul;pas-une-adresse\nJeanne;m@x.fr",
			).pipe(Effect.provide(layer)),
		);

		expect(intent.target).toBe("contacts");
		expect(intent.rows.map((row) => row.values.email)).toStrictEqual([
			"m@x.fr",
			"pas-une-adresse",
			"m@x.fr",
		]);
		expect(intent.rows[1]?.issues).toStrictEqual([
			{ column: "email", issue: "invalidValue", message: "Une adresse e-mail" },
		]);
		expect(intent.rows[2]?.issues).toStrictEqual([
			{ column: "email", issue: "duplicate" },
		]);
	});

	it("reads JSON the same way, keys matching columns", async () => {
		const { layer } = inMemoryBulkImport();
		const intent = await Effect.runPromise(
			upload(
				"contacts.json",
				JSON.stringify([{ email: "a@x.fr", name: "Ana" }]),
			).pipe(Effect.provide(layer)),
		);

		expect(intent.rows[0]?.values).toStrictEqual({
			name: "Ana",
			email: "a@x.fr",
		});
	});

	it("refuses what it cannot import", async () => {
		const { layer } = inMemoryBulkImport();
		const tiny = Bulk.make(contactsSchema, { limits: { maxBytes: 4 } });
		const csvOnly = Bulk.make(contactsSchema, { readers: [csvImportReader] });
		function content(text: string) {
			return new TextEncoder().encode(text);
		}
		const failures = await Effect.runPromise(
			Effect.all([
				upload("contacts.xlsx", "x").pipe(Effect.flip),
				tiny
					.create({ fileName: "a.csv", content: content("email\na@x.fr") })
					.pipe(Effect.flip),
				csvOnly
					.create({ fileName: "a.json", content: content("[]") })
					.pipe(Effect.flip),
				upload("contacts.csv", "").pipe(Effect.flip),
				upload("contacts.csv", "nom\nMarie").pipe(Effect.flip),
			]).pipe(Effect.provide(layer)),
		);

		expect(
			failures.map((failure) =>
				"reason" in failure ? failure.reason : failure._tag,
			),
		).toStrictEqual([
			"unsupportedFormat",
			"tooLarge",
			"unsupportedFormat",
			"empty",
			"ImportColumnsMissingError",
		]);
	});

	it("checks a row across its columns once its cells are valid", async () => {
		const { layer } = inMemoryBulkImport();
		const pairs = Bulk.make({
			target: "pairs",
			columns: {
				name: { schema: Schema.String },
				email: { schema: Email },
				phone: { schema: Schema.String },
			},
			check: (record) =>
				record.email === undefined && record.phone === undefined
					? [
							{
								column: "email",
								issue: "required",
								message: "Ou un téléphone",
							},
						]
					: [],
		});
		const intent = await Effect.runPromise(
			pairs
				.create({
					fileName: "pairs.csv",
					content: new TextEncoder().encode(
						"name,email,phone\nAna,a@x.fr,\nPaul,,\nZoé,,0612",
					),
				})
				.pipe(Effect.provide(layer)),
		);

		expect(intent.rows.map((row) => row.issues)).toStrictEqual([
			[],
			[{ column: "email", issue: "required", message: "Ou un téléphone" }],
			[],
		]);
	});
});

describe("BulkImport.template", () => {
	it("writes the labels a file is read back by", async () => {
		const { layer } = inMemoryBulkImport();
		const template = contactsImport.template();
		expect(template).toBe("﻿Nom,E-mail\n");

		const intent = await Effect.runPromise(
			upload("contacts.csv", `${template}Ana,a@x.fr`).pipe(
				Effect.provide(layer),
			),
		);
		expect(intent.rows[0]?.values).toStrictEqual({
			name: "Ana",
			email: "a@x.fr",
		});
	});
});

describe("an intent's review and import", () => {
	it("revalidates on each edit, then imports typed records batch by batch", async () => {
		const { layer } = inMemoryBulkImport();
		const imported: Array<unknown> = [];

		const result = await Effect.runPromise(
			Effect.gen(function* () {
				const intent = yield* upload(
					"contacts.csv",
					"nom,email\nAna,a@x.fr\n,cassé\nCarl,c@x.fr",
				);
				const fixed = yield* contactsImport.editCell(intent.id, {
					rowIndex: 1,
					column: "email",
					value: " B@X.FR ",
				});
				expect(fixed.rows[1]?.values.email).toBe("b@x.fr");

				function importBatch(
					batch: Parameters<typeof createAll>[0],
				): ReturnType<typeof createAll> {
					imported.push(...batch);
					return Effect.succeed(
						batch.map(
							(entry): ImportRowResult =>
								entry.record.name === "Carl"
									? { rejected: "déjà là" }
									: "created",
						),
					);
				}
				const first = yield* contactsImport.importNextBatch(
					intent.id,
					importBatch,
				);
				const second = yield* contactsImport.importNextBatch(
					intent.id,
					importBatch,
				);
				const again = yield* contactsImport
					.importNextBatch(intent.id, importBatch)
					.pipe(Effect.flip);
				return { first, second, again };
			}).pipe(Effect.provide(layer)),
		);

		expect(result.first.status).toBe("importing");
		expect(result.second.status).toBe("imported");
		expect(ImportIntent.summary(result.second)).toStrictEqual({
			rows: 3,
			invalid: 0,
			created: 2,
			updated: 0,
			rejected: 1,
			remaining: 0,
		});
		expect(result.second.rows[2]?.result).toStrictEqual({
			rejected: "déjà là",
		});
		expect(result.again._tag).toBe("ImportIntentStatusError");
		expect(imported).toStrictEqual([
			{ index: 0, record: { name: "Ana", email: "a@x.fr" } },
			{ index: 1, record: { email: "b@x.fr" } },
			{ index: 2, record: { name: "Carl", email: "c@x.fr" } },
		]);
	});

	it("imports everything in one go for a background job", async () => {
		const { layer } = inMemoryBulkImport();
		const intent = await Effect.runPromise(
			Effect.gen(function* () {
				const created = yield* upload(
					"contacts.csv",
					"email\na@x.fr\nb@x.fr\nc@x.fr\nd@x.fr\ne@x.fr",
				);
				return yield* contactsImport.importAll(created.id, createAll);
			}).pipe(Effect.provide(layer)),
		);

		expect(intent.status).toBe("imported");
		expect(ImportIntent.summary(intent).created).toBe(5);
	});

	it("lets one import at a time hold a batch, until its lease runs out", async () => {
		const { intents, layer } = inMemoryBulkImport();
		const result = await Effect.runPromise(
			Effect.gen(function* () {
				const intent = yield* upload("contacts.csv", "email\na@x.fr\nb@x.fr");
				const concurrent = yield* contactsImport
					.importNextBatch(intent.id, (batch) =>
						Effect.andThen(
							Effect.flip(contactsImport.importNextBatch(intent.id, createAll)),
							(failure) => {
								expect(failure._tag).toBe("ImportIntentConflictError");
								return createAll(batch);
							},
						),
					)
					.pipe(Effect.map((done) => done.status));

				const abandoned = yield* upload("again.csv", "email\na@x.fr");
				const [stored] = intents
					.values()
					.filter((candidate) => candidate.id === abandoned.id);
				if (stored !== undefined)
					intents.seed([{ ...stored, status: "importing", leasedUntil: 1 }]);
				const resumed = yield* contactsImport.importNextBatch(
					abandoned.id,
					createAll,
				);
				return { concurrent, resumed: resumed.status };
			}).pipe(Effect.provide(layer)),
		);

		expect(result).toStrictEqual({
			concurrent: "imported",
			resumed: "imported",
		});
	});

	it("refuses to overwrite an intent changed since it was read", async () => {
		const { layer } = inMemoryBulkImport();
		const failure = await Effect.runPromise(
			Effect.gen(function* () {
				const intent = yield* upload("contacts.csv", "email\na@x.fr");
				yield* contactsImport.editCell(intent.id, {
					rowIndex: 0,
					column: "email",
					value: "b@x.fr",
				});
				const repository = yield* ImportIntentRepository;
				return yield* repository
					.update({ ...intent, version: 1 }, intent.version)
					.pipe(Effect.flip);
			}).pipe(Effect.provide(layer)),
		);

		expect(failure._tag).toBe("ImportIntentConflictError");
	});

	it("refuses an edit outside the schema's columns or the intent's rows", async () => {
		const { layer } = inMemoryBulkImport();
		const failures = await Effect.runPromise(
			Effect.gen(function* () {
				const intent = yield* upload("contacts.csv", "email\na@x.fr");
				const edits = [
					{ rowIndex: 0, column: "age" as "email" },
					{ rowIndex: 5, column: "email" as const },
				];
				return yield* Effect.all(
					edits.map((cell) =>
						contactsImport
							.editCell(intent.id, { ...cell, value: "x" })
							.pipe(Effect.flip),
					),
				);
			}).pipe(Effect.provide(layer)),
		);

		expect(failures.map((failure) => failure._tag)).toStrictEqual([
			"ImportIntentCellNotFoundError",
			"ImportIntentCellNotFoundError",
		]);
	});

	it("finds no intent of another target", async () => {
		const { layer } = inMemoryBulkImport();
		const failure = await Effect.runPromise(
			Effect.gen(function* () {
				const intent = yield* upload("contacts.csv", "email\na@x.fr");
				return yield* productsImport.get(intent.id).pipe(Effect.flip);
			}).pipe(Effect.provide(layer)),
		);

		expect(failure._tag).toBe("ImportIntentNotFoundError");
	});

	it("refuses an intent its schema's columns no longer describe", async () => {
		const { layer } = inMemoryBulkImport();
		const withPhone = Bulk.make(
			ImportSchema.make({
				target: "contacts",
				columns: { ...columns, phone: { schema: Schema.String } },
			}),
		);
		const failure = await Effect.runPromise(
			Effect.gen(function* () {
				const intent = yield* upload("contacts.csv", "email\na@x.fr");
				return yield* withPhone.get(intent.id).pipe(Effect.flip);
			}).pipe(Effect.provide(layer)),
		);

		expect(failure._tag).toBe("SchemaError");
	});

	it("is discarded on demand", async () => {
		const { intents, layer } = inMemoryBulkImport();
		await Effect.runPromise(
			Effect.gen(function* () {
				const kept = yield* upload("a.csv", "email\na@x.fr");
				const discarded = yield* upload("b.csv", "email\nb@x.fr");
				yield* contactsImport.discard(discarded.id);
				expect(intents.values().map((intent) => intent.id)).toStrictEqual([
					kept.id,
				]);
			}).pipe(Effect.provide(layer)),
		);
	});

	it("encodes an intent and decodes payloads for the importing domain's endpoints", async () => {
		const { layer } = inMemoryBulkImport();
		const intent = await Effect.runPromise(
			upload("contacts.csv", "email\na@x.fr").pipe(Effect.provide(layer)),
		);
		const encoded = Schema.encodeSync(contactsImport.Intent)(intent);

		expect(
			Schema.decodeUnknownSync(contactsImport.Intent)(encoded),
		).toStrictEqual(intent);
		expect(() =>
			Schema.decodeUnknownSync(productsImport.Intent)(encoded),
		).toThrow();
		expect(() =>
			Schema.decodeUnknownSync(contactsImport.EditCellPayload)({
				rowIndex: 0,
				column: "age",
				value: "x",
			}),
		).toThrow();
		expect(
			Schema.decodeUnknownSync(
				Schema.Struct({
					...contactsImport.CreatePayload.fields,
					segmentId: Schema.String,
				}),
			)({ fileName: "a.csv", content: "ZW1haWw=", segmentId: "s" }).content,
		).toStrictEqual(new TextEncoder().encode("email"));
	});
});
