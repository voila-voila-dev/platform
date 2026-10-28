import { describe, expect, it } from "bun:test";
import { toJsonValue } from "#readonly-database/adapters/pg/to-json-value";

describe("toJsonValue", () => {
	it("turns what pg hands back into JSON values", () => {
		const at = new Date("2026-09-07T20:00:00.000Z");
		expect(
			toJsonValue({
				created_at: at,
				count: 12n,
				tags: [at, null],
				payload: { nested: at, missing: undefined },
				bytes: new Uint8Array(3),
				text: "ok",
			}),
		).toEqual({
			created_at: "2026-09-07T20:00:00.000Z",
			count: "12",
			tags: ["2026-09-07T20:00:00.000Z", null],
			payload: { nested: "2026-09-07T20:00:00.000Z", missing: null },
			bytes: "<3 bytes>",
			text: "ok",
		});
	});

	it("turns the numbers JSON has no room for into their words", () => {
		expect(
			toJsonValue({
				measure: Number.NaN,
				since: Number.POSITIVE_INFINITY,
				until: new Date(Number.NaN),
			}),
		).toEqual({
			measure: "NaN",
			since: "Infinity",
			until: "Invalid Date",
		});
	});

	it("leaves plain JSON alone", () => {
		expect(toJsonValue({ a: 1, b: "x", c: null, d: [true] })).toEqual({
			a: 1,
			b: "x",
			c: null,
			d: [true],
		});
	});
});
