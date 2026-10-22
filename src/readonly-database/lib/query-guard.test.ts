import { describe, expect, it } from "bun:test";
import { Effect, Result } from "effect";
import {
	guardQuery,
	MAX_QUERY_ROWS,
	type QueryPolicy,
	referencedTables,
} from "#readonly-database/lib/query-guard";

const policy: QueryPolicy = { tables: new Set(["missions", "users"]) };

function guarded(sql: string, over: QueryPolicy = policy) {
	return Effect.runSync(Effect.result(guardQuery(sql, over)));
}

function sqlOf(sql: string, over?: QueryPolicy): string | null {
	const result = guarded(sql, over);
	return Result.isSuccess(result) ? result.success : null;
}

describe("guardQuery", () => {
	it("appends a limit to a bare select", () => {
		expect(sqlOf("select id from missions")).toBe(
			`select id from missions LIMIT ${MAX_QUERY_ROWS}`,
		);
	});

	it("caps a limit above the maximum and keeps one under it", () => {
		expect(sqlOf("select 1 from missions limit 5000")).toBe(
			`select 1 from missions LIMIT ${MAX_QUERY_ROWS}`,
		);
		expect(sqlOf("select 1 from missions limit 10")).toBe(
			"select 1 from missions limit 10",
		);
	});

	it("takes the maximum from the policy", () => {
		expect(sqlOf("select 1 from missions", { ...policy, maxRows: 5 })).toBe(
			"select 1 from missions LIMIT 5",
		);
	});

	it("refuses writes, several statements and non-selects", () => {
		for (const sql of [
			"",
			"delete from missions",
			"select 1; select 2",
			"update missions set x = 1",
			"select pg_sleep(10) from missions",
			"explain select 1 from missions",
		]) {
			expect(sqlOf(sql), sql).toBeNull();
		}
	});

	it("refuses a table outside the allowlist, even joined", () => {
		const result = guarded(
			"select * from missions m join sessions s on s.id = m.id",
		);
		expect(Result.isFailure(result) && result.failure.message).toBe(
			"table(s) not in the allowlist: sessions",
		);
	});

	it("refuses a withheld column", () => {
		expect(
			sqlOf("select data from missions", {
				...policy,
				withheldColumns: { missions: ["data"] },
			}),
		).toBeNull();
	});

	it("does not mistake a CTE for a table", () => {
		const sql = "with recent as (select * from missions) select * from recent";
		expect(referencedTables(sql)).toEqual(["missions"]);
		expect(sqlOf(sql)).not.toBeNull();
	});

	it("ignores comments when deciding", () => {
		expect(sqlOf("-- delete from users\nselect 1 from users")).not.toBeNull();
	});
});
