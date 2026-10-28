import { Duration, Effect, Layer } from "effect";
import { ContentType } from "#file/value-objects/content-type";
import { ScreenshotError } from "#screenshot/errors/screenshot-error";
import { ScreenshotService } from "#screenshot/services/screenshot-service";
import { Screenshot } from "#screenshot/value-objects/screenshot";

export interface BunWebViewScreenshotsOptions {
	/** `navigate` resolves on `load`; a client-rendered page still paints after that. */
	readonly settle?: Duration.Input;
	/** A page that never finishes loading (seen once with WebKit on a `data:` URL) must not hold its caller forever. */
	readonly timeout?: Duration.Input;
	readonly backend?: Bun.WebView.Backend;
}

// WKWebView on macOS (nothing to install); elsewhere Bun drives the Chromium it
// finds on PATH over CDP. Containers usually run as root, and Chromium refuses
// to start there with its sandbox on (the pipe closes at launch).
function defaultBackend(): Bun.WebView.Backend {
	return process.platform === "darwin"
		? "webkit"
		: { type: "chrome", argv: ["--no-sandbox"] };
}

// WebKit captures at the display's pixel ratio (2x on a Retina Mac), Chromium headless at 1x.
export async function atViewportSize(
	png: Uint8Array,
	width: number,
	height: number,
): Promise<Uint8Array> {
	const captured = await new Bun.Image(png).metadata();
	return captured.width === width && captured.height === height
		? png
		: new Bun.Image(png).resize(width, height).png().bytes();
}

function reasonOf(cause: unknown) {
	return cause instanceof Error ? cause.message : String(cause);
}

// One headless `Bun.WebView` per capture, closed right after: no cookie, no
// storage, no session survives between two calls, and a crashed page costs one
// screenshot rather than the process.
export function bunWebViewScreenshots(
	options: BunWebViewScreenshotsOptions = {},
) {
	const settle = Duration.toMillis(options.settle ?? "800 millis");
	const timeout = options.timeout ?? "30 seconds";
	const backend = options.backend ?? defaultBackend();
	return Layer.succeed(ScreenshotService, {
		capture: ({ url, width, height }) =>
			Effect.tryPromise({
				try: async (signal) => {
					const view = new Bun.WebView({ width, height, backend });
					signal.addEventListener("abort", () => view.close());
					try {
						await view.navigate(url);
						// Chrome takes the constructor's size for its window and leaves the page 87 pixels short; it resizes only once a page is loaded.
						await view.resize(width, height);
						await Bun.sleep(settle);
						const png = await view.screenshot({
							encoding: "buffer",
							format: "png",
						});
						return Screenshot.make({
							content: await atViewportSize(new Uint8Array(png), width, height),
							contentType: ContentType.make("image/png"),
							width,
							height,
						});
					} finally {
						view.close();
					}
				},
				catch: (cause) => new ScreenshotError({ url, reason: reasonOf(cause) }),
			}).pipe(
				Effect.timeoutOrElse({
					duration: timeout,
					orElse: () =>
						Effect.fail(
							new ScreenshotError({
								url,
								reason: `no capture within ${Duration.format(Duration.fromInputUnsafe(timeout))}`,
							}),
						),
				}),
			),
	});
}
