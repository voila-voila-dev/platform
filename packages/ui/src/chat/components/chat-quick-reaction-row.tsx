import { cn } from "#/lib/utils.ts";

interface Props {
	emojis: ReadonlyArray<string>;
	activeEmojis: ReadonlySet<string>;
	onReact: (emoji: string) => void;
	/** Accessible name of the row. */
	label?: string;
	/** Cascades the emojis in one after another — the long-press surface. */
	stagger?: boolean;
	className?: string;
}

/**
 * The one-tap emoji row, shared by the context menu, the hover bar and the
 * long-press surface so the three read as the same control.
 */
export function ChatQuickReactionRow({
	emojis,
	activeEmojis,
	onReact,
	label,
	stagger = false,
	className,
}: Props) {
	return (
		<div
			data-slot="chat-message-actions-reactions"
			role="group"
			aria-label={label}
			className={cn("flex items-center gap-0.5", className)}
		>
			{emojis.map((emoji, index) => (
				<button
					key={emoji}
					type="button"
					data-slot="chat-quick-reaction"
					data-active={activeEmojis.has(emoji) || undefined}
					aria-pressed={activeEmojis.has(emoji)}
					aria-label={emoji}
					onClick={() => onReact(emoji)}
					style={stagger ? { animationDelay: `${index * 30}ms` } : undefined}
					className={cn(
						"flex size-8 shrink-0 items-center justify-center rounded-full text-lg leading-none outline-none transition-colors",
						"hover:bg-foreground/5 focus-visible:ring-2 focus-visible:ring-ring/50",
						stagger &&
							"fade-in-0 zoom-in-50 fill-mode-backwards animate-in duration-200 motion-reduce:animate-none",
						activeEmojis.has(emoji) && "bg-primary/10",
					)}
				>
					<span aria-hidden>{emoji}</span>
				</button>
			))}
		</div>
	);
}
