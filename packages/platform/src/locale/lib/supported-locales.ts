import { Schema } from "effect";
import type { Locale } from "#locale/value-objects/locale";

export interface SupportedLocalesConfig<Supported extends Locale> {
	readonly locales: readonly [Supported, ...Array<Supported>];
	// What a preference outside the supported locales, or no preference, reads as.
	readonly fallback: NoInfer<Supported>;
}

function make<const Supported extends Locale>(
	config: SupportedLocalesConfig<Supported>,
) {
	const SupportedLocale = Schema.Literals(config.locales);
	const isSupported = Schema.is(SupportedLocale);

	function per<Value>(
		make: (locale: Supported) => Value,
	): Record<Supported, Value> {
		return Object.fromEntries(
			config.locales.map((locale) => [locale, make(locale)]),
		) as Record<Supported, Value>;
	}

	function narrow(value: string | null | undefined): Supported {
		return isSupported(value) ? value : config.fallback;
	}

	return {
		locales: config.locales,
		fallback: config.fallback,
		Schema: SupportedLocale,
		is: isSupported,
		per,
		narrow,
	};
}

export const SupportedLocales = { make };
