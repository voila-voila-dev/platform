import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import type * as React from "react";
import { ChatQuickReactionRow } from "#/chat/components/chat-quick-reaction-row.tsx";
import { ChatMessageActionsHostContext } from "#/chat/context/chat-message-actions-host-context.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	open: boolean;
	/** Only ever called with `false` — closing is the popover's business. */
	onClose: () => void;
	/** The bubble the bar floats above. */
	anchor: () => Element | null;
	/** The trigger wrapper the bar portals into, keeping it next in tab order. */
	container: React.RefObject<HTMLDivElement | null>;
	/** Same side as the bubble, so the bar overflows toward the thread. */
	align: "start" | "end";
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
	emojis,
	activeEmojis,
	onReact,
	reactionsLabel,
	actions,
}: Props) {
	const hasReactions = onReact !== undefined && emojis.length > 0;
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
					side="top"
					align={align}
					// No gap: the popup carries the visual offset as padding instead,
					// so its hit area touches the bubble. A real gap is a dead strip
					// the pointer has to cross on its way up, and that strip belongs
					// to the message above — which would open *its* bar and close the
					// one the reader was reaching for.
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
							"pb-1.5",
							"data-open:fade-in-0 data-open:slide-in-from-bottom-1 data-closed:fade-out-0 data-open:animate-in data-closed:animate-out duration-150 motion-reduce:animate-none",
						)}
					>
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
					</PopoverPrimitive.Popup>
				</PopoverPrimitive.Positioner>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	);
}
