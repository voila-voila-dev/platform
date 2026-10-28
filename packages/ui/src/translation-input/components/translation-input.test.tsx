// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TranslationInput } from "#/translation-input/components/translation-input.tsx";

afterEach(cleanup);

const LOCALES = ["fr-FR", "en-US"] as const;

const renderInput = (
	value: Record<string, string>,
	locale = "fr-FR",
	onValueChange = vi.fn(),
	onLocaleChange = vi.fn(),
) => {
	const view = render(
		<TranslationInput
			value={value}
			onValueChange={onValueChange}
			locale={locale}
			locales={LOCALES}
			onLocaleChange={onLocaleChange}
			localeLabel="Langue"
			localeCodes={{ "fr-FR": "FR", "en-US": "EN" }}
			aria-label="Nom"
		/>,
	);
	return { view, onValueChange, onLocaleChange };
};

describe("TranslationInput", () => {
	it("shows only the active locale's string", () => {
		const { view } = renderInput({ "fr-FR": "Bande", "en-US": "Tape" });
		const input = view.getByLabelText("Nom") as HTMLInputElement;
		expect(input.value).toBe("Bande");
	});

	it("edits the active locale and leaves the others untouched", () => {
		const { view, onValueChange } = renderInput({
			"fr-FR": "Bande",
			"en-US": "Tape",
		});
		fireEvent.change(view.getByLabelText("Nom"), {
			target: { value: "Bande élastique" },
		});
		expect(onValueChange).toHaveBeenCalledWith({
			"fr-FR": "Bande élastique",
			"en-US": "Tape",
		});
	});

	it("starts a locale that has no value yet from empty rather than undefined", () => {
		const { view, onValueChange } = renderInput({ "fr-FR": "Bande" }, "en-US");
		expect((view.getByLabelText("Nom") as HTMLInputElement).value).toBe("");
		fireEvent.change(view.getByLabelText("Nom"), { target: { value: "Tape" } });
		// French already has its own wording, so it is left alone.
		expect(onValueChange).toHaveBeenCalledWith({
			"fr-FR": "Bande",
			"en-US": "Tape",
		});
	});

	it("carries the first wording into the locales that are still blank", () => {
		// Writing a brand-new value should not force the author through every
		// language before the field can be saved.
		const { view, onValueChange } = renderInput({ "fr-FR": "", "en-US": "" });
		fireEvent.change(view.getByLabelText("Nom"), {
			target: { value: "Bande" },
		});
		expect(onValueChange).toHaveBeenCalledWith({
			"fr-FR": "Bande",
			"en-US": "Bande",
		});
	});

	it("treats a whitespace-only locale as blank, so it follows too", () => {
		const { view, onValueChange } = renderInput({ "fr-FR": "  ", "en-US": "" });
		fireEvent.change(view.getByLabelText("Nom"), { target: { value: "Tape" } });
		expect(onValueChange).toHaveBeenCalledWith({
			"fr-FR": "Tape",
			"en-US": "Tape",
		});
	});

	it("marks locales with nothing in them, so a partial value is visible closed", () => {
		const { view } = renderInput({ "fr-FR": "Bande", "en-US": "   " });
		const select = view.getByLabelText("Langue") as HTMLSelectElement;
		const labels = [...select.options].map((option) => option.textContent);
		// Whitespace counts as empty; the filled locale carries no marker.
		expect(labels).toStrictEqual(["FR", "• EN"]);
	});

	it("reports the locale the user switches to", () => {
		const { view, onLocaleChange } = renderInput({ "fr-FR": "Bande" });
		fireEvent.change(view.getByLabelText("Langue"), {
			target: { value: "en-US" },
		});
		expect(onLocaleChange).toHaveBeenCalledWith("en-US");
	});

	// The locale select sits in a trailing `InputGroup.Addon`, whose click
	// handler forwards focus to the group's control. It used to skip only
	// `button` targets, so clicking the select handed focus straight back to the
	// text input and the native dropdown closed the instant it opened: the
	// locale could not be changed with the pointer at all.
	it("leaves focus on the locale select when it is clicked", () => {
		const { view } = renderInput({ "fr-FR": "Bande" });
		const select = view.getByLabelText("Langue") as HTMLSelectElement;
		select.focus();
		fireEvent.click(select);
		expect(document.activeElement).toBe(select);
	});
});
