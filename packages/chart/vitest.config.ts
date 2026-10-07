import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

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
					},
				},
			},
		],
	},
});
