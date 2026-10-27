import { describe, expect, it } from "bun:test";
import { isTimestampWithinTolerance } from "#http/webhooks/lib/timestamp-tolerance";

const nowSeconds = 1_800_000_000;

describe("isTimestampWithinTolerance", () => {
	it("takes a timestamp up to five minutes either side of now", () => {
		expect(
			isTimestampWithinTolerance({
				timestamp: String(nowSeconds - 300),
				nowSeconds,
			}),
		).toBe(true);
		expect(
			isTimestampWithinTolerance({
				timestamp: String(nowSeconds + 301),
				nowSeconds,
			}),
		).toBe(false);
	});

	it("honours a wider window", () => {
		expect(
			isTimestampWithinTolerance({
				timestamp: String(nowSeconds - 4000),
				nowSeconds,
				toleranceSeconds: 5000,
			}),
		).toBe(true);
	});

	it.each(["", " ", "soon", "NaN"])("refuses the timestamp %p", (timestamp) => {
		expect(isTimestampWithinTolerance({ timestamp, nowSeconds })).toBe(false);
	});
});
