import { describe, expect, it } from "bun:test";
import { Effect } from "effect";
import { stubScreenshots } from "#screenshot/adapters/memory/stub-screenshots";
import { Screenshots } from "#screenshot/services/screenshots";

function capture(url: string) {
	return Effect.gen(function* () {
		const screenshots = yield* Screenshots;
		return yield* screenshots.capture({ url, width: 1200, height: 630 });
	});
}

describe("stubScreenshots", () => {
	it("records each capture and tags the PNG with its URL", async () => {
		const stub = stubScreenshots();
		const screenshot = await Effect.runPromise(
			capture("https://example.com").pipe(Effect.provide(stub.layer)),
		);
		expect(new TextDecoder().decode(screenshot.content)).toBe(
			"png:https://example.com",
		);
		expect(screenshot.width).toBe(1200);
		expect(stub.captured).toEqual([
			{ url: "https://example.com", width: 1200, height: 630 },
		]);
	});

	it("fails the URLs it is told to", async () => {
		const stub = stubScreenshots({ failing: ["https://down.example.com"] });
		const error = await Effect.runPromise(
			capture("https://down.example.com").pipe(
				Effect.flip,
				Effect.provide(stub.layer),
			),
		);
		expect(error._tag).toBe("ScreenshotError");
		expect(stub.captured).toEqual([]);
	});
});
