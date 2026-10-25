import { Effect, Layer } from "effect";
import { ScreenshotError } from "#screenshot/errors/screenshot-error";
import { Screenshots } from "#screenshot/services/screenshots";
import { Screenshot } from "#screenshot/value-objects/screenshot";
import type { ScreenshotRequest } from "#screenshot/value-objects/screenshot-request";

// The PNG holds `png:<url>`, so a test can tell which page a capture came from.
export function stubScreenshots(
	options: { readonly failing?: ReadonlyArray<string> } = {},
) {
	const captured: Array<ScreenshotRequest> = [];
	return {
		captured,
		layer: Layer.succeed(Screenshots, {
			capture: (request) =>
				options.failing?.includes(request.url)
					? Effect.fail(
							new ScreenshotError({
								url: request.url,
								reason: "stubbed failure",
							}),
						)
					: Effect.sync(() => {
							captured.push(request);
							return Screenshot.make({
								png: new TextEncoder().encode(`png:${request.url}`),
								width: request.width,
								height: request.height,
							});
						}),
		}),
	};
}
