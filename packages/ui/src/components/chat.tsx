import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ArrowDownIcon, PaperPlaneRightIcon } from "@phosphor-icons/react";
import * as React from "react";
import { Badge } from "#/components/badge.tsx";
import { Button } from "#/components/button.tsx";
import { ConfirmDialog } from "#/components/confirm-dialog.tsx";
import { Spinner } from "#/components/spinner.tsx";
import { Textarea } from "#/components/textarea.tsx";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Chat primitives. Purely presentational: every string (labels, names,
 * placeholders) comes in via props so the kit stays i18n- and domain-agnostic.
 *
 * Composition:
 *   <ChatMessageList header={loadOlderButton} jumpToLatestLabel="Nouveaux messages">
 *     <ChatDateSeparator>Today</ChatDateSeparator>
 *     <ChatMessageGroup align="start">
 *       <ChatMessageSender avatar={…} name="Jeanne D." badge={<Badge>…</Badge>} />
 *       <ChatMessage variant="other">Bonjour !<ChatMessageTime dateTime="2026-06-12T09:12">09:12</ChatMessageTime></ChatMessage>
 *     </ChatMessageGroup>
 *     <ChatUnreadSeparator>Nouveaux messages</ChatUnreadSeparator>
 *     <ChatMessageGroup align="end">
 *       <ChatMessage variant="own">Salut !<ChatMessageTime>09:13</ChatMessageTime></ChatMessage>
 *     </ChatMessageGroup>
 *   </ChatMessageList>
 *   <ChatComposer … />
 */

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

function ChatMessageList({
	header,
	onFollowChange,
	followThreshold = FOLLOW_THRESHOLD,
	jumpToLatestLabel,
	className,
	children,
	...props
}: React.ComponentProps<"div"> & {
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
}) {
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

function ChatDateSeparator({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="chat-date-separator"
			role="separator"
			className={cn(
				"flex items-center gap-3 py-1 text-xs text-muted-foreground",
				"before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

/**
 * "New messages" rule shown when opening a thread with unread messages.
 * Same anatomy as ChatDateSeparator, in the destructive accent.
 */
function ChatUnreadSeparator({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="chat-unread-separator"
			role="separator"
			className={cn(
				"flex items-center gap-3 py-1 font-medium text-destructive text-xs",
				"before:h-px before:flex-1 before:bg-destructive/40 after:h-px after:flex-1 after:bg-destructive/40",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

function ChatMessageGroup({
	align,
	className,
	...props
}: React.ComponentProps<"div"> & { align: "start" | "end" }) {
	return (
		<div
			data-slot="chat-message-group"
			data-align={align}
			className={cn(
				// `group` so descendants (e.g. ChatMessageTime) can react to the
				// group's `data-align` via `group-data-[align=end]:*`.
				"group flex flex-col gap-1",
				align === "end" ? "items-end" : "items-start",
				className,
			)}
			{...props}
		/>
	);
}

function ChatMessageSender({
	avatar,
	name,
	badge,
	className,
	...props
}: React.ComponentProps<"div"> & {
	avatar?: React.ReactNode;
	name: React.ReactNode;
	badge?: React.ReactNode;
}) {
	return (
		<div
			data-slot="chat-message-sender"
			className={cn("flex items-center gap-1.5 pt-1", className)}
			{...props}
		>
			{avatar}
			<span className="font-medium text-foreground text-xs">{name}</span>
			{badge}
		</div>
	);
}

const chatMessageVariants = cva({
	// `min-w-0` + `overflow-wrap:anywhere` keep an unbroken word/URL inside the
	// bubble instead of overflowing the whole list horizontally.
	// Subtle enter animation for appended messages; respect reduced-motion.
	// Content stays left-aligned in both variants so short messages read from the
	// left edge of the bubble; the bubble itself is aligned end/start by the
	// enclosing `ChatMessageGroup`.
	base: "flex min-w-0 max-w-[85%] flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap [overflow-wrap:anywhere] animate-in fade-in slide-in-from-bottom-1 motion-reduce:animate-none sm:max-w-[75%]",
	variants: {
		variant: {
			own: "rounded-br-sm bg-primary text-primary-foreground",
			other: "rounded-bl-sm bg-muted text-foreground",
		},
	},
});

function ChatMessage({
	variant,
	className,
	...props
}: React.ComponentProps<"div"> &
	Required<Pick<VariantProps<typeof chatMessageVariants>, "variant">>) {
	return (
		<div
			data-slot="chat-message"
			data-variant={variant}
			className={cn(chatMessageVariants({ variant, className }))}
			{...props}
		/>
	);
}

const CHAT_LINK_PATTERN = /https?:\/\/[^\s<>"']+/g;

/**
 * Message body for plain text that may contain URLs: each URL becomes a link
 * opening in a new tab. Pass `onLinkClick` to intercept activation instead —
 * typically to confirm leaving the site via `ChatExternalLinkDialog`.
 */
function ChatMessageText({
	children,
	onLinkClick,
	className,
	...props
}: Omit<React.ComponentProps<"span">, "children"> & {
	children: string;
	onLinkClick?: (url: string) => void;
}) {
	const nodes: React.ReactNode[] = [];
	let lastIndex = 0;
	for (const match of children.matchAll(CHAT_LINK_PATTERN)) {
		// Trailing punctuation belongs to the sentence, not the URL.
		const url = match[0].replace(/[.,;:!?)\]]+$/, "");
		if (match.index > lastIndex) {
			nodes.push(children.slice(lastIndex, match.index));
		}
		nodes.push(
			<a
				key={`${match.index}-${url}`}
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="underline underline-offset-2 hover:opacity-80"
				onClick={(clickEvent) => {
					if (onLinkClick === undefined) {
						return;
					}
					clickEvent.preventDefault();
					onLinkClick(url);
				}}
			>
				{url}
			</a>,
		);
		lastIndex = match.index + url.length;
	}
	if (lastIndex < children.length) {
		nodes.push(children.slice(lastIndex));
	}
	return (
		// A single wrapping element so the linkified fragments stay one inline
		// flow inside the bubble's flex column.
		<span data-slot="chat-message-text" className={className} {...props}>
			{nodes}
		</span>
	);
}

/**
 * "You are about to leave the site" confirmation for external links. Open it
 * by setting `url` (typically from `ChatMessageText`'s `onLinkClick`); on
 * confirm the URL opens in a new tab. Purely presentational: all labels come
 * in via props.
 */
function ChatExternalLinkDialog({
	url,
	onClose,
	title,
	description,
	confirmLabel,
	cancelLabel,
}: {
	/** The pending external URL; `null` keeps the dialog closed. */
	url: string | null;
	onClose: () => void;
	title: React.ReactNode;
	/** Warning copy shown above the URL, e.g. "Do you trust this link?". */
	description?: React.ReactNode;
	confirmLabel: React.ReactNode;
	cancelLabel: React.ReactNode;
}) {
	return (
		<ConfirmDialog
			open={url !== null}
			onOpenChange={(open) => {
				if (!open) {
					onClose();
				}
			}}
			title={title}
			description={
				<>
					{description}
					<span
						data-slot="chat-external-link-url"
						className="mt-2 block break-all rounded-md bg-muted px-2 py-1 font-mono text-foreground text-xs"
					>
						{url}
					</span>
				</>
			}
			confirmLabel={confirmLabel}
			cancelLabel={cancelLabel}
			onConfirm={() => {
				if (url !== null) {
					window.open(url, "_blank", "noopener,noreferrer");
				}
				return undefined;
			}}
		/>
	);
}

function ChatMessageTime({
	className,
	...props
}: React.ComponentProps<"time">) {
	return (
		<time
			data-slot="chat-message-time"
			className={cn(
				"select-none text-xs opacity-70 group-data-[align=end]:text-primary-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/**
 * The Enter-key send policy: Cmd/Ctrl+Enter always sends, a plain Enter sends
 * only under `submitOnEnter` (Shift+Enter still inserts a newline), and an
 * Enter that confirms an IME composition (Japanese, Chinese, dead keys…) never
 * sends the message.
 */
function isSubmitKey(
	keyEvent: React.KeyboardEvent<HTMLTextAreaElement>,
	submitOnEnter: boolean,
): boolean {
	if (keyEvent.key !== "Enter" || keyEvent.nativeEvent.isComposing) {
		return false;
	}
	const withModifier = keyEvent.metaKey || keyEvent.ctrlKey;
	const plainEnterSends = submitOnEnter && !keyEvent.shiftKey;
	return withModifier || plainEnterSends;
}

/** The composer's growing textarea beside its inline send button. */
function ChatComposerInput({
	value,
	onValueChange,
	onSubmit,
	placeholder,
	disabled,
	sending,
	submitOnEnter,
	canSend,
	invalid,
	describedBy,
	sendLabel,
}: {
	value: string;
	onValueChange: (value: string) => void;
	onSubmit: () => void;
	placeholder: string | undefined;
	disabled: boolean;
	sending: boolean;
	submitOnEnter: boolean;
	canSend: boolean;
	invalid: boolean;
	describedBy: string | undefined;
	sendLabel: string;
}) {
	return (
		<div className="flex items-end gap-2">
			<Textarea
				value={value}
				onChange={(changeEvent) => onValueChange(changeEvent.target.value)}
				onKeyDown={(keyEvent) => {
					if (!isSubmitKey(keyEvent, submitOnEnter)) {
						return;
					}
					keyEvent.preventDefault();
					if (canSend) {
						onSubmit();
					}
				}}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={invalid ? true : undefined}
				aria-describedby={describedBy}
				className="max-h-40 min-h-10 flex-1 resize-none"
			/>
			{/* Inline circular send button, bottom-aligned so it stays put as the
			    textarea grows. The visible label is dropped for the icon-only
			    affordance but preserved as the accessible name. */}
			<Button
				type="submit"
				size="icon"
				disabled={!canSend}
				aria-label={sendLabel}
				className="size-9 rounded-full"
			>
				{sending ? <Spinner /> : <PaperPlaneRightIcon />}
			</Button>
		</div>
	);
}

/** The composer's optional hint + character counter row. */
function ChatComposerFooter({
	hint,
	length,
	maxLength,
	overLimit,
}: {
	hint: React.ReactNode;
	length: number;
	maxLength: number | undefined;
	overLimit: boolean;
}) {
	const hasHint = hint !== undefined && hint !== null;
	if (!hasHint && maxLength === undefined) {
		return null;
	}
	return (
		<div className="flex items-center justify-between gap-2">
			{hasHint ? (
				<span
					data-slot="chat-composer-hint"
					className="min-w-0 truncate text-xs text-muted-foreground"
				>
					{hint}
				</span>
			) : null}
			{maxLength !== undefined ? (
				<span
					data-slot="chat-composer-counter"
					className={cn(
						"ml-auto shrink-0 text-xs tabular-nums",
						overLimit ? "text-destructive" : "text-muted-foreground",
					)}
				>
					{length}/{maxLength}
				</span>
			) : null}
		</div>
	);
}

function ChatComposer({
	value,
	onValueChange,
	onSubmit,
	placeholder,
	disabled = false,
	sending = false,
	submitOnEnter = false,
	maxLength,
	sendLabel,
	error,
	hint,
	className,
	...props
}: Omit<React.ComponentProps<"form">, "onSubmit"> & {
	value: string;
	onValueChange: (value: string) => void;
	/** Fired on send button click, on (Cmd|Ctrl)+Enter, and — when
	 * `submitOnEnter` is set — on plain Enter. */
	onSubmit: () => void;
	placeholder?: string;
	/** Composer unusable (e.g. archived conversation). */
	disabled?: boolean;
	/**
	 * A post is in flight: button shows a spinner, submit is suppressed. The
	 * textarea stays enabled so the writer keeps focus and can draft the next
	 * message.
	 */
	sending?: boolean;
	/**
	 * Send on a plain Enter (Shift+Enter still inserts a newline), matching the
	 * mobile/messenger convention. Cmd/Ctrl+Enter always sends regardless.
	 */
	submitOnEnter?: boolean;
	/**
	 * Soft character limit: shows a live counter and disables send once
	 * exceeded. The textarea itself is not capped so the writer can trim an
	 * over-long draft instead of having input silently dropped.
	 */
	maxLength?: number;
	sendLabel: string;
	error?: React.ReactNode;
	hint?: React.ReactNode;
}) {
	const errorId = React.useId();
	const hasError = error !== undefined && error !== null;
	const overLimit = maxLength !== undefined && value.length > maxLength;
	const canSend =
		!disabled && !sending && !overLimit && value.trim().length > 0;

	return (
		<form
			data-slot="chat-composer"
			onSubmit={(formEvent) => {
				formEvent.preventDefault();
				if (canSend) {
					onSubmit();
				}
			}}
			className={cn("flex flex-col gap-2", className)}
			{...props}
		>
			<ChatComposerInput
				value={value}
				onValueChange={onValueChange}
				onSubmit={onSubmit}
				placeholder={placeholder}
				disabled={disabled}
				sending={sending}
				submitOnEnter={submitOnEnter}
				canSend={canSend}
				invalid={hasError || overLimit}
				describedBy={hasError ? errorId : undefined}
				sendLabel={sendLabel}
			/>
			{hasError ? (
				<p id={errorId} role="alert" className="text-xs text-destructive">
					{error}
				</p>
			) : null}
			<ChatComposerFooter
				hint={hint}
				length={value.length}
				maxLength={maxLength}
				overLimit={overLimit}
			/>
		</form>
	);
}

/**
 * A row in a conversation list. Polymorphic via `render`: pass
 * `render={<a/>}` or `render={<button/>}` to make the row a real link/button.
 * The default `div` is inert and intentionally carries no hover/focus
 * affordances — those only apply once `render` supplies an interactive
 * element.
 */
function ChatConversationItem({
	title,
	description,
	timestamp,
	unreadCount = 0,
	unreadLabel,
	badges,
	leading,
	className,
	render,
	...props
}: useRender.ComponentProps<"div"> & {
	title: React.ReactNode;
	/** Secondary line: last-message preview or "no messages yet" copy. */
	description?: React.ReactNode;
	timestamp?: React.ReactNode;
	/** Messages the reader has not seen; > 0 bolds the row and shows a count. */
	unreadCount?: number;
	/**
	 * Accessible label for the unread badge (the visible glyph is a bare count,
	 * capped at "99+"). Spell out the true total here, e.g. "3 unread messages",
	 * so screen readers don't announce a contextless number.
	 */
	unreadLabel?: string;
	/** Subject/status badges, rendered after the title. */
	badges?: React.ReactNode;
	/** Leading visual (typically an avatar), rendered before the text column. */
	leading?: React.ReactNode;
}) {
	const unread = unreadCount > 0;
	const interactive = render !== undefined;
	return useRender({
		defaultTagName: "div",
		props: mergeProps<"div">(
			{
				className: cn(
					"group/chat-conversation-item flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm outline-none",
					interactive &&
						"transition-colors duration-100 hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
					className,
				),
				children: (
					<>
						{leading}
						<ChatConversationItemText
							title={title}
							description={description}
							badges={badges}
							unread={unread}
						/>
						<ChatConversationItemMeta
							timestamp={timestamp}
							unread={unread}
							unreadCount={unreadCount}
							unreadLabel={unreadLabel}
						/>
					</>
				),
			},
			props,
		),
		render,
		state: {
			slot: "chat-conversation-item",
			unread,
		},
	});
}

/** The row's text column: title with trailing badges, then the description. */
function ChatConversationItemText({
	title,
	description,
	badges,
	unread,
}: {
	title: React.ReactNode;
	description?: React.ReactNode;
	badges?: React.ReactNode;
	unread: boolean;
}) {
	return (
		<div className="flex min-w-0 flex-1 flex-col gap-0.5">
			{/* Wrap so badges drop below the title instead of overflowing
			    onto the timestamp column when space runs out. */}
			<div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
				<span
					className={cn("truncate", unread ? "font-semibold" : "font-medium")}
				>
					{title}
				</span>
				{badges}
			</div>
			{description !== undefined && description !== null ? (
				<span className="truncate text-xs text-muted-foreground">
					{description}
				</span>
			) : null}
		</div>
	);
}

/** The row's trailing column: timestamp over the unread badge. */
function ChatConversationItemMeta({
	timestamp,
	unread,
	unreadCount,
	unreadLabel,
}: {
	timestamp?: React.ReactNode;
	unread: boolean;
	unreadCount: number;
	unreadLabel?: string;
}) {
	return (
		// Top-align the meta column so timestamps line up across rows whether or
		// not an unread badge sits below them.
		<div className="flex shrink-0 flex-col items-end gap-1 self-start">
			<ChatConversationItemTimestamp timestamp={timestamp} unread={unread} />
			{unread ? (
				<ChatConversationItemUnreadBadge
					unreadCount={unreadCount}
					unreadLabel={unreadLabel}
				/>
			) : null}
		</div>
	);
}

function ChatConversationItemTimestamp({
	timestamp,
	unread,
}: {
	timestamp?: React.ReactNode;
	unread: boolean;
}) {
	if (timestamp === undefined || timestamp === null) {
		return null;
	}
	return (
		<span
			className={cn(
				"text-xs",
				unread ? "font-medium text-primary" : "text-muted-foreground",
			)}
		>
			{timestamp}
		</span>
	);
}

function ChatConversationItemUnreadBadge({
	unreadCount,
	unreadLabel,
}: {
	unreadCount: number;
	unreadLabel?: string;
}) {
	return (
		<Badge
			// Labeled graphic so screen readers announce the true count with
			// context ("3 unread messages") rather than the bare, possibly-capped
			// ("99+") glyph.
			role={unreadLabel === undefined ? undefined : "img"}
			aria-label={unreadLabel}
			className="h-5 min-w-5 justify-center rounded-full px-1.5 tabular-nums"
		>
			{unreadCount > 99 ? "99+" : unreadCount}
		</Badge>
	);
}

export {
	ChatComposer,
	ChatConversationItem,
	ChatDateSeparator,
	ChatExternalLinkDialog,
	ChatMessage,
	ChatMessageGroup,
	ChatMessageList,
	ChatMessageSender,
	ChatMessageText,
	ChatMessageTime,
	ChatUnreadSeparator,
};
