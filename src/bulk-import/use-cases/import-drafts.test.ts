import { describe, expect, it } from "bun:test";
import { Effect, Exit, Layer } from "effect";
import { inMemoryImportDraftRepository } from "#bulk-import/adapters/memory/in-memory-import-draft-repository";
import { staticImportSchemas } from "#bulk-import/adapters/memory/static-import-schemas";
import { importNextBatch } from "#bulk-import/lib/import-next-batch";
import { ImportLimits } from "#bulk-import/services/import-limits";
import { CreateImportDraftUseCase } from "#bulk-import/use-cases/create-import-draft-use-case";
import { DiscardImportDraftUseCase } from "#bulk-import/use-cases/discard-import-draft-use-case";
import { PurgeExpiredImportDraftsUseCase } from "#bulk-import/use-cases/purge-expired-import-drafts-use-case";
import { UpdateImportDraftCellUseCase } from "#bulk-import/use-cases/update-import-draft-cell-use-case";
import { ImportFormat } from "#bulk-import/value-objects/import-format";
import { ImportTarget } from "#bulk-import/value-objects/import-target";
import { StaffActor } from "#core/actor/staff-actor";
import { SystemActor } from "#core/actor/system-actor";
import { incrementingIdGenerator } from "#core/adapters/memory/incrementing-id-generator";
import { UserId } from "#core/value-objects/user-id";

const actor = new StaffActor({
	userId: UserId.make("00000000-0000-0000-0000-0000000000a1"),
});

const contacts = ImportTarget.make("contacts");

const schemas = staticImportSchemas({
	contacts: {
		columns: [
			{ key: "name", headerAliases: ["nom"] },
			{
				key: "email",
				headerAliases: ["e-mail"],
				required: true,
				unique: true,
				normalize: (value) => value.toLowerCase(),
				validate: (value) => value.includes("@"),
			},
		],
	},
});

function harness() {
	const drafts = inMemoryImportDraftRepository();
	return {
		drafts,
		layer: Layer.mergeAll(
			drafts.layer,
			schemas,
			incrementingIdGenerator().layer,
		),
	};
}

function upload(
	fileName: string,
	text: string,
	options: { readonly target?: ImportTarget; readonly format?: string } = {},
) {
	return CreateImportDraftUseCase.execute({
		actor,
		payload: {
			target: options.target ?? contacts,
			targetId: null,
			targetLabel: null,
			fileName,
			...(options.format === undefined
				? {}
				: { format: ImportFormat.make(options.format) }),
			content: new TextEncoder().encode(text),
		},
	});
}

describe("CreateImportDraftUseCase", () => {
	it("reads a CSV into a draft whose problems wait for review", async () => {
		const { layer } = harness();
		const draft = await Effect.runPromise(
			upload(
				"contacts.csv",
				"Nom;E-mail\nMarie;M@X.FR\nPaul;pas-une-adresse\nJeanne;m@x.fr",
			).pipe(Effect.provide(layer)),
		);

		expect(draft.format).toBe(ImportFormat.make("csv"));
		expect(draft.createdByUserId).toBe(actor.userId);
		expect(draft.rows.map((row) => row.values.email)).toStrictEqual([
			"m@x.fr",
			"pas-une-adresse",
			"m@x.fr",
		]);
		expect(draft.validRows.map((row) => row.index)).toStrictEqual([0]);
		expect(draft.rows[2]?.issues).toStrictEqual([
			{ column: "email", issue: "duplicate" },
		]);
	});

	it("reads JSON the same way, keys matching columns", async () => {
		const { layer } = harness();
		const draft = await Effect.runPromise(
			upload(
				"contacts.json",
				JSON.stringify([{ email: "a@x.fr", name: "Ana" }]),
			).pipe(Effect.provide(layer)),
		);

		expect(draft.rows[0]?.values).toStrictEqual({
			name: "Ana",
			email: "a@x.fr",
		});
	});

	it("refuses a format nobody reads, a file too large, an unknown target", async () => {
		const { layer } = harness();
		const failures = await Effect.runPromise(
			Effect.all([
				upload("contacts.xlsx", "x").pipe(Effect.flip),
				upload("contacts.csv", "email\na@x.fr").pipe(
					Effect.provideService(ImportLimits, {
						maxBytes: 4,
						maxRows: 10,
						batchSize: 10,
						draftLifetimeDays: 1,
					}),
					Effect.flip,
				),
				upload("contacts.csv", "", {}).pipe(Effect.flip),
				upload("x.csv", "email\na@x.fr", {
					target: ImportTarget.make("products"),
				}).pipe(Effect.flip),
			]).pipe(Effect.provide(layer)),
		);

		expect(
			failures.map((failure) =>
				"reason" in failure ? failure.reason : failure._tag,
			),
		).toStrictEqual([
			"unsupportedFormat",
			"tooLarge",
			"empty",
			"ImportTargetNotFoundError",
		]);
	});
});

function recordingImport(imported: Array<string>) {
	return (rows: ReadonlyArray<{ readonly values: object }>) =>
		Effect.sync(() => {
			imported.push(...rows.map((row) => JSON.stringify(row.values)));
			return { created: rows.length, updated: 0, invalid: 0 };
		});
}

describe("a draft's review and import", () => {
	it("revalidates on each edit, then imports the valid rows batch by batch", async () => {
		const { drafts, layer } = harness();
		const imported: Array<string> = [];
		const importRows = recordingImport(imported);

		const result = await Effect.runPromise(
			Effect.gen(function* () {
				const draft = yield* upload(
					"contacts.csv",
					"email\na@x.fr\ncassé\nc@x.fr",
				);
				const { draft: fixed } = yield* UpdateImportDraftCellUseCase.execute({
					actor,
					payload: {
						id: draft.id,
						rowIndex: 1,
						column: "email",
						value: "b@x.fr",
					},
				});
				expect(fixed.validRows).toHaveLength(3);

				const first = yield* importNextBatch(draft.id, importRows);
				const second = yield* importNextBatch(draft.id, importRows);
				const again = yield* importNextBatch(draft.id, importRows).pipe(
					Effect.flip,
				);
				return { first, second, again };
			}).pipe(
				Effect.provide(layer),
				Effect.provideService(ImportLimits, {
					maxBytes: 1024,
					maxRows: 10,
					batchSize: 2,
					draftLifetimeDays: 7,
				}),
			),
		);

		expect(result.first.draft.status).toBe("importing");
		expect(result.second.draft.status).toBe("imported");
		expect(result.second.draft.outcome.created).toBe(3);
		expect(result.again._tag).toBe("ImportDraftAlreadyImportedError");
		expect(imported).toHaveLength(3);
		expect(drafts.values()).toHaveLength(1);
	});

	it("is discarded on demand and purged once expired", async () => {
		const { drafts, layer } = harness();
		await Effect.runPromise(
			Effect.gen(function* () {
				const kept = yield* upload("a.csv", "email\na@x.fr");
				const discarded = yield* upload("b.csv", "email\nb@x.fr");
				yield* DiscardImportDraftUseCase.execute({
					actor,
					payload: { id: discarded.id },
				});
				expect(drafts.values().map((draft) => draft.id)).toStrictEqual([
					kept.id,
				]);

				const purged = yield* PurgeExpiredImportDraftsUseCase.execute({
					actor: new SystemActor(),
				});
				expect(purged.drafts).toBe(0);
			}).pipe(Effect.provide(layer)),
		);

		const exit = await Effect.runPromiseExit(
			PurgeExpiredImportDraftsUseCase.execute({ actor }).pipe(
				Effect.provide(layer),
			),
		);
		expect(Exit.isFailure(exit)).toBe(true);
	});
});
