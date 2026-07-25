import type * as React from "react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "#/components/input-group.tsx";
import { cn } from "#/lib/utils.ts";

/** A value carrying one string per locale, keyed by locale tag. */
type TranslationValue = Record<string, string>;

const isBlank = (text: string | undefined): boolean =>
	(text ?? "").trim().length === 0;

/**
 * Writes `text` to `locale`, carrying it into every locale that is still blank
 * so a value written once is complete. Locales that already hold their own
 * wording are left alone - this only ever fills gaps, never overwrites a
 * translation.
 */
function writeLocale(
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

type TranslationInputProps = Omit<
	React.ComponentProps<typeof InputGroupInput>,
	"type" | "value" | "onChange" | "onValueChange"
> & {
	/** The whole per-locale record; only the active locale's string is shown. */
	value: TranslationValue;
	/** Receives the whole record with the active locale's string replaced. */
	onValueChange: (value: TranslationValue) => void;
	/** Locale whose string is currently being edited. */
	locale: string;
	/** Locale tags offered by the select, in display order. */
	locales: ReadonlyArray<string>;
	/** Receives the newly selected locale. */
	onLocaleChange: (locale: string) => void;
	/** Accessible name for the locale select. */
	localeLabel: string;
	/** Short display code per locale (e.g. `{ "fr-FR": "FR" }`). Falls back to the tag. */
	localeCodes?: Record<string, string>;
	/** Wrapper class (width/layout), forwarded to the `InputGroup`. */
	className?: string;
};

/**
 * A translated text input: one field editing the active locale's string, with a
 * trailing locale select to switch between them. The whole per-locale record is
 * the value, so a consumer binds one field instead of one per language and a
 * switch never loses what the other locales hold.
 *
 * The select marks locales that are still empty with a dot, so a partially
 * translated value is visible without opening each language in turn.
 *
 * A locale that is still EMPTY follows what you type, so writing the wording
 * once yields a complete value instead of forcing the author through every
 * language before the field can be saved. As soon as a locale has its own
 * wording it stops following and is only edited directly.
 */
function TranslationInput({
	value,
	onValueChange,
	locale,
	locales,
	onLocaleChange,
	localeLabel,
	localeCodes,
	className,
	...props
}: TranslationInputProps) {
	return (
		<InputGroup
			// The input has no intrinsic width, so under `table-layout: auto` a
			// grid cell would collapse it to a couple of characters. A floor keeps
			// the text readable wherever it is dropped.
			className={cn("min-w-44", className)}
			data-slot="translation-input"
		>
			<InputGroupInput
				type="text"
				value={value[locale] ?? ""}
				onChange={(event) =>
					onValueChange(writeLocale(value, locales, locale, event.target.value))
				}
				{...props}
			/>
			<InputGroupAddon align="inline-end">
				<select
					data-slot="translation-input-locale"
					aria-label={localeLabel}
					value={locale}
					onChange={(event) => onLocaleChange(event.target.value)}
					className={cn(
						"cursor-pointer appearance-none bg-transparent pr-1 text-sm font-medium text-muted-foreground outline-none",
					)}
				>
					{locales.map((tag) => {
						const filled = (value[tag] ?? "").trim().length > 0;
						const code = localeCodes?.[tag] ?? tag;
						// The bullet flags a locale with nothing in it yet; `<option>`
						// cannot host markup, so the status rides in the text.
						return (
							<option key={tag} value={tag}>
								{filled ? code : `• ${code}`}
							</option>
						);
					})}
				</select>
			</InputGroupAddon>
		</InputGroup>
	);
}

export { TranslationInput, type TranslationInputProps, type TranslationValue };
