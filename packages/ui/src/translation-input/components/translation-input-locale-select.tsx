import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import type { TranslationValue } from "#/translation-input/lib/translation-value.ts";

interface Props
	extends Omit<React.ComponentProps<"select">, "value" | "onChange"> {
	value: TranslationValue;
	locale: string;
	locales: ReadonlyArray<string>;
	onLocaleChange: (locale: string) => void;
	localeLabel: string;
	localeCodes?: Record<string, string>;
}

/**
 * The trailing locale switcher. Locales that hold nothing yet are marked with
 * a bullet, so a partially translated value is visible without opening each
 * language in turn.
 */
export function TranslationInputLocaleSelect({
	value,
	locale,
	locales,
	onLocaleChange,
	localeLabel,
	localeCodes,
	className,
	...props
}: Props) {
	return (
		<select
			data-slot="translation-input-locale"
			aria-label={localeLabel}
			value={locale}
			onChange={(event) => onLocaleChange(event.target.value)}
			className={cn(
				"cursor-pointer appearance-none bg-transparent pr-1 font-medium text-muted-foreground text-sm outline-none",
				className,
			)}
			{...props}
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
	);
}
