import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { configDefaults, defineConfig } from "vitest/config";

// A `*.browser.test.tsx` runs in Chromium: drag, drop, paste and the caret are
// what jsdom fakes worst, and a test that passes there proves nothing about a
// browser.
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
				// The kit's own stylesheet, so a test sees what a user sees:
				// visibility and hit targets depend on it.
				plugins: [tailwindcss()],
				test: {
					name: "browser",
					include: [BROWSER_TESTS],
					setupFiles: ["test/browser-setup.ts"],
					browser: {
						enabled: true,
						// The link paste test goes through the real clipboard.
						provider: playwright({
							contextOptions: {
								permissions: ["clipboard-read", "clipboard-write"],
							},
						}),
						headless: true,
						instances: [{ browser: "chromium" }],
					},
				},
			},
		],
	},
});
