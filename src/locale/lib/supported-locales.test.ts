import { describe, expect, it } from "bun:test";
import { SupportedLocales } from "#locale/lib/supported-locales";

const AppLocales = SupportedLocales.make({
	locales: ["fr-FR", "en-US"],
	fallback: "fr-FR",
});

describe("SupportedLocales", () => {
	it("builds one entry per supported locale", () => {
		expect(AppLocales.per((locale) => locale.slice(0, 2))).toEqual({
			"fr-FR": "fr",
			"en-US": "en",
		});
	});

	it("keeps a supported locale", () => {
		expect(AppLocales.narrow("en-US")).toBe("en-US");
	});

	it("reads an unsupported, unknown or missing locale as the fallback", () => {
		expect(AppLocales.narrow("de-DE")).toBe("fr-FR");
		expect(AppLocales.narrow("klingon")).toBe("fr-FR");
		expect(AppLocales.narrow(null)).toBe("fr-FR");
	});
});
