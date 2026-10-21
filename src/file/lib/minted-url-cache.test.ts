import { describe, expect, it } from "bun:test";
import { Exit } from "effect";
import { createMintedUrlCache } from "#file/lib/minted-url-cache";

function IN_AN_HOUR() {
	return new Date(Date.now() + 3_600_000);
}

function ticketsFor(keys: ReadonlyArray<string>) {
	return Promise.resolve(
		Exit.succeed(
			keys.map((key) => ({
				key,
				url: `https://files.test/${key}`,
				expiresAt: IN_AN_HOUR(),
			})),
		),
	);
}

describe("minted url cache, in batch", () => {
	it("mints the whole set in one request", async () => {
		const cache = createMintedUrlCache();
		const asked: Array<ReadonlyArray<string>> = [];

		const urls = await cache.resolveAll(["a", "b", "c"], (missing) => {
			asked.push(missing);
			return ticketsFor(missing);
		});

		expect(asked).toStrictEqual([["a", "b", "c"]]);
		expect(urls.get("b")).toBe("https://files.test/b");
	});

	it("asks only for what it does not already hold", async () => {
		const cache = createMintedUrlCache();
		await cache.resolveAll(["a"], ticketsFor);
		const asked: Array<ReadonlyArray<string>> = [];

		const urls = await cache.resolveAll(["a", "b"], (missing) => {
			asked.push(missing);
			return ticketsFor(missing);
		});

		expect(asked).toStrictEqual([["b"]]);
		expect(urls.size).toBe(2);
	});

	it("skips the request entirely when everything is already held", async () => {
		const cache = createMintedUrlCache();
		await cache.resolveAll(["a"], ticketsFor);
		let called = false;

		await cache.resolveAll(["a"], (missing) => {
			called = true;
			return ticketsFor(missing);
		});

		expect(called).toBe(false);
	});

	it("keeps the keys the answer carried when one is missing from it", async () => {
		const cache = createMintedUrlCache();

		const urls = await cache.resolveAll(["a", "b"], () => ticketsFor(["a"]));

		expect([...urls.keys()]).toStrictEqual(["a"]);
	});

	it("hands back what it held when the request fails", async () => {
		const cache = createMintedUrlCache();
		await cache.resolveAll(["a"], ticketsFor);

		const urls = await cache.resolveAll(["a", "b"], () =>
			Promise.resolve(Exit.fail("nope")),
		);

		expect([...urls.keys()]).toStrictEqual(["a"]);
	});
});
