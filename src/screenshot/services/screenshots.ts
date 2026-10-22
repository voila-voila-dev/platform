import { Context, type Effect } from "effect";
import type { ScreenshotError } from "#screenshot/errors/screenshot-error";
import type { Screenshot } from "#screenshot/value-objects/screenshot";

export interface ScreenshotRequest {
	readonly url: string;
	readonly width: number;
	readonly height: number;
}

/** Renders a page in a fresh, signed-out browser and captures its viewport, `width` × `height` pixels whatever the display density. */
export class Screenshots extends Context.Service<
	Screenshots,
	{
		readonly capture: (
			request: ScreenshotRequest,
		) => Effect.Effect<Screenshot, ScreenshotError>;
	}
>()("@voila.dev/platform/Screenshots") {}
