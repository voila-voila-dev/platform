import { describe, expect, it } from "bun:test";
import { describeFailure } from "#readonly-database/adapters/pg/pg-readonly-database";

describe("describeFailure", () => {
	it("keeps the fields that help fix a statement, never the client", () => {
		const error = Object.assign(new Error("syntax error"), {
			code: "42601",
			position: "5",
			hint: "",
			client: { password: "secret" },
		});

		expect(describeFailure(error)).toBe("syntax error code=42601 position=5");
	});

	it("reads a non-error as text", () => {
		expect(describeFailure("timeout")).toBe("timeout");
	});
});
