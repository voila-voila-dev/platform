import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { stubReadonlyDatabase } from "#readonly-database/adapters/memory/stub-readonly-database";
import { unavailableReadonlyDatabase } from "#readonly-database/adapters/memory/unavailable-readonly-database";
import { ReadonlyDatabaseService } from "#readonly-database/services/readonly-database-service";

describe("stubReadonlyDatabase", () => {
	it("records the queries and describes only the asked tables", async () => {
		const stub = stubReadonlyDatabase({
			result: () => ({ columns: ["id"], rows: [{ id: 1 }], truncated: false }),
			columns: [
				{ table: "users", column: "id", type: "uuid", nullable: false },
				{ table: "missions", column: "id", type: "uuid", nullable: false },
			],
		});

		const [result, columns] = await Effect.runPromise(
			ReadonlyDatabaseService.use((database) =>
				Effect.all([
					database.query("select id from users"),
					database.describeTables(["users"]),
				]),
			).pipe(Effect.provide(stub.layer)),
		);

		expect(stub.queries).toStrictEqual(["select id from users"]);
		expect(result.rows).toStrictEqual([{ id: 1 }]);
		expect(columns.map((column) => column.table)).toStrictEqual(["users"]);
	});
});

describe("unavailableReadonlyDatabase", () => {
	it("refuses every call with the message", async () => {
		const error = await Effect.runPromise(
			ReadonlyDatabaseService.use((database) =>
				database.query("select 1"),
			).pipe(
				Effect.flip,
				Effect.provide(unavailableReadonlyDatabase("not configured")),
			),
		);

		expect(error.message).toBe("not configured");
	});
});
