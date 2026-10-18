import { describe, expect, it } from "bun:test";
import { exportProblems } from "./export-rules.ts";

function entry(source: string) {
	return {
		"@voila.dev/source": `./src/${source}`,
		types: `./dist/${source.replace(/\.ts$/, ".d.ts")}`,
		default: `./dist/${source.replace(/\.ts$/, ".js")}`,
	};
}

describe("exportProblems", () => {
	it("accepts exports that mirror the entry points", () => {
		expect(
			exportProblems(
				[
					"index.ts",
					"email/index.ts",
					"email/adapters/resend/index.ts",
					"email/adapters/resend/client.ts",
				],
				{
					".": entry("index.ts"),
					"./email": entry("email/index.ts"),
					"./email/resend": entry("email/adapters/resend/index.ts"),
				},
			),
		).toStrictEqual([]);
	});

	it("reports a missing export, an export with no entry point, and wrong built paths", () => {
		expect(
			exportProblems(["index.ts", "email/index.ts"], {
				".": { ...entry("index.ts"), types: "./dist/other.d.ts" },
				"./sms": entry("sms/index.ts"),
			}),
		).toStrictEqual([
			"./email is missing from exports",
			"./sms matches no entry point",
			".: types should be ./dist/index.d.ts",
		]);
	});

	it("reports an adapter named like a submodule", () => {
		expect(
			exportProblems(
				["email/adapters/inbound/index.ts", "email/inbound/index.ts"],
				{ "./email/inbound": entry("email/inbound/index.ts") },
			),
		).toStrictEqual([
			"./email/inbound is claimed by email/adapters/inbound/index.ts and email/inbound/index.ts",
		]);
	});
});
