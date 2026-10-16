import { EmojiPicker } from "frimousse";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

type EmojiLocale = React.ComponentProps<typeof EmojiPicker.Root>["locale"];

/** The picker's copy, which the consumer owns like every label in the kit. */
export interface ChatEmojiPickerLabels {
	/** The emoji names' and search's language; the picker's own default otherwise. */
	locale?: EmojiLocale;
	/** The search field's placeholder. */
	searchPlaceholder?: string;
	/** Shown while the emoji data loads. */
	loadingLabel?: string;
	/** Shown when the search matches nothing. */
	emptyLabel?: string;
}

interface Props extends ChatEmojiPickerLabels {
	onPick: (emoji: string) => void;
	className?: string;
}

/**
 * Every emoji, searchable and filed by category: what the reader reaches for
 * when the six quick reactions do not say it. The data comes from Emojibase on
 * first open and is cached by the browser afterwards.
 *
 * The kit ships no copy: the placeholder and the two states arrive as props.
 */
export function ChatEmojiPicker({
	onPick,
	locale,
	searchPlaceholder,
	loadingLabel,
	emptyLabel,
	className,
}: Props) {
	return (
		<EmojiPicker.Root
			data-slot="chat-emoji-picker"
			onEmojiSelect={({ emoji }) => onPick(emoji)}
			locale={locale}
			columns={8}
			className={cn("flex h-80 w-[19rem] flex-col", className)}
		>
			<EmojiPicker.Search
				placeholder={searchPlaceholder}
				autoFocus
				className="mx-2 mt-2 mb-1 h-8 rounded-md bg-muted px-2.5 text-sm outline-none placeholder:text-muted-foreground"
			/>
			<EmojiPicker.Viewport className="relative flex-1 outline-none">
				<EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
					{loadingLabel}
				</EmojiPicker.Loading>
				<EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
					{emptyLabel}
				</EmojiPicker.Empty>
				<EmojiPicker.List
					className="select-none pb-1.5"
					components={{
						CategoryHeader: ({ category, ...props }) => (
							<div
								className="bg-popover px-3 pt-2 pb-1 font-medium text-muted-foreground text-xs"
								{...props}
							>
								{category.label}
							</div>
						),
						Row: ({ children, ...props }) => (
							<div className="scroll-my-1 px-1.5" {...props}>
								{children}
							</div>
						),
						Emoji: ({ emoji, ...props }) => (
							<button
								type="button"
								aria-label={emoji.label}
								className="flex size-8 items-center justify-center rounded-md text-lg data-active:bg-muted"
								{...props}
							>
								{emoji.emoji}
							</button>
						),
					}}
				/>
			</EmojiPicker.Viewport>
		</EmojiPicker.Root>
	);
}
