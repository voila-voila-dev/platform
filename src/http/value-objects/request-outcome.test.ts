import { describe, expect, it } from "bun:test";
import { requestOutcome } from "#http/value-objects/request-outcome";

describe("requestOutcome", () => {
	it.each([
		[200, "succeeded"],
		[204, "succeeded"],
		[302, "succeeded"],
		[400, "rejected"],
		[404, "rejected"],
		[422, "rejected"],
		[401, "failed"],
		[403, "failed"],
		[408, "failed"],
		[429, "failed"],
		[500, "failed"],
		[503, "failed"],
		[null, "failed"],
	] as const)("classifies %p as %s", (status, outcome) => {
		expect(requestOutcome(status)).toBe(outcome);
	});
});
