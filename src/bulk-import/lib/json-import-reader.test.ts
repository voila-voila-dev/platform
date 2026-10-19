import { describe, expect, it } from "bun:test";
import { Effect, Exit } from "effect";
import { jsonImportReader } from "#bulk-import/lib/json-import-reader";

function read(value: string) {
	return Effect.runPromiseExit(
		jsonImportReader.read(new TextEncoder().encode(value)),
	);
}

describe("jsonImportReader", () => {
	it("reads an array of objects under a header of every key", async () => {
		const exit = await read(
			JSON.stringify([
				{ email: "a@x.fr", age: 31 },
				{ email: "b@x.fr", vip: true, tags: ["x"] },
			]),
		);

		expect(exit).toStrictEqual(
			Exit.succeed([
				["email", "age", "vip", "tags"],
				["a@x.fr", "31", "", ""],
				["b@x.fr", "", "true", '["x"]'],
			]),
		);
	});

	it("reads an array of arrays as is", async () => {
		expect(await read('[["email"],["a@x.fr"]]')).toStrictEqual(
			Exit.succeed([["email"], ["a@x.fr"]]),
		);
	});

	it("rejects anything else as unreadable", async () => {
		for (const value of ['{"email":"a@x.fr"}', "not json", "[1, 2]"]) {
			const exit = await read(value);
			expect(Exit.isFailure(exit)).toBe(true);
		}
	});
});
