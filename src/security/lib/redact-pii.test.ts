import { describe, expect, it } from "bun:test";
import { redactPii } from "#security/lib/redact-pii";

describe("redactPii", () => {
	it("masks an email and a French phone number, spaced or not", () => {
		expect(
			redactPii(
				"jeanne.dupont@example.com, 06 12 34 56 78, 0612345678, +33 6 12 34 56 78",
			),
		).toBe("«email», «phone», «phone», «phone»");
	});

	it("masks an international phone number", () => {
		expect(redactPii("call +44 7911 123456 or 0033612345678")).toBe(
			"call «phone» or «id»",
		);
	});

	it("masks a whole social security or card number, spaced or not", () => {
		expect(
			redactPii(
				"NIR 185057800608436, NIR 1 85 05 78 006 084 36, card 4970101234567890, card 4970 1012 3456 7890",
			),
		).toBe("NIR «id», NIR «id», card «id», card «id»");
	});

	it("masks an RPPS number", () => {
		expect(redactPii("RPPS 10101234567")).toBe("RPPS «id»");
	});

	it("keeps a uuid, a date and a duration", () => {
		expect(
			redactPii(
				"mission 0199a1b2-7c3e-7a10-9f00-1234567890ab on 2026-10-11 took 1250 ms",
			),
		).toBe(
			"mission 0199a1b2-7c3e-7a10-9f00-1234567890ab on 2026-10-11 took 1250 ms",
		);
	});
});
