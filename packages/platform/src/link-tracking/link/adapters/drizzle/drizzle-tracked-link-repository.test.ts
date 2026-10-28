import { describe, expect, it } from "bun:test";
import { asc, desc, type SQL } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import {
	trackedLinkSearchCondition,
	trackedLinkSortColumn,
} from "#link-tracking/link/adapters/drizzle/drizzle-tracked-link-repository";

const dialect = new PgDialect();

function compile(condition: SQL | undefined) {
	return condition === undefined ? undefined : dialect.sqlToQuery(condition);
}

describe("trackedLinkSearchCondition", () => {
	// The expressions must read exactly like the ones the trigram indexes are
	// built on, or the planner scans the table.
	it("compares the accent-folded label and destination URL with the folded term", () => {
		const query = compile(trackedLinkSearchCondition("Vidéo"));

		expect(query?.sql).toBe(
			'((immutable_unaccent("tracked_link"."label") ILIKE $1) or (immutable_unaccent("tracked_link"."destination_url") ILIKE $2))',
		);
		expect(query?.params).toStrictEqual(["%video%", "%video%"]);
	});

	it("requires each word of the query, in any of the columns", () => {
		const query = compile(trackedLinkSearchCondition("vidéo example.com"));

		expect(query?.sql.match(/ and /gu)).toHaveLength(1);
		expect(query?.params).toStrictEqual([
			"%video%",
			"%video%",
			"%example.com%",
			"%example.com%",
		]);
	});

	it("contributes no condition for a blank search", () => {
		expect(trackedLinkSearchCondition(undefined)).toBeUndefined();
		expect(trackedLinkSearchCondition("   ")).toBeUndefined();
	});
});

describe("trackedLinkSortColumn", () => {
	it("sorts by label or by creation date, creation date by default", () => {
		expect(compile(asc(trackedLinkSortColumn("label")))?.sql).toBe(
			'"tracked_link"."label" asc',
		);
		expect(compile(desc(trackedLinkSortColumn("createdAt")))?.sql).toBe(
			'"tracked_link"."created_at" desc',
		);
		expect(compile(desc(trackedLinkSortColumn(undefined)))?.sql).toBe(
			'"tracked_link"."created_at" desc',
		);
	});
});
