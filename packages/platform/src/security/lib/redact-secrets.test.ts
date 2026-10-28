import { describe, expect, it } from "bun:test";
import { redactSecrets } from "#security/lib/redact-secrets";

describe("redactSecrets", () => {
	it("masks every occurrence of every secret", () => {
		expect(
			redactSecrets("key=abc123 again abc123, token=xyz", ["abc123", "xyz"]),
		).toBe("key=[redacted] again [redacted], token=[redacted]");
	});

	it("ignores an empty secret", () => {
		expect(redactSecrets("nothing to hide", [""])).toBe("nothing to hide");
	});
});
