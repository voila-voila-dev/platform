import { describe, expect, it } from "bun:test";
import { exportProblems, importMapProblems } from "./export-rules.ts";

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
					exports: {
						".": "./src/index.ts",
						"./email": "./src/email/index.ts",
						"./email/resend": "./src/email/adapters/resend/index.ts",
					},
					publishConfig: {
						exports: {
							".": "./dist/index.js",
							"./email": "./dist/email/index.js",
							"./email/resend": "./dist/email/adapters/resend/index.js",
						},
					},
				},
			),
		).toStrictEqual([]);
	});

	it("reports a missing export, an export with no entry point, and a wrong path", () => {
		expect(
			exportProblems(["index.ts", "email/index.ts"], {
				exports: { ".": "./src/index.ts", "./sms": "./src/sms/index.ts" },
				publishConfig: {
					exports: {
						".": "./dist/other.js",
						"./email": "./dist/email/index.js",
					},
				},
			}),
		).toStrictEqual([
			"./sms matches no entry point",
			'publishConfig.exports["."] should be ./dist/index.js, not ./dist/other.js',
			'exports["./email"] is missing: it should be ./src/email/index.ts',
		]);
	});

	it("reports an adapter named like a submodule", () => {
		expect(
			exportProblems(
				["email/adapters/inbound/index.ts", "email/inbound/index.ts"],
				{
					exports: { "./email/inbound": "./src/email/inbound/index.ts" },
					publishConfig: {
						exports: { "./email/inbound": "./dist/email/inbound/index.js" },
					},
				},
			),
		).toStrictEqual([
			"./email/inbound is claimed by email/adapters/inbound/index.ts and email/inbound/index.ts",
		]);
	});
});

describe("importMapProblems", () => {
	it("expects # to read src in the repository and dist once published", () => {
		expect(
			importMapProblems({
				imports: { "#*": "./src/*.ts" },
				publishConfig: { imports: { "#*": "./dist/*.js" } },
			}),
		).toStrictEqual([]);
		expect(importMapProblems({ imports: { "#*": "./src/*" } })).toStrictEqual([
			'imports["#*"] should be ./src/*.ts, not ./src/*',
			'publishConfig.imports["#*"] is missing: it should be ./dist/*.js',
		]);
	});
});
