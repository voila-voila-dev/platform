import { describe, expect, it } from "bun:test";
import { MASKED_VALUE, maskRows } from "#readonly-database/lib/mask-rows";

const rows = [
	{ id: 1, email: "a@b.c", nickname: "Bob" },
	{ id: 2, email: null, nickname: "Ann" },
];

describe("maskRows", () => {
	it("masks the columns the pattern matches but keeps nulls", () => {
		const masked = maskRows(["id", "email", "nickname"], rows, {
			piiColumns: /(^|_)email(_|$)/u,
		});

		expect(masked).toStrictEqual({
			masked: ["email"],
			rows: [
				{ id: 1, email: MASKED_VALUE, nickname: "Bob" },
				{ id: 2, email: null, nickname: "Ann" },
			],
		});
	});

	it("gives a global pattern the same answer on every column", () => {
		const masked = maskRows(["email", "email"], [], { piiColumns: /email/gu });

		expect(masked.masked).toStrictEqual(["email", "email"]);
	});

	it("takes a predicate and the masked value from the caller", () => {
		const masked = maskRows(["id", "nickname"], rows, {
			piiColumns: (column) => column === "nickname",
			maskedValue: "[masqué]",
		});

		expect(masked.masked).toStrictEqual(["nickname"]);
		expect(masked.rows.map((row) => row.nickname)).toStrictEqual([
			"[masqué]",
			"[masqué]",
		]);
	});

	it("leaves the rows alone when no column is personal data", () => {
		const masked = maskRows(["id"], rows, { piiColumns: /email/u });

		expect(masked.rows).toBe(rows);
		expect(masked.masked).toStrictEqual([]);
	});
});
