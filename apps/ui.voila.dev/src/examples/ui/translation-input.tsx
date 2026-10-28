import { TranslationInput } from "@voila.dev/ui/translation-input";
import { useState } from "react";

export function Default() {
	const [value, setValue] = useState<Record<string, string>>({
		"fr-FR": "Refonte de la page d'accueil",
		"en-GB": "",
	});
	const [locale, setLocale] = useState("fr-FR");
	return (
		<div className="w-full max-w-sm">
			<TranslationInput
				value={value}
				onValueChange={setValue}
				locale={locale}
				locales={["fr-FR", "en-GB"]}
				onLocaleChange={setLocale}
				localeLabel="Language"
				localeCodes={{ "fr-FR": "FR", "en-GB": "EN" }}
			/>
		</div>
	);
}
