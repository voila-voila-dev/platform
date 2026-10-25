import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { SQL } from "bun";
import { Effect, Fiber } from "effect";
import { pgReadonlyDatabase } from "#readonly-database/adapters/pg/pg-readonly-database";
import { ReadonlyDatabase } from "#readonly-database/services/readonly-database";

const url = process.env.DATABASE_URL;
const table = `readonly_database_test_${crypto.randomUUID().replaceAll("-", "")}`;

describe.skipIf(url === undefined)("pgReadonlyDatabase", () => {
	const admin = new SQL(url ?? "");

	beforeAll(async () => {
		await admin.unsafe(
			`CREATE TABLE ${table} (id integer NOT NULL, label text, created_at timestamptz)`,
		);
		await admin.unsafe(
			`INSERT INTO ${table} VALUES (1, 'a', '2026-10-23T08:00:00Z'), (2, 'b', null)`,
		);
	});

	afterAll(async () => {
		await admin.unsafe(`DROP TABLE ${table}`);
		await admin.close();
	});

	function run<A, E>(
		effect: Effect.Effect<A, E, ReadonlyDatabase>,
		options?: Parameters<typeof pgReadonlyDatabase>[1],
	) {
		return Effect.runPromise(
			effect.pipe(
				Effect.provide(
					pgReadonlyDatabase({ connectionString: url ?? "" }, options),
				),
			),
		);
	}

	it("answers rows as JSON, columns kept on an empty result", async () => {
		const [rows, empty] = await run(
			ReadonlyDatabase.use((database) =>
				Effect.all([
					database.query(`SELECT * FROM ${table} ORDER BY id`),
					database.query(`SELECT id, label FROM ${table} WHERE false`),
				]),
			),
		);

		expect(rows).toStrictEqual({
			columns: ["id", "label", "created_at"],
			rows: [
				{ id: 1, label: "a", created_at: "2026-10-23T08:00:00.000Z" },
				{ id: 2, label: "b", created_at: null },
			],
			truncated: false,
		});
		expect(empty.columns).toStrictEqual(["id", "label"]);
	});

	it("cuts a result past the byte cap", async () => {
		const result = await run(
			ReadonlyDatabase.use((database) =>
				database.query(`SELECT * FROM ${table} ORDER BY id`),
			),
			{ maxResultBytes: 60 },
		);

		expect(result.rows).toHaveLength(1);
		expect(result.truncated).toBe(true);
	});

	it("cannot write, and stops a slow statement", async () => {
		const [write, slow] = await run(
			ReadonlyDatabase.use((database) =>
				Effect.all([
					Effect.flip(database.query(`DELETE FROM ${table}`)),
					Effect.flip(database.query("SELECT pg_sleep(1)")),
				]),
			),
			{ statementTimeoutMillis: 100 },
		);

		expect(write.message).toContain("read-only transaction");
		expect(slow.message).toContain("statement timeout");
	});

	it("survives its idle connection being cut", async () => {
		const applicationName = `readonly-test-${crypto.randomUUID()}`;
		const rows = await Effect.runPromise(
			ReadonlyDatabase.use((database) =>
				Effect.gen(function* () {
					yield* database.query("SELECT 1");
					yield* Effect.promise(() =>
						admin.unsafe(
							"SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE application_name = $1",
							[applicationName],
						),
					);
					yield* Effect.sleep("200 millis");
					return (yield* database.query("SELECT 1 AS one")).rows;
				}),
			).pipe(
				Effect.provide(
					pgReadonlyDatabase({
						connectionString: url ?? "",
						application_name: applicationName,
					}),
				),
			),
		);

		expect(rows).toStrictEqual([{ one: 1 }]);
	});

	it("describes the asked tables", async () => {
		const columns = await run(
			ReadonlyDatabase.use((database) => database.describeTables([table])),
		);

		expect(columns).toStrictEqual([
			{ table, column: "id", type: "integer", nullable: false },
			{ table, column: "label", type: "text", nullable: true },
			{
				table,
				column: "created_at",
				type: "timestamp with time zone",
				nullable: true,
			},
		]);
	});
});
