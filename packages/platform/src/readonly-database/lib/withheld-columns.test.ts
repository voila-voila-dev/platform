import { describe, expect, it } from "bun:test";
import { withheldColumnRead } from "#readonly-database/lib/withheld-columns";

const withheld = { mission_report: ["data", "performer_ids"] };

function refused(sql: string): boolean {
	return withheldColumnRead(sql, withheld) !== null;
}

describe("withheldColumnRead", () => {
	it("lets the other columns through", () => {
		for (const sql of [
			"select id, status, mission_id from mission_report where status = 'submitted'",
			"select r.status, count(*) from mission_report r group by r.status",
			"select m.title, r.status from mission m join public.mission_report as r on r.mission_id = m.id",
			"select m.title from mission m, mission_report r where r.mission_id = m.id",
			"select data from mission",
			"select status from mission_report where status <> 'data'",
			"select r.amount * 2 from mission_report r",
		]) {
			expect(withheldColumnRead(sql, withheld), sql).toBeNull();
		}
	});

	it("refuses every way of reading a withheld column", () => {
		for (const sql of [
			"select data from mission_report",
			"select r.data->'actRecords' from mission_report r",
			'select "DATA" from "mission_report"',
			"select performer_ids from mission_report",
			"select * from mission_report",
			"select r.* from mission_report r",
			"select m.id, r.* from mission m join mission_report r on r.mission_id = m.id",
			"select to_jsonb(r) from mission_report r",
			"select row_to_json(x) from public.mission_report as x",
			"select r from mission_report r",
			"select m.id, r from mission m, mission_report r",
			"select to_json(mission_report) from mission_report",
			"select r::text from mission_report r",
			"select e from mission_report r(a, b, c, d, e)",
			"select x.d from (select data as d from mission_report) x",
			"with fiche as (select * from mission_report) select id from fiche",
		]) {
			expect(refused(sql), sql).toBe(true);
		}
	});

	it("does not mistake a string or a later clause for the table", () => {
		expect(
			refused("select id from mission where title = 'mission_report data'"),
		).toBe(false);
		expect(
			refused("select id from mission_report where status = 'x' limit 5"),
		).toBe(false);
	});
});
