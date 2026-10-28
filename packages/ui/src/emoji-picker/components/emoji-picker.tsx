import { EmojiPicker as EmojiPickerPrimitive } from "frimousse";
import type * as React from "react";
import { EMOJIBASE_URL } from "#/emoji-picker/lib/emojibase-url.ts";
import { cn } from "#/lib/utils.ts";

type EmojiLocale = React.ComponentProps<
	typeof EmojiPickerPrimitive.Root
>["locale"];

/** The picker's copy, which the consumer owns like every label in the kit. */
export interface EmojiPickerLabels {
	/** The emoji names' and search's language; the picker's own default otherwise. */
	locale?: EmojiLocale;
	/** The search field's placeholder. */
	searchPlaceholder?: string;
	/** Shown while the emoji data loads. */
	loadingLabel?: string;
	/** Shown when the search matches nothing. */
	emptyLabel?: string;
	/** Where the Emojibase data lives; emoji.voila.dev by default. */
	emojibaseUrl?: string;
}

interface Props
	extends EmojiPickerLabels,
		Omit<
			React.ComponentProps<typeof EmojiPickerPrimitive.Root>,
			"onEmojiSelect" | "locale" | "emojibaseUrl" | "children"
		> {
	/** The emoji picked, as its character. */
	onEmojiSelect: (emoji: string) => void;
	/** Focus the search field on mount, as a popover opened to pick wants. */
	autoFocus?: boolean;
}

/**
 * Every emoji, searchable and filed by category, as a panel to drop in a
 * popover, a sheet or a page. The Emojibase data comes from emoji.voila.dev on
 * first render and is cached by the browser afterwards.
 *
 * The kit ships no copy: the placeholder and the two states arrive as props.
 */
export function EmojiPicker({
	onEmojiSelect,
	locale,
	searchPlaceholder,
	loadingLabel,
	emptyLabel,
	emojibaseUrl = EMOJIBASE_URL,
	columns = 8,
	autoFocus = false,
	className,
	...props
}: Props) {
	return (
		<EmojiPickerPrimitive.Root
			data-slot="emoji-picker"
			onEmojiSelect={({ emoji }) => onEmojiSelect(emoji)}
			locale={locale}
			emojibaseUrl={emojibaseUrl}
			columns={columns}
			className={cn("flex h-80 w-[19rem] flex-col", className)}
			{...props}
		>
			<EmojiPickerPrimitive.Search
				data-slot="emoji-picker-search"
				placeholder={searchPlaceholder}
				autoFocus={autoFocus}
				className="mx-2 mt-2 mb-1 h-8 rounded-md bg-muted px-2.5 text-sm outline-none placeholder:text-muted-foreground"
			/>
			<EmojiPickerPrimitive.Viewport className="relative flex-1 outline-none">
				<EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
					{loadingLabel}
				</EmojiPickerPrimitive.Loading>
				<EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
					{emptyLabel}
				</EmojiPickerPrimitive.Empty>
				<EmojiPickerPrimitive.List
					className="select-none pb-1.5"
					components={{
						CategoryHeader: ({ category, ...headerProps }) => (
							<div
								className="bg-popover px-3 pt-2 pb-1 font-medium text-muted-foreground text-xs"
								{...headerProps}
							>
								{category.label}
							</div>
						),
						Row: ({ children, ...rowProps }) => (
							<div className="scroll-my-1 px-1.5" {...rowProps}>
								{children}
							</div>
						),
						Emoji: ({ emoji, ...emojiProps }) => (
							<button
								type="button"
								data-slot="emoji-picker-emoji"
								aria-label={emoji.label}
								className="flex size-8 items-center justify-center rounded-md text-lg data-active:bg-muted"
								{...emojiProps}
							>
								{emoji.emoji}
							</button>
						),
					}}
				/>
			</EmojiPickerPrimitive.Viewport>
		</EmojiPickerPrimitive.Root>
	);
}
