import * as React from "react";
import { ChatMessageHoverBar } from "#/chat/components/chat-message-hover-bar.tsx";
import {
	ChatMessagePressSurface,
	type ChatPressedMessage,
} from "#/chat/components/chat-message-press-surface.tsx";
import { ChatQuickReactionRow } from "#/chat/components/chat-quick-reaction-row.tsx";
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

/** How long the bar lingers once the pointer has left the message. */
const HOVER_CLOSE_DELAY = 120;

/**
 * Closes the one bar currently on screen. A thread is a column of adjacent
 * hover targets and a bar floats over its neighbours, so without a single
 * owner two of them end up open at once, each covering the other's message.
 * Module-level rather than a context: every message in the document shares the
 * same screen, and the consumer composes `Chat.MessageActions` freely.
 */
let closeOpenBar: (() => void) | null = null;

/**
 * Both pointer checks are asked positively and tolerate a missing
 * `matchMedia` (jsdom), so a test environment keeps the desktop menu instead
 * of falling into either pointer-specific branch.
 */
function matchesMedia(query: string): boolean {
	return (
		typeof window.matchMedia === "function" && window.matchMedia(query).matches
	);
}

/** Whether the current input can hover at all — the bar is desktop-only. */
function finePointer(): boolean {
	return matchesMedia("(hover: hover) and (pointer: fine)");
}

/** Whether the press comes from a touch screen. */
function coarsePointer(): boolean {
	return matchesMedia("(hover: none) and (pointer: coarse)");
}

/** `matches` may not know `:focus-visible`; treat that as keyboard focus. */
function focusVisible(target: EventTarget | null): boolean {
	if (!(target instanceof Element)) {
		return false;
	}
	try {
		return target.matches(":focus-visible");
	} catch {
		return true;
	}
}

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
	/** Accessible name of the long-press surface. */
	menuLabel?: string;
	/**
	 * Whether a fine pointer may summon the floating bar. Turn it off across the
	 * thread while a message is being edited: a bar hovering over the editor is
	 * offering actions on a message the reader is already acting on. Right-click
	 * and long press are unaffected.
	 */
	hoverBar?: boolean;
	/** The menu items, composed by the caller from `Chat.MessageAction`. */
	actions?: React.ReactNode;
	className?: string;
}

/**
 * The message menu, one per input. A fine pointer hovers the bubble and gets
 * a floating bar — quick reactions, then the actions themselves as icons, each
 * one press away; right-click still opens the full menu, which is where an
 * action with no icon lives. A touch screen long-presses and gets the
 * full-screen surface: thread blurred, bubble lifted, emoji row over it and
 * the actions under it. The quick-reaction row also stays inside the menu
 * itself, so the menu is complete on its own.
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
	menuLabel,
	hoverBar = true,
	actions,
	className,
}: Props) {
	const active = React.useMemo(
		() => new Set(activeEmojis ?? []),
		[activeEmojis],
	);
	const hasReactions = emojis.length > 0 && onReact !== undefined;

	const triggerRef = React.useRef<HTMLDivElement | null>(null);
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [barAlign, setBarAlign] = React.useState<"start" | "end" | null>(null);
	const [pressed, setPressed] = React.useState<ChatPressedMessage | null>(null);
	const barCloseTimeout = React.useRef<number | undefined>(undefined);

	const bubbleElement = (): HTMLElement | null =>
		triggerRef.current?.querySelector<HTMLElement>(
			"[data-slot=chat-bubble], [data-slot=chat-message-bubble]",
		) ?? triggerRef.current;

	const endAligned = (): boolean =>
		(bubbleElement()?.closest("[data-align=end]") ?? null) !== null;

	const cancelBarClose = () => window.clearTimeout(barCloseTimeout.current);
	// Stable across renders so it can be handed to (and compared against) the
	// module-level owner of the open bar.
	const closeBar = React.useCallback(function close() {
		window.clearTimeout(barCloseTimeout.current);
		if (closeOpenBar === close) {
			closeOpenBar = null;
		}
		setBarAlign(null);
	}, []);
	const scheduleBarClose = () => {
		cancelBarClose();
		barCloseTimeout.current = window.setTimeout(closeBar, HOVER_CLOSE_DELAY);
	};
	const openBar = () => {
		cancelBarClose();
		if (!hoverBar || menuOpen || pressed !== null) {
			return;
		}
		if (closeOpenBar !== closeBar) {
			closeOpenBar?.();
		}
		closeOpenBar = closeBar;
		setBarAlign(endAligned() ? "end" : "start");
	};
	React.useEffect(() => closeBar, [closeBar]);
	// A message that stops offering the bar takes the open one down with it.
	React.useEffect(() => {
		if (!hoverBar) {
			closeBar();
		}
	}, [hoverBar, closeBar]);

	const handleMenuOpenChange = (next: boolean) => {
		if (next && coarsePointer()) {
			// Long press on a touch screen: the full-screen surface replaces the
			// desktop menu. The bubble's rectangle is captured now, while it is
			// still exactly where the finger pressed it.
			const bubble = bubbleElement();
			if (bubble !== null) {
				navigator.vibrate?.(8);
				setPressed({ rect: bubble.getBoundingClientRect(), end: endAligned() });
			}
			return;
		}
		if (next) {
			closeBar();
		}
		setMenuOpen(next);
	};

	return (
		<ContextMenuRoot open={menuOpen} onOpenChange={handleMenuOpenChange}>
			<ContextMenuTrigger
				ref={triggerRef}
				data-slot="chat-message-actions-trigger"
				tabIndex={0}
				onPointerEnter={() => {
					if (finePointer()) {
						openBar();
					}
				}}
				onPointerLeave={scheduleBarClose}
				onFocusCapture={(event) => {
					if (focusVisible(event.target)) {
						openBar();
					}
				}}
				onBlurCapture={(event) => {
					if (
						!(event.relatedTarget instanceof Node) ||
						!event.currentTarget.contains(event.relatedTarget)
					) {
						closeBar();
					}
				}}
				onKeyDown={(event) => {
					if (event.key === "Escape" && barAlign !== null) {
						event.stopPropagation();
						closeBar();
					}
				}}
				// The trigger wraps the bubble, so it must stay transparent to
				// layout. A shrink-to-fit box here becomes the bubble's containing
				// block and makes the bubble's percentage `max-width` cyclic, which
				// Chromium settles below the text's natural width — bubbles collapse
				// to a sliver and wrap per character. Stretching it and aligning
				// inside keeps the percentage resolvable, and keeping it a flex
				// column keeps the bubble's own end-alignment working.
				// The bar is portaled into this trigger, so the message row carries it
				// in the paint order: lifting the row while the bar is open is what
				// keeps it above the neighbouring bubbles it floats over.
				// The context-menu trigger's `select-none` protects the touch
				// long-press from fighting native text selection, but on a mouse it
				// only forbids copying a message — so a fine pointer gets selection
				// back.
				className={cn(
					"relative flex w-full min-w-0 flex-col outline-none pointer-fine:select-text group-data-[align=end]/message:items-end",
					barAlign !== null && "z-50",
					className,
				)}
			>
				{children}
				<ChatMessageHoverBar
					open={barAlign !== null}
					onClose={closeBar}
					anchor={bubbleElement}
					container={triggerRef}
					align={barAlign ?? "start"}
					emojis={emojis}
					activeEmojis={active}
					onReact={onReact}
					reactionsLabel={reactionsLabel}
					actions={actions}
				/>
			</ContextMenuTrigger>
			<ContextMenuContent
				data-slot="chat-message-actions"
				// The emoji row is plain buttons, not menu items, so it doesn't get
				// the item variants' `select-none` — a long-press would select the
				// emoji glyphs instead of pressing them.
				className="min-w-44 select-none p-0"
			>
				{hasReactions && onReact !== undefined && (
					<ChatQuickReactionRow
						emojis={emojis}
						activeEmojis={active}
						// The row is plain buttons, not menu items, so the menu would
						// stay open after the choice — close it like an item would.
						onReact={(emoji) => {
							onReact(emoji);
							setMenuOpen(false);
						}}
						label={reactionsLabel}
						className="border-b px-1.5 py-1.5"
					/>
				)}
				<div className="p-1">{actions}</div>
			</ContextMenuContent>
			<ChatMessagePressSurface
				pressed={pressed}
				onClose={() => setPressed(null)}
				emojis={emojis}
				activeEmojis={active}
				onReact={onReact}
				reactionsLabel={reactionsLabel}
				label={menuLabel}
				actions={actions}
			>
				{children}
			</ChatMessagePressSurface>
		</ContextMenuRoot>
	);
}
