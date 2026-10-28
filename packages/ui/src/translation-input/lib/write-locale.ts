import { isBlank } from "#/translation-input/lib/is-blank.ts";
import type { TranslationValue } from "#/translation-input/lib/translation-value.ts";

/**
 * Writes `text` to `locale`, carrying it into every locale that is still blank
 * so a value written once is complete. Locales that already hold their own
 * wording are left alone - this only ever fills gaps, never overwrites a
 * translation.
 */
export function writeLocale(
	value: TranslationValue,
	locales: ReadonlyArray<string>,
	locale: string,
	text: string,
): TranslationValue {
	const next: TranslationValue = { ...value, [locale]: text };
	for (const tag of locales) {
		if (tag !== locale && isBlank(value[tag])) {
			next[tag] = text;
		}
	}
	return next;
}
