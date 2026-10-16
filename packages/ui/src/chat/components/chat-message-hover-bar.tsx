import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { DotsThreeIcon, SmileyIcon } from "@phosphor-icons/react";
import * as React from "react";
import { ChatQuickReactionRow } from "#/chat/components/chat-quick-reaction-row.tsx";
import { ChatMessageActionsHostContext } from "#/chat/context/chat-message-actions-host-context.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	open: boolean;
	/** Only ever called with `false` — closing is the popover's business. */
	onClose: () => void;
	/** The bubble the bar floats beside. */
	anchor: () => Element | null;
	/** The trigger wrapper the bar portals into, keeping it next in tab order. */
	container: React.RefObject<HTMLDivElement | null>;
	/** The bubble's side of the thread; the bar opens on its other side, in the free space. */
	align: "start" | "end";
	/** No room beside the bubble for the whole bar: start as one button that opens it. */
	compact: boolean;
	emojis: ReadonlyArray<string>;
	activeEmojis: ReadonlySet<string>;
	onReact?: (emoji: string) => void;
	reactionsLabel?: string;
	/** The same tree the menu gets; only the actions carrying an icon show. */
	actions?: React.ReactNode;
}

/**
 * The floating bar a fine pointer summons by hovering a bubble: the one-tap
 * emoji row, then the actions themselves as icons.
 *
 * The actions are inline rather than behind a "…" because the bar exists to
 * save a click, and a menu that opens a menu saves none — copy, edit and
 * delete are one press each here. Right-click still opens the full menu, which
 * is where an action with no icon lives.
 *
 * It opens beside the bubble, level with its top: to the left of a message
 * of ours, to the right of one from the other side, in the empty part of the
 * thread. Above the bubble it covered the message before, which is the one a
 * reader scrolling back up is reading. Beside a bubble too wide to leave room
 * for the whole bar, it starts as a single button, and only a click on it
 * opens the bar, above the bubble: covering a message is then something the
 * reader asked for.
 *
 * Portaled into the trigger itself so it sits right after the bubble in the
 * DOM and a keyboard reaches it with Tab; the positioner still flips and
 * shifts to stay in the viewport.
 */
export function ChatMessageHoverBar({
	open,
	onClose,
	anchor,
	container,
	align,
	compact,
	emojis,
	activeEmojis,
	onReact,
	reactionsLabel,
	actions,
}: Props) {
	const hasReactions = onReact !== undefined && emojis.length > 0;
	const [expanded, setExpanded] = React.useState(false);
	React.useEffect(() => {
		if (!open) {
			setExpanded(false);
		}
	}, [open]);
	const folded = compact && !expanded;
	const above = compact && expanded;
	return (
		<PopoverPrimitive.Root
			open={open}
			onOpenChange={(next) => {
				if (!next) {
					onClose();
				}
			}}
		>
			<PopoverPrimitive.Portal container={container}>
				<PopoverPrimitive.Positioner
					anchor={anchor}
					side={above ? "top" : align === "end" ? "left" : "right"}
					align={above ? align : "start"}
					collisionAvoidance={{
						side: "flip",
						align: "shift",
						fallbackAxisSide: "start",
					}}
					// No gap: the popup carries the visual offset as padding instead,
					// so its hit area touches the bubble. A real gap is a dead strip
					// the pointer has to cross, and on the fallback above the bubble
					// that strip belongs to the message above — which would open
					// *its* bar and close the one the reader was reaching for.
					sideOffset={0}
					collisionPadding={8}
					// Above every bubble in the thread, including the messages the bar
					// floats over.
					className="z-50"
				>
					<PopoverPrimitive.Popup
						data-slot="chat-message-hover-bar"
						initialFocus={false}
						finalFocus={false}
						className={cn(
							"data-[side=left]:pr-1.5 data-[side=right]:pl-1.5 data-[side=top]:pb-1.5 data-[side=bottom]:pt-1.5",
							"data-[side=left]:data-open:slide-in-from-right-1 data-[side=right]:data-open:slide-in-from-left-1 data-[side=top]:data-open:slide-in-from-bottom-1 data-[side=bottom]:data-open:slide-in-from-top-1",
							"data-open:fade-in-0 data-closed:fade-out-0 data-open:animate-in data-closed:animate-out duration-150 motion-reduce:animate-none",
						)}
					>
						{folded ? (
							<button
								type="button"
								data-slot="chat-message-hover-bar-open"
								aria-label={reactionsLabel}
								onClick={() => setExpanded(true)}
								className="flex size-8 items-center justify-center rounded-full bg-popover text-muted-foreground shadow-md ring-1 ring-foreground/10 transition-colors hover:text-foreground"
							>
								{hasReactions ? (
									<SmileyIcon className="size-4" />
								) : (
									<DotsThreeIcon className="size-4" />
								)}
							</button>
						) : (
							<div className="flex items-center gap-0.5 rounded-full bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10">
								{hasReactions && (
									<ChatQuickReactionRow
										emojis={emojis}
										activeEmojis={activeEmojis}
										label={reactionsLabel}
										onReact={(emoji) => {
											onReact(emoji);
											onClose();
										}}
									/>
								)}
								{hasReactions && actions !== undefined && (
									<div aria-hidden className="h-5 w-px bg-border" />
								)}
								<ChatMessageActionsHostContext.Provider
									value={{ host: "bar", close: onClose }}
								>
									{actions}
								</ChatMessageActionsHostContext.Provider>
							</div>
						)}
					</PopoverPrimitive.Popup>
				</PopoverPrimitive.Positioner>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}
