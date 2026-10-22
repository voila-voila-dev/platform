import { describe, expect, it } from "bun:test";
import {
	isPiiColumn,
	MASKED_VALUE,
	maskRows,
} from "#readonly-database/lib/pii-columns";

describe("pii columns", () => {
	it("classifies contact and identity columns", () => {
		for (const column of [
			"email",
			"phone_number",
			"iban",
			"address_line1",
			"first_name",
			"billing_address",
		]) {
			expect(isPiiColumn(column), column).toBe(true);
		}
		for (const column of [
			"id",
			"status",
			"created_at",
			"amount_cents",
			"title",
		]) {
			expect(isPiiColumn(column), column).toBe(false);
		}
	});

	it("masks values but keeps nulls", () => {
		const { rows, masked } = maskRows(
			["id", "email"],
			[
				{ id: 1, email: "a@b.c" },
				{ id: 2, email: null },
			],
		);
		expect(masked).toEqual(["email"]);
		expect(rows).toEqual([
			{ id: 1, email: MASKED_VALUE },
			{ id: 2, email: null },
		]);
	});
});

describe("maskRows options", () => {
	it("takes the classifier and the masked value from the caller", () => {
		const { rows, masked } = maskRows(
			["id", "nickname"],
			[{ id: 1, nickname: "Bob" }],
			{ isPii: (column) => column === "nickname", maskedValue: "[masqué]" },
		);
		expect(masked).toEqual(["nickname"]);
		expect(rows).toEqual([{ id: 1, nickname: "[masqué]" }]);
	});
});
