import { Effect, Layer } from "effect";
import { ContentType } from "#file/value-objects/content-type";
import { ScreenshotError } from "#screenshot/errors/screenshot-error";
import { ScreenshotService } from "#screenshot/services/screenshot-service";
import { Screenshot } from "#screenshot/value-objects/screenshot";
import type { ScreenshotRequest } from "#screenshot/value-objects/screenshot-request";

// The content is `png:<url>`, so a test can tell which page a capture came from.
export function stubScreenshots(
	options: { readonly failing?: ReadonlyArray<string> } = {},
) {
	const captured: Array<ScreenshotRequest> = [];
	return {
		captured,
		layer: Layer.succeed(ScreenshotService, {
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
								content: new TextEncoder().encode(`png:${request.url}`),
								contentType: ContentType.make("image/png"),
								width: request.width,
								height: request.height,
							});
						}),
		}),
	};
}
