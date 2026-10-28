import "vitest/browser";

declare module "vitest/browser" {
	interface BrowserCommands {
		emulateMedia(media: {
			readonly colorScheme?: "light" | "dark" | null;
			readonly forcedColors?: "active" | "none" | null;
			readonly reducedMotion?: "reduce" | "no-preference" | null;
		}): Promise<void>;
	}
}
