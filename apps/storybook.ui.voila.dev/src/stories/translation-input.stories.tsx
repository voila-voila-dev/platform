import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { TranslationInput } from "@voila.dev/ui/translation-input";
import { useState } from "react";

/**
 * The component is controlled on two axes — the translations and the locale
 * being edited — so the stories drive a fixture rather than the bare
 * component. Typing in one language has to leave the others untouched, and
 * that is only visible if the state is real.
 */
function Fixture({
	initial,
	locales,
	localeCodes,
}: {
	initial: Record<string, string>;
	locales: string[];
	localeCodes: Record<string, string>;
}) {
	const [value, setValue] = useState(initial);
	const [locale, setLocale] = useState(locales[0] ?? "");
	return (
		<div className="w-full max-w-sm">
			<TranslationInput
				value={value}
				onValueChange={setValue}
				locale={locale}
				locales={locales}
				onLocaleChange={setLocale}
				localeLabel="Language"
				localeCodes={localeCodes}
			/>
		</div>
	);
}

const meta = {
	title: "UI/TranslationInput",
	component: Fixture,
	tags: ["autodocs"],
	args: {
		locales: ["fr-FR", "en-GB"],
		localeCodes: { "fr-FR": "FR", "en-GB": "EN" },
		initial: { "fr-FR": "Refonte de la page d'accueil", "en-GB": "" },
	},
} satisfies Meta<typeof Fixture>;

export default meta;

type Story = StoryObj<typeof meta>;

/** One language filled, one still empty — the usual state mid-translation. */
export const Default: Story = {};

export const AllTranslated: Story = {
	args: {
		initial: {
			"fr-FR": "Refonte de la page d'accueil",
			"en-GB": "Homepage redesign",
		},
	},
};

/** Nothing entered yet, so every locale reads as outstanding. */
export const Empty: Story = {
	args: { initial: { "fr-FR": "", "en-GB": "" } },
};

/** More locales than fit comfortably — the switcher has to stay usable. */
export const ManyLocales: Story = {
	args: {
		locales: ["fr-FR", "en-GB", "es-ES", "de-DE", "it-IT"],
		localeCodes: {
			"fr-FR": "FR",
			"en-GB": "EN",
			"es-ES": "ES",
			"de-DE": "DE",
			"it-IT": "IT",
		},
		initial: {
			"fr-FR": "Refonte de la page d'accueil",
			"en-GB": "Homepage redesign",
			"es-ES": "",
			"de-DE": "",
			"it-IT": "",
		},
	},
};
