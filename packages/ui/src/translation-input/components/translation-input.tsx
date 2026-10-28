import type * as React from "react";
import { InputGroup } from "#/input-group/components/input-group.tsx";
import { cn } from "#/lib/utils.ts";
import { TranslationInputLocaleSelect } from "#/translation-input/components/translation-input-locale-select.tsx";
import type { TranslationValue } from "#/translation-input/lib/translation-value.ts";
import { writeLocale } from "#/translation-input/lib/write-locale.ts";

interface Props
	extends Omit<
		React.ComponentProps<typeof InputGroup.Input>,
		"type" | "value" | "onChange" | "onValueChange"
	> {
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
}

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
export function TranslationInput({
	value,
	onValueChange,
	locale,
	locales,
	onLocaleChange,
	localeLabel,
	localeCodes,
	className,
	...props
}: Props) {
	return (
		<InputGroup.Root
			// The input has no intrinsic width, so under `table-layout: auto` a
			// grid cell would collapse it to a couple of characters. A floor keeps
			// the text readable wherever it is dropped.
			className={cn("min-w-44", className)}
			data-slot="translation-input"
		>
			<InputGroup.Input
				type="text"
				value={value[locale] ?? ""}
				onChange={(event) =>
					onValueChange(writeLocale(value, locales, locale, event.target.value))
				}
				{...props}
			/>
			<InputGroup.Addon align="inline-end">
				<TranslationInputLocaleSelect
					value={value}
					locale={locale}
					locales={locales}
					onLocaleChange={onLocaleChange}
					localeLabel={localeLabel}
					localeCodes={localeCodes}
				/>
			</InputGroup.Addon>
		</InputGroup.Root>
	);
}
