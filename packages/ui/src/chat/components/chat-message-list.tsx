import { ArrowDownIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";

/** How close to the bottom (px) still counts as "following the conversation". */
const FOLLOW_THRESHOLD = 48;

// Chromium/Firefox keep prepended history visually in place via native scroll
// anchoring (`overflow-anchor`); Safari does not, so the list compensates for
// prepends manually there (see the layout effect below).
const supportsScrollAnchoring = (() => {
	try {
		return CSS.supports("overflow-anchor: auto");
	} catch {
		return false;
	}
})();

interface Props extends React.ComponentProps<"div"> {
	/** Pinned above the messages inside the scroll area (e.g. "load older"). */
	header?: React.ReactNode;
	/**
	 * Fired when the reader starts or stops following the bottom of the thread.
	 * Lets consumers react to the internal follow state (analytics, unread
	 * markers, …) beyond the built-in jump-to-latest affordance.
	 */
	onFollowChange?: (following: boolean) => void;
	/** How close to the bottom (px) still counts as "following". */
	followThreshold?: number;
	/**
	 * Label for the floating "jump to latest ↓" button shown while the reader
	 * is away from the bottom and new content may arrive. Omit to disable the
	 * affordance.
	 */
	jumpToLatestLabel?: React.ReactNode;
}

export function ChatMessageList({
	header,
	onFollowChange,
	followThreshold = FOLLOW_THRESHOLD,
	jumpToLatestLabel,
	className,
	children,
	...props
}: Props) {
	const scrollRef = React.useRef<HTMLDivElement>(null);
	// Follow the bottom while the reader is there; never yank them up while they
	// are reading history.
	const followingRef = React.useRef(true);
	// Land instantly on the latest message on first mount; smooth-scroll appends
	// afterwards while the reader is following along.
	const hasMountedRef = React.useRef(false);
	const lastScrollHeightRef = React.useRef(0);
	const lastMessageElementRef = React.useRef<Element | null>(null);
	// Mirrors followingRef so the jump-to-latest button can render off it.
	const [following, setFollowing] = React.useState(true);

	// `children` is the trigger (content changed), not a value read inside.
	React.useLayoutEffect(() => {
		const node = scrollRef.current;
		if (node === null) {
			return;
		}
		const previousScrollHeight = lastScrollHeightRef.current;
		const previousLastMessage = lastMessageElementRef.current;
		lastScrollHeightRef.current = node.scrollHeight;
		lastMessageElementRef.current = lastMessageElement(node);
		if (followingRef.current) {
			scrollFollowingReaderToLatest(node, {
				hasMounted: hasMountedRef.current,
				previousScrollHeight,
			});
			hasMountedRef.current = true;
			return;
		}
		hasMountedRef.current = true;
		// Reading history: keep the viewport where it is.
		compensateForPrepend(node, {
			previousScrollHeight,
			previousLastMessage,
			currentLastMessage: lastMessageElementRef.current,
		});
	}, [children]);

	return (
		<div
			ref={scrollRef}
			data-slot="chat-message-list"
			// New messages are announced politely to screen readers.
			role="log"
			aria-live="polite"
			onScroll={(scrollEvent) => {
				const node = scrollEvent.currentTarget;
				const nextFollowing =
					node.scrollHeight - node.scrollTop - node.clientHeight <
					followThreshold;
				if (nextFollowing !== followingRef.current) {
					followingRef.current = nextFollowing;
					setFollowing(nextFollowing);
					onFollowChange?.(nextFollowing);
				}
			}}
			className={cn(
				"flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 dark:scheme-dark",
				className,
			)}
			{...props}
		>
			{header}
			{children}
			{jumpToLatestLabel !== undefined && !following ? (
				<div
					data-slot="chat-jump-to-latest"
					className="pointer-events-none sticky bottom-2 z-10 flex justify-center"
				>
					<Button
						type="button"
						size="sm"
						variant="outline"
						className="pointer-events-auto rounded-full shadow-md"
						onClick={() => {
							const node = scrollRef.current;
							if (node === null) {
								return;
							}
							followingRef.current = true;
							setFollowing(true);
							onFollowChange?.(true);
							// Instant (not smooth) so the follow state settles in one
							// step instead of flickering through scroll events.
							node.scrollTop = node.scrollHeight;
						}}
					>
						<ArrowDownIcon />
						{jumpToLatestLabel}
					</Button>
				</div>
			) : null}
		</div>
	);
}

/**
 * Without native scroll anchoring (Safari) a prepend would jump the viewport
 * while the reader is in history, so compensate by the height delta.
 */
function compensateForPrepend(
	node: HTMLDivElement,
	input: {
		previousScrollHeight: number;
		previousLastMessage: Element | null;
		currentLastMessage: Element | null;
	},
): void {
	if (supportsScrollAnchoring) {
		return;
	}
	if (!grewByPrepend(node, input)) {
		return;
	}
	node.scrollTop += node.scrollHeight - input.previousScrollHeight;
}

/** The last message element, ignoring the floating jump-to-latest overlay. */
function lastMessageElement(node: HTMLDivElement): Element | null {
	let element = node.lastElementChild;
	if (element?.getAttribute("data-slot") === "chat-jump-to-latest") {
		element = element.previousElementSibling;
	}
	return element;
}

/**
 * Keeps a following reader pinned to the latest message: instantly on first
 * mount, smooth-scrolling afterwards (where supported), and not at all when
 * the content did not grow.
 */
function scrollFollowingReaderToLatest(
	node: HTMLDivElement,
	input: { hasMounted: boolean; previousScrollHeight: number },
): void {
	if (!input.hasMounted) {
		node.scrollTop = node.scrollHeight;
		return;
	}
	// Parent re-rendered without the content growing: nothing to scroll.
	if (node.scrollHeight === input.previousScrollHeight) {
		return;
	}
	if (typeof node.scrollTo === "function") {
		node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
		return;
	}
	node.scrollTop = node.scrollHeight;
}

/**
 * A prepend (load-older) keeps the last message's DOM node and only grows
 * content above it.
 */
function grewByPrepend(
	node: HTMLDivElement,
	input: {
		previousScrollHeight: number;
		previousLastMessage: Element | null;
		currentLastMessage: Element | null;
	},
): boolean {
	if (input.previousLastMessage === null) {
		return false;
	}
	if (input.currentLastMessage !== input.previousLastMessage) {
		return false;
	}
	return node.scrollHeight > input.previousScrollHeight;
}
