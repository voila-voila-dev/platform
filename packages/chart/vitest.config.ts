import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";
import type { BrowserCommand } from "vitest/node";

interface MediaFeatures {
	readonly colorScheme?: "light" | "dark" | null;
	readonly forcedColors?: "active" | "none" | null;
	readonly reducedMotion?: "reduce" | "no-preference" | null;
}

/** Media emulation is Playwright's, out of reach of the page: the test asks the runner. */
const emulateMedia: BrowserCommand<[MediaFeatures]> = async (
	context,
	media,
) => {
	if (context.provider.name !== "playwright") {
		throw new Error("emulateMedia needs the Playwright provider");
	}
	await context.page.emulateMedia(media);
};

// A `*.browser.test.tsx` runs in Chromium: focus, Canvas pixels and real text
// metrics are what jsdom fakes worst.
const BROWSER_TESTS = "src/**/*.browser.test.tsx";

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: "unit",
					exclude: [...configDefaults.exclude, BROWSER_TESTS],
				},
			},
			{
				extends: true,
				test: {
					name: "browser",
					include: [BROWSER_TESTS],
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [{ browser: "chromium" }],
						commands: { emulateMedia },
					},
				},
			},
		],
	},
});
