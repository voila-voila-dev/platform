import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { PlusIcon, SmileyIcon } from "@phosphor-icons/react";
import * as React from "react";
import { ChatQuickReactionRow } from "#/chat/components/chat-quick-reaction-row.tsx";
import { ChatMessageActionsHostContext } from "#/chat/context/chat-message-actions-host-context.ts";
import {
	EmojiPicker,
	type EmojiPickerLabels,
} from "#/emoji-picker/components/emoji-picker.tsx";
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
	emojis: ReadonlyArray<string>;
	activeEmojis: ReadonlySet<string>;
	onReact?: (emoji: string) => void;
	reactionsLabel?: string;
	/** The "+" that opens every emoji, and the picker's own copy. */
	emojiPicker?: EmojiPickerLabels & { moreLabel?: string };
	/** The same tree the menu gets; only the actions carrying an icon show. */
	actions?: React.ReactNode;
}

/** What the bar shows: its icons, then the quick emojis, then every emoji. */
type BarStage = "actions" | "reactions" | "picker";

const pill =
	"flex items-center gap-0.5 rounded-full bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";

const iconButton =
	"flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-4";

/**
 * The floating bar a fine pointer summons by hovering a bubble: one smiley,
 * then the actions as icons (copy, edit, delete), each one press away. The
 * smiley opens the quick emojis in place, and their "+" every emoji, searchable.
 *
 * It stays small on purpose. It opens beside the bubble, level with its top,
 * in the empty side of the thread: left of a message of ours, right of one
 * from the other side. A bar wide enough to hold six emojis did not fit there
 * beside a long message, and fell back over the message above, which is the
 * one a reader scrolling up is reading. Right-click still opens the full menu,
 * which is where an action with no icon lives.
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
	emojiPicker,
	actions,
}: Props) {
	const hasReactions = onReact !== undefined && emojis.length > 0;
	const { moreLabel, ...pickerLabels } = emojiPicker ?? {};
	const [stage, setStage] = React.useState<BarStage>("actions");
	React.useEffect(() => {
		if (!open) {
			setStage("actions");
		}
	}, [open]);
	const react = (emoji: string) => {
		onReact?.(emoji);
		onClose();
	};
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
					side={align === "end" ? "left" : "right"}
					align="start"
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
						{stage === "picker" ? (
							<div className="overflow-hidden rounded-xl bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10">
								<EmojiPicker
									onEmojiSelect={react}
									autoFocus
									{...pickerLabels}
								/>
							</div>
						) : stage === "reactions" ? (
							<div className={pill}>
								<ChatQuickReactionRow
									emojis={emojis}
									activeEmojis={activeEmojis}
									label={reactionsLabel}
									onReact={react}
								/>
								<button
									type="button"
									data-slot="chat-message-hover-bar-more"
									aria-label={moreLabel}
									onClick={() => setStage("picker")}
									className={iconButton}
								>
									<PlusIcon />
								</button>
							</div>
						) : (
							<div className={pill}>
								{hasReactions && (
									<button
										type="button"
										data-slot="chat-message-hover-bar-react"
										aria-label={reactionsLabel}
										onClick={() => setStage("reactions")}
										className={iconButton}
									>
										<SmileyIcon />
									</button>
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
