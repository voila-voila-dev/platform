import type * as React from "react";
import { ContextMenuContent } from "#/context-menu/components/context-menu-content.tsx";
import { ContextMenuRoot } from "#/context-menu/components/context-menu-root.tsx";
import { ContextMenuTrigger } from "#/context-menu/components/context-menu-trigger.tsx";
import { cn } from "#/lib/utils.ts";

/** The emoji row every chat app opens with. Override per surface. */
export const CHAT_QUICK_REACTIONS: ReadonlyArray<string> = [
	"👍",
	"❤️",
	"😂",
	"😮",
	"😢",
	"🙏",
];

interface Props {
	/** The message this menu belongs to — the right-click / long-press target. */
	children: React.ReactNode;
	/** The one-tap emojis. Pass `[]` to drop the row entirely. */
	emojis?: ReadonlyArray<string>;
	/** Emojis the reader already reacted with; they read as pressed. */
	activeEmojis?: ReadonlyArray<string>;
	/** Tapping an emoji. Toggling is the caller's business — the row only reports. */
	onReact?: (emoji: string) => void;
	/** Accessible name of the emoji row. */
	reactionsLabel?: string;
	/** The menu items, composed by the caller from `Chat.MessageAction`. */
	actions?: React.ReactNode;
	className?: string;
}

/**
 * The message menu: right-click on a pointer, long press on a touch screen —
 * both handled by the underlying context menu, so there is no viewport branch
 * here and no second component to keep in sync.
 *
 * The quick-reaction row lives inside the menu rather than floating separately
 * above the bubble. It is the same two gestures, one surface, and it survives
 * a narrow screen where a free-floating row has nowhere to go.
 *
 * The kit ships no copy: every label arrives as a prop or as composed
 * children, because the consumer owns the language.
 */
export function ChatMessageActions({
	children,
	emojis = CHAT_QUICK_REACTIONS,
	activeEmojis,
	onReact,
	reactionsLabel,
	actions,
	className,
}: Props) {
	const active = new Set(activeEmojis ?? []);
	const hasReactions = emojis.length > 0 && onReact !== undefined;

	return (
		<ContextMenuRoot>
			<ContextMenuTrigger
				data-slot="chat-message-actions-trigger"
				className={cn("w-fit", className)}
			>
				{children}
			</ContextMenuTrigger>
			<ContextMenuContent
				data-slot="chat-message-actions"
				className="min-w-44 p-0"
			>
				{hasReactions && (
					<div
						data-slot="chat-message-actions-reactions"
						role="group"
						aria-label={reactionsLabel}
						className="flex items-center gap-0.5 border-b px-1.5 py-1.5"
					>
						{emojis.map((emoji) => (
							<button
								key={emoji}
								type="button"
								data-slot="chat-quick-reaction"
								data-active={active.has(emoji) || undefined}
								aria-pressed={active.has(emoji)}
								aria-label={emoji}
								onClick={() => onReact(emoji)}
								className={cn(
									"flex size-8 items-center justify-center rounded-full text-lg leading-none transition-colors",
									"hover:bg-foreground/5",
									active.has(emoji) && "bg-primary/10",
								)}
							>
								<span aria-hidden>{emoji}</span>
							</button>
						))}
					</div>
				)}
				<div className="p-1">{actions}</div>
			</ContextMenuContent>
		</ContextMenuRoot>
	);
}
