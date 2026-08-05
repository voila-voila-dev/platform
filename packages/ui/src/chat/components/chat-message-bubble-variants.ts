import { cva, type VariantProps } from "#/lib/cva.ts";

export const chatMessageBubbleVariants = cva({
	// `min-w-0` + `overflow-wrap:anywhere` keep an unbroken word/URL inside the
	// bubble instead of overflowing the whole list horizontally.
	// Subtle enter animation for appended messages; respect reduced-motion.
	// Content stays left-aligned in both variants so short messages read from the
	// left edge of the bubble; the bubble itself is aligned end/start by the
	// enclosing `ChatMessageGroup`.
	base: "flex min-w-0 max-w-[85%] flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap [overflow-wrap:anywhere] animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none sm:max-w-[75%]",
	variants: {
		/**
		 * Which side of the conversation the bubble belongs to. `own` is the
		 * signed-in user. This only tints and notches the bubble — the enclosing
		 * `ChatMessageGroup` is what aligns it left or right.
		 */
		variant: {
			own: "rounded-br-sm bg-primary text-primary-foreground",
			other: "rounded-bl-sm bg-muted text-foreground",
		},
	},
});

export type ChatMessageBubbleVariants = VariantProps<
	typeof chatMessageBubbleVariants
>;
