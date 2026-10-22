import { afterAll, describe, expect, it } from "bun:test";
import { Effect } from "effect";
import {
	atViewportSize,
	bunWebViewScreenshots,
} from "#screenshot/adapters/bun/bun-web-view-screenshots";
import { Screenshots } from "#screenshot/services/screenshots";

const onePixel = Uint8Array.fromBase64(
	"iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
);

describe("atViewportSize", () => {
	it("keeps a capture already at the viewport size", async () => {
		expect(await atViewportSize(onePixel, 1, 1)).toBe(onePixel);
	});

	it("scales a high-density capture down to the viewport", async () => {
		const retina = await new Bun.Image(onePixel).resize(8, 4).png().bytes();
		const scaled = await atViewportSize(retina, 4, 2);
		const { width, height } = await new Bun.Image(scaled).metadata();
		expect({ width, height }).toEqual({ width: 4, height: 2 });
	});
});

// WebKit ships with macOS; elsewhere the adapter needs a Chromium on PATH.
describe.skipIf(process.platform !== "darwin")("bunWebViewScreenshots", () => {
	const server = Bun.serve({
		port: 0,
		fetch: () =>
			new Response(
				"<html><body style='margin:0;background:#ff0000'></body></html>",
				{ headers: { "content-type": "text/html" } },
			),
	});
	afterAll(() => server.stop(true));

	it("captures the viewport at the requested size", async () => {
		const screenshot = await Effect.runPromise(
			Effect.gen(function* () {
				const screenshots = yield* Screenshots;
				return yield* screenshots.capture({
					url: server.url.href,
					width: 320,
					height: 200,
				});
			}).pipe(Effect.provide(bunWebViewScreenshots({ settle: "100 millis" }))),
		);
		const { width, height, format } = await new Bun.Image(
			screenshot.png,
		).metadata();
		expect({ width, height, format }).toEqual({
			width: 320,
			height: 200,
			format: "png",
		});
	}, 30_000);

	it("fails with a ScreenshotError when the page never loads in time", async () => {
		const error = await Effect.runPromise(
			Effect.gen(function* () {
				const screenshots = yield* Screenshots;
				return yield* screenshots.capture({
					url: server.url.href,
					width: 320,
					height: 200,
				});
			}).pipe(
				Effect.flip,
				Effect.provide(bunWebViewScreenshots({ timeout: "1 millis" })),
			),
		);
		expect(error.reason).toBe("no capture within 1ms");
	});
});
