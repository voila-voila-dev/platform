import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import * as React from "react";
import { ChatQuickReactionRow } from "#/chat/components/chat-quick-reaction-row.tsx";
import { ChatMessageActionsHostContext } from "#/chat/context/chat-message-actions-host-context.ts";
import { cn } from "#/lib/utils.ts";

/** Room the emoji row needs above the bubble before it falls back below. */
const REACTION_ROW_SPACE = 64;
/**
 * The smallest actions card worth giving its own side of the bubble. Below
 * this the card would scroll from the first item, and stacking it with the
 * emoji row on the roomier side reads better than a two-line scroller.
 */
const MIN_ACTIONS_SPACE = 132;
/** Breathing room between the bubble and the floating blocks. */
const GAP = 10;
/** Minimum inset from the viewport edges. */
const EDGE = 12;

export interface ChatPressedMessage {
	/** Where the pressed bubble sits, in viewport coordinates. */
	rect: {
		top: number;
		left: number;
		right: number;
		bottom: number;
		width: number;
	};
	/** Whether the message sits on the reader's own (end) side of the thread. */
	end: boolean;
}

interface Props {
	pressed: ChatPressedMessage | null;
	onClose: () => void;
	emojis: ReadonlyArray<string>;
	activeEmojis: ReadonlySet<string>;
	onReact?: (emoji: string) => void;
	reactionsLabel?: string;
	/** Accessible name of the surface itself. */
	label?: string;
	actions?: React.ReactNode;
	/** The bubble to lift above the veil — the same children the menu wraps. */
	children: React.ReactNode;
}

/** Where the two floating blocks land relative to the pressed bubble. */
interface Placement {
	readonly reactionsAbove: boolean;
	readonly actionsAbove: boolean;
	/** The card had to join the emoji row rather than take the other side. */
	readonly actionsShareSide: boolean;
	/** Vertical room the card may use once its side is settled. */
	readonly actionsRoom: number;
}

/**
 * Reactions over the message, menu under it — the arrangement every chat app
 * uses, and the one a thumb reaches for.
 *
 * The emoji row picks its side first, because it is the one that has to hug
 * the bubble to read as belonging to it; above unless the bubble sits too
 * close to the top. The card then takes the opposite side, and only falls back
 * to sharing the row's side when the other one is too short to be worth
 * reading — near the bottom of the screen, both end up above.
 */
function placeBlocks(input: {
	roomAbove: number;
	roomBelow: number;
	hasReactionRow: boolean;
}): Placement {
	const { roomAbove, roomBelow, hasReactionRow } = input;

	// No emoji row: the card simply takes the side it fits on, preferring below.
	if (!hasReactionRow) {
		const above = roomBelow < MIN_ACTIONS_SPACE && roomAbove > roomBelow;
		return {
			reactionsAbove: false,
			actionsAbove: above,
			actionsShareSide: false,
			actionsRoom: above ? roomAbove : roomBelow,
		};
	}

	const reactionsAbove = roomAbove >= REACTION_ROW_SPACE;
	const oppositeRoom = reactionsAbove ? roomBelow : roomAbove;
	if (oppositeRoom >= MIN_ACTIONS_SPACE) {
		return {
			reactionsAbove,
			actionsAbove: !reactionsAbove,
			actionsShareSide: false,
			actionsRoom: oppositeRoom,
		};
	}

	const sharedRoom =
		(reactionsAbove ? roomAbove : roomBelow) - REACTION_ROW_SPACE - GAP;
	return {
		reactionsAbove,
		actionsAbove: reactionsAbove,
		actionsShareSide: true,
		actionsRoom: sharedRoom,
	};
}

/**
 * The long-press surface of a touch screen: the thread dims and blurs, the
 * pressed bubble stays put above the veil, the one-tap emoji row lands over
 * it and the message actions under it — see {@link placeBlocks} for what
 * happens when a screen edge gets in the way.
 */
export function ChatMessagePressSurface({
	pressed,
	onClose,
	emojis,
	activeEmojis,
	onReact,
	reactionsLabel,
	label,
	actions,
	children,
}: Props) {
	// The last press is kept so the layout survives while the exit animation
	// plays after `pressed` goes back to null.
	const lastPressedRef = React.useRef<ChatPressedMessage | null>(null);
	if (pressed !== null) {
		lastPressedRef.current = pressed;
	}
	const shown = pressed ?? lastPressedRef.current;
	if (shown === null) {
		return null;
	}

	const { rect, end } = shown;
	const viewportHeight = window.innerHeight;
	const placement = placeBlocks({
		roomAbove: rect.top - GAP - EDGE,
		roomBelow: viewportHeight - rect.bottom - GAP - EDGE,
		hasReactionRow: onReact !== undefined && emojis.length > 0,
	});

	const horizontal: React.CSSProperties = end
		? { right: Math.max(EDGE, window.innerWidth - rect.right) }
		: { left: Math.max(EDGE, rect.left) };
	const slot = (topSide: boolean): React.CSSProperties =>
		topSide
			? { ...horizontal, bottom: viewportHeight - rect.top + GAP }
			: { ...horizontal, top: rect.bottom + GAP };

	const reactionRow =
		onReact !== undefined && emojis.length > 0 ? (
			<ChatQuickReactionRow
				emojis={emojis}
				activeEmojis={activeEmojis}
				label={reactionsLabel}
				stagger
				onReact={(emoji) => {
					onReact(emoji);
					onClose();
				}}
				className="w-fit rounded-full bg-popover p-1 shadow-lg ring-1 ring-foreground/10"
			/>
		) : null;

	const actionsCard =
		actions === undefined ? null : (
			<div
				data-slot="chat-message-actions"
				className="min-w-52 overflow-y-auto rounded-xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10"
				style={{ maxHeight: Math.max(120, placement.actionsRoom) }}
			>
				<ChatMessageActionsHostContext.Provider
					value={{ host: "surface", close: onClose }}
				>
					{actions}
				</ChatMessageActionsHostContext.Provider>
			</div>
		);

	return (
		<DialogPrimitive.Root
			open={pressed !== null}
			onOpenChange={(next) => {
				if (!next) {
					onClose();
				}
			}}
		>
			<DialogPrimitive.Portal>
				<DialogPrimitive.Backdrop
					data-slot="chat-message-press-surface-backdrop"
					className={cn(
						"fixed inset-0 z-50 bg-black/40 backdrop-blur-md",
						"transition-[backdrop-filter,background-color] duration-200 starting:bg-transparent starting:backdrop-blur-none",
						"data-closed:fade-out-0 data-closed:animate-out motion-reduce:transition-none motion-reduce:data-closed:animate-none",
					)}
				/>
				<DialogPrimitive.Popup
					data-slot="chat-message-press-surface"
					aria-label={label}
					// `select-none` on the whole surface: the finger is still down when
					// it opens, and iOS would otherwise start selecting the emoji row
					// or the action labels instead of pressing them.
					className={cn(
						"fixed inset-0 z-50 select-none outline-hidden",
						"data-open:fade-in-0 data-closed:fade-out-0 data-open:animate-in data-closed:animate-out duration-200 motion-reduce:animate-none",
					)}
					onClick={(event) => {
						if (event.target === event.currentTarget) {
							onClose();
						}
					}}
				>
					{/* The pressed bubble, lifted above the veil at its own position.
					    A visual copy only: the live one stays in the thread under the
					    blur, so nothing moves when the surface closes. */}
					<div
						aria-hidden
						className={cn(
							"pointer-events-none fixed select-none drop-shadow-xl",
							"zoom-in-95 fade-in-50 animate-in duration-200 motion-reduce:animate-none",
							"[&_[data-slot=chat-bubble]]:w-full [&_[data-slot=chat-bubble]]:max-w-full",
						)}
						style={{ top: rect.top, left: rect.left, width: rect.width }}
					>
						{children}
					</div>
					{reactionRow !== null && (
						<div
							className={cn(
								"absolute flex flex-col gap-2.5",
								end ? "items-end" : "items-start",
							)}
							style={slot(placement.reactionsAbove)}
						>
							{/* Shared only when the opposite side was too short. The emoji
							    row still hugs the message, so the card goes above it above
							    the bubble and below it below the bubble. */}
							{placement.actionsShareSide &&
								placement.reactionsAbove &&
								actionsCard}
							{reactionRow}
							{placement.actionsShareSide &&
								!placement.reactionsAbove &&
								actionsCard}
						</div>
					)}
					{!placement.actionsShareSide && actionsCard !== null && (
						<div
							className={cn(
								"absolute flex flex-col",
								end ? "items-end" : "items-start",
							)}
							style={slot(placement.actionsAbove)}
						>
							{actionsCard}
						</div>
					)}
				</DialogPrimitive.Popup>
			</DialogPrimitive.Portal>
		</DialogPrimitive.Root>
	);
}
