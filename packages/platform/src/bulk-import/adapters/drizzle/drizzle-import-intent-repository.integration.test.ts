import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";
import { Effect, Layer, Option } from "effect";
import { drizzleImportIntentRepository } from "#bulk-import/adapters/drizzle/drizzle-import-intent-repository";
import type { ImportIntent } from "#bulk-import/aggregates/import-intent";
import { ImportIntentRepository } from "#bulk-import/services/import-intent-repository";
import { ImportIntentId } from "#bulk-import/value-objects/import-intent-id";
import { DrizzleDatabase } from "#core/adapters/drizzle/drizzle-database";

const url = process.env.DATABASE_URL;

describe.skipIf(url === undefined)("drizzleImportIntentRepository", () => {
	const client = new SQL(url ?? "");
	const layer = drizzleImportIntentRepository.pipe(
		Layer.provide(Layer.succeed(DrizzleDatabase, drizzle({ client }))),
	);

	function run<A, E>(
		use: (repository: ImportIntentRepository["Service"]) => Effect.Effect<A, E>,
	) {
		return Effect.runPromise(
			Effect.exit(
				Effect.flatMap(ImportIntentRepository, use).pipe(Effect.provide(layer)),
			),
		);
	}

	function intent(): ImportIntent {
		return {
			id: ImportIntentId.make(crypto.randomUUID()),
			target: "contacts",
			version: 0,
			status: "reviewing",
			leasedUntil: null,
			rows: [
				{
					index: 0,
					values: { name: "Zoé", email: "zoe@x.fr" },
					issues: [],
				},
				{
					index: 1,
					values: { name: "Paul", email: "" },
					issues: [
						{ column: "email", issue: "required", message: "Une adresse" },
					],
				},
			],
		};
	}

	beforeAll(async () => {
		await client`create table if not exists import_intent (id uuid primary key, version integer not null, data jsonb not null)`;
	});

	afterAll(() => client.close());

	it("reads back the intent it inserted", async () => {
		const inserted = intent();

		const found = await run((repository) =>
			Effect.andThen(repository.insert(inserted), repository.get(inserted.id)),
		);

		expect(found._tag).toBe("Success");
		if (found._tag === "Success")
			expect(found.value).toStrictEqual(Option.some(inserted));
	});

	it("updates the intent at the version it was read", async () => {
		const inserted = intent();
		const imported: ImportIntent = {
			...inserted,
			version: 1,
			status: "importing",
			leasedUntil: 1_700_000_000_000,
			rows: inserted.rows.map((row) =>
				row.index === 0 ? { ...row, result: { rejected: "doublon" } } : row,
			),
		};

		const found = await run((repository) =>
			Effect.gen(function* () {
				yield* repository.insert(inserted);
				yield* repository.update(imported, 0);
				return yield* repository.get(inserted.id);
			}),
		);

		expect(found._tag).toBe("Success");
		if (found._tag === "Success")
			expect(found.value).toStrictEqual(Option.some(imported));
	});

	it("refuses an update from a stale version", async () => {
		const inserted = intent();

		const result = await run((repository) =>
			Effect.gen(function* () {
				yield* repository.insert(inserted);
				yield* repository.update({ ...inserted, version: 1 }, 0);
				yield* repository.update({ ...inserted, version: 1 }, 0);
			}),
		);

		expect(result._tag).toBe("Failure");
		expect(JSON.stringify(result)).toContain("ImportIntentConflictError");
	});

	it("forgets a deleted intent", async () => {
		const inserted = intent();

		const found = await run((repository) =>
			Effect.gen(function* () {
				yield* repository.insert(inserted);
				yield* repository.delete(inserted.id);
				return yield* repository.get(inserted.id);
			}),
		);

		expect(found._tag).toBe("Success");
		if (found._tag === "Success")
			expect(found.value).toStrictEqual(Option.none());
	});
});
