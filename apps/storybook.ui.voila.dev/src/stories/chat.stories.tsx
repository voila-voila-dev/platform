import {
	CopySimpleIcon,
	PencilSimpleIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar } from "@voila.dev/ui/avatar";
import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { CHAT_QUICK_REACTIONS, Chat } from "@voila.dev/ui/chat";
import { useState } from "react";

const meta = {
	title: "UI/Chat",
	component: Chat.MessageList,
	tags: ["autodocs"],
} satisfies Meta<typeof Chat.MessageList>;

export default meta;

type Story = StoryObj<typeof meta>;

function senderAvatar(initials: string) {
	return (
		<Avatar.Root size="sm">
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
	);
}

type LiveMessage = {
	readonly id: number;
	readonly author: "own" | "other";
	readonly text: string;
};

function liveMessageTime(id: number): string {
	return `09:${String(10 + (id % 50)).padStart(2, "0")}`;
}

// Consecutive messages from the same author render as one bubble group,
// in the order they were sent/received.
function groupConsecutiveMessages(
	messages: ReadonlyArray<LiveMessage>,
): LiveMessage[][] {
	const groups: LiveMessage[][] = [];
	let previousAuthor: LiveMessage["author"] | undefined;
	for (const message of messages) {
		if (message.author === previousAuthor) {
			groups[groups.length - 1]?.push(message);
		} else {
			groups.push([message]);
		}
		previousAuthor = message.author;
	}
	return groups;
}

function FullFeaturedPlayground() {
	const [historyLoaded, setHistoryLoaded] = useState(false);
	const [draft, setDraft] = useState("");
	const [sending, setSending] = useState(false);
	const [liveMessages, setLiveMessages] = useState<ReadonlyArray<LiveMessage>>(
		[],
	);
	const [following, setFollowing] = useState(true);
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);

	const submitDraft = () => {
		const message = draft.trim();
		setDraft("");
		setSending(true);
		window.setTimeout(() => {
			setLiveMessages((previous) => [
				...previous,
				{ id: previous.length, author: "own", text: message },
			]);
			setSending(false);
		}, 600);
	};

	const liveGroups = groupConsecutiveMessages(liveMessages);

	return (
		<div className="flex w-full max-w-4xl flex-col gap-3">
			<div className="flex h-[28rem] gap-4">
				<aside className="hidden w-64 shrink-0 flex-col gap-1 border-r pr-4 sm:flex">
					<Chat.ConversationItem
						leading={senderAvatar("NW")}
						title="Northwind redesign — June 13"
						badges={<Badge variant="outline">Project</Badge>}
						description="Camille: Small change…"
						timestamp="08:55"
						unreadCount={2}
						className="bg-muted"
						render={<button type="button" />}
					/>
					<Chat.ConversationItem
						leading={senderAvatar("SU")}
						title="Support"
						badges={<Badge variant="secondary">Support</Badge>}
						description="Our team replies to you right here."
						timestamp="Yesterday"
						render={<button type="button" />}
					/>
					<Chat.ConversationItem
						leading={senderAvatar("Q3")}
						title="Q3 brand refresh"
						badges={
							<>
								<Badge variant="outline">Project</Badge>
								<Badge variant="secondary">Archived</Badge>
							</>
						}
						description="Archived conversation"
						timestamp="12/04"
						render={<button type="button" />}
					/>
				</aside>
				<div className="flex min-w-0 flex-1 flex-col gap-3">
					<Chat.MessageList
						jumpToLatestLabel="New messages"
						onFollowChange={setFollowing}
						header={
							historyLoaded ? null : (
								<div className="flex justify-center">
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => setHistoryLoaded(true)}
									>
										Load earlier messages
									</Button>
								</div>
							)
						}
					>
						{historyLoaded ? (
							<>
								<Chat.DateSeparator>Monday</Chat.DateSeparator>
								<Chat.MessageGroup align="start">
									<Chat.MessageSender
										avatar={senderAvatar("NG")}
										name="Nathan Guyot"
										badge={<Badge variant="highlight">Northwind</Badge>}
									/>
									<Chat.MessageBubble variant="other">
										Welcome to the project thread!
										<Chat.MessageTime dateTime="2026-06-08T10:15">
											10:15
										</Chat.MessageTime>
									</Chat.MessageBubble>
								</Chat.MessageGroup>
								<Chat.MessageGroup align="end">
									<Chat.MessageBubble variant="own">
										Thanks, glad to be on board.
										<Chat.MessageTime dateTime="2026-06-08T10:20">
											10:20
										</Chat.MessageTime>
									</Chat.MessageBubble>
								</Chat.MessageGroup>
							</>
						) : null}
						<Chat.DateSeparator>Yesterday</Chat.DateSeparator>
						<Chat.MessageGroup align="start">
							<Chat.MessageSender
								avatar={senderAvatar("CD")}
								name="Camille Dubois"
								badge={<Badge variant="brand">Verified freelancer</Badge>}
							/>
							<Chat.MessageBubble variant="other">
								Hi, I'll be online 30 minutes before the kickoff call.
								<Chat.MessageTime dateTime="2026-06-11T18:42">
									18:42
								</Chat.MessageTime>
							</Chat.MessageBubble>
							<Chat.MessageBubble variant="other">
								Is there a shared folder where I can drop my files?
								<Chat.MessageTime dateTime="2026-06-11T18:43">
									18:43
								</Chat.MessageTime>
							</Chat.MessageBubble>
						</Chat.MessageGroup>
						<Chat.MessageGroup align="start">
							<Chat.MessageSender
								avatar={senderAvatar("NG")}
								name="Nathan Guyot"
								badge={<Badge variant="highlight">Northwind</Badge>}
							/>
							<Chat.MessageBubble variant="other">
								Yes, the project drive has a folder set up for you.
								<Chat.MessageTime dateTime="2026-06-11T19:05">
									19:05
								</Chat.MessageTime>
							</Chat.MessageBubble>
						</Chat.MessageGroup>
						<Chat.MessageGroup align="end">
							<Chat.MessageBubble variant="own">
								Perfect, thanks! Talk on Monday.
								<Chat.MessageTime dateTime="2026-06-11T19:10">
									19:10
								</Chat.MessageTime>
							</Chat.MessageBubble>
						</Chat.MessageGroup>
						<Chat.UnreadSeparator>New messages</Chat.UnreadSeparator>
						<Chat.DateSeparator>Today</Chat.DateSeparator>
						<Chat.MessageGroup align="start">
							<Chat.MessageSender
								avatar={senderAvatar("CD")}
								name="Camille Dubois"
								badge={<Badge variant="brand">Verified freelancer</Badge>}
							/>
							<Chat.MessageBubble variant="other">
								Small change: I'll join at 1:30pm instead.
								<Chat.MessageTime dateTime="2026-06-12T08:55">
									08:55
								</Chat.MessageTime>
							</Chat.MessageBubble>
						</Chat.MessageGroup>
						{liveGroups.map((group) => {
							const [firstMessage] = group;
							if (firstMessage === undefined) {
								return null;
							}
							if (firstMessage.author === "own") {
								return (
									<Chat.MessageGroup key={firstMessage.id} align="end">
										{group.map((message) => (
											<Chat.MessageBubble key={message.id} variant="own">
												<Chat.MessageText onLinkClick={setPendingUrl}>
													{message.text}
												</Chat.MessageText>
												<Chat.MessageTime>
													{liveMessageTime(message.id)}
												</Chat.MessageTime>
											</Chat.MessageBubble>
										))}
									</Chat.MessageGroup>
								);
							}
							return (
								<Chat.MessageGroup key={firstMessage.id} align="start">
									<Chat.MessageSender
										avatar={senderAvatar("NG")}
										name="Nathan Guyot"
										badge={<Badge variant="highlight">Northwind</Badge>}
									/>
									{group.map((message) => (
										<Chat.MessageBubble key={message.id} variant="other">
											<Chat.MessageText onLinkClick={setPendingUrl}>
												{message.text}
											</Chat.MessageText>
											<Chat.MessageTime>
												{liveMessageTime(message.id)}
											</Chat.MessageTime>
										</Chat.MessageBubble>
									))}
								</Chat.MessageGroup>
							);
						})}
					</Chat.MessageList>
					<Chat.Composer
						value={draft}
						onValueChange={setDraft}
						onSubmit={submitDraft}
						placeholder="Write a message…"
						sendLabel="Send"
						hint="⌘↵ to send"
						maxLength={500}
						sending={sending}
					/>
				</div>
			</div>
			<div className="flex items-center justify-between gap-2 border-t pt-3">
				<span className="text-muted-foreground text-xs">
					{following
						? "You are following the conversation."
						: "You are reading the history — a new message shows the floating button."}
				</span>
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() =>
						setLiveMessages((previous) => [
							...previous,
							{
								id: previous.length,
								author: "other",
								text: `Simulated reply #${
									previous.filter((message) => message.author === "other")
										.length + 1
								}`,
							},
						])
					}
				>
					Simulate a reply
				</Button>
			</div>
			<Chat.ExternalLinkDialog
				url={pendingUrl}
				onClose={() => setPendingUrl(null)}
				title="You are leaving acme.dev"
				description="This link goes to an external site. Only open it if you trust the destination."
				confirmLabel="Open link"
				cancelLabel="Cancel"
			/>
		</div>
	);
}

/** Everything wired together: conversation list, thread with date and unread
 * separators, load-older prepend, jump-to-latest while reading history,
 * simulated incoming replies, and a live composer (counter, hint, sending
 * spinner). Send a message or scroll up and simulate a reply to exercise the
 * whole kit. */
export const FullFeatured: Story = {
	render: () => <FullFeaturedPlayground />,
};

export const Thread: Story = {
	render: () => (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList
				header={
					<div className="flex justify-center">
						<Button type="button" variant="ghost" size="sm">
							Load earlier messages
						</Button>
					</div>
				}
			>
				<Chat.DateSeparator>Yesterday</Chat.DateSeparator>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<Chat.MessageBubble variant="other">
						Hi, I'll be online 30 minutes before the kickoff call.
						<Chat.MessageTime dateTime="2026-06-11T18:42">
							18:42
						</Chat.MessageTime>
					</Chat.MessageBubble>
					<Chat.MessageBubble variant="other">
						Is there a shared folder where I can drop my files?
						<Chat.MessageTime dateTime="2026-06-11T18:43">
							18:43
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("NG")}
						name="Nathan Guyot"
						badge={<Badge variant="highlight">Northwind</Badge>}
					/>
					<Chat.MessageBubble variant="other">
						Yes, the project drive has a folder set up for you.
						<Chat.MessageTime dateTime="2026-06-11T19:05">
							19:05
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.DateSeparator>Today</Chat.DateSeparator>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("ET")}
						name="Emilien"
						badge={<Badge>Acme team</Badge>}
					/>
					<Chat.MessageBubble variant="other">
						Hi everyone, I'm around if you need anything.
						<Chat.MessageTime dateTime="2026-06-12T09:02">
							09:02
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="end">
					<Chat.MessageBubble variant="own">
						Perfect, thanks! Talk on Monday.
						<Chat.MessageTime dateTime="2026-06-12T09:10">
							09:10
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
			</Chat.MessageList>
		</div>
	),
};

/** A thread opened with unread messages: the destructive rule marks where
 * the catch-up starts. */
export const UnreadSeparator: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.MessageGroup align="end">
					<Chat.MessageBubble variant="own">
						Talk on Monday!
						<Chat.MessageTime dateTime="2026-06-11T19:10">
							19:10
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.UnreadSeparator>New messages</Chat.UnreadSeparator>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<Chat.MessageBubble variant="other">
						Small change: I'll join at 1:30pm instead.
						<Chat.MessageTime dateTime="2026-06-12T08:55">
							08:55
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
			</Chat.MessageList>
		</div>
	),
};

/** The overflow regression case: an unbroken URL must wrap inside the bubble
 * instead of stretching the whole list horizontally. */
export const LongWordOverflow: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
					/>
					<Chat.MessageBubble variant="other">
						Here is the link to the checklist:
						https://intranet.acme.dev/handbooks/design-reviews/progressive-handoff-checklist-for-launches-2026
						<Chat.MessageTime dateTime="2026-06-12T09:02">
							09:02
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="end">
					<Chat.MessageBubble variant="own">
						Supercalifragilisticexpialidocious-pneumonoultramicroscopicsilicovolcanoconiosis-extraordinarily
						<Chat.MessageTime dateTime="2026-06-12T09:03">
							09:03
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
			</Chat.MessageList>
		</div>
	),
};

function MessageLinksPlayground() {
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);
	return (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<Chat.MessageBubble variant="other">
						<Chat.MessageText onLinkClick={setPendingUrl}>
							Here is the style guide:
							https://www.brand-guidelines.example.com/handoff. Let me know if
							the link does not work.
						</Chat.MessageText>
						<Chat.MessageTime dateTime="2026-06-12T09:02">
							09:02
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="end">
					<Chat.MessageBubble variant="own">
						<Chat.MessageText onLinkClick={setPendingUrl}>
							Thanks! I prefer this one:
							https://docs.example.com/brand/asset-delivery
						</Chat.MessageText>
						<Chat.MessageTime dateTime="2026-06-12T09:04">
							09:04
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
			</Chat.MessageList>
			<Chat.ExternalLinkDialog
				url={pendingUrl}
				onClose={() => setPendingUrl(null)}
				title="You are leaving acme.dev"
				description="This link goes to an external site. Only open it if you trust the destination."
				confirmLabel="Open link"
				cancelLabel="Cancel"
			/>
		</div>
	);
}

/** URLs inside a message are clickable. Activation is intercepted by
 * Chat.ExternalLinkDialog: the reader confirms they trust the destination
 * before the link opens in a new tab. */
export const MessageLinks: Story = {
	render: () => <MessageLinksPlayground />,
};

/** What a conversation looks like before anyone has written. */
export const EmptyThread: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
					No messages yet — write the first one!
				</div>
			</Chat.MessageList>
			<Chat.Composer
				value=""
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Write a message…"
				sendLabel="Send"
				hint="⌘↵ to send"
			/>
		</div>
	),
};

function FollowPlayground() {
	const [messages, setMessages] = useState(
		Array.from({ length: 20 }, (_, index) => `History message #${index + 1}`),
	);
	const [following, setFollowing] = useState(true);
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList
				jumpToLatestLabel="New messages"
				onFollowChange={setFollowing}
			>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					{messages.map((message) => (
						<Chat.MessageBubble key={message} variant="other">
							{message}
						</Chat.MessageBubble>
					))}
				</Chat.MessageGroup>
			</Chat.MessageList>
			<div className="flex items-center justify-between gap-2">
				<span className="text-muted-foreground text-xs">
					{following
						? "You are following the conversation."
						: "You are reading the history — a new message shows the floating button."}
				</span>
				<Button
					type="button"
					size="sm"
					onClick={() =>
						setMessages((previous) => [
							...previous,
							`New message #${previous.length + 1}`,
						])
					}
				>
					Add a message
				</Button>
			</div>
		</div>
	);
}

/** Scroll up into the history, then append: the list does not yank you down,
 * and the built-in "New messages ↓" button floats above the thread. */
export const FollowJumpToLatest: Story = {
	render: () => <FollowPlayground />,
};

function ComposerPlayground(props: {
	disabled?: boolean;
	sending?: boolean;
	submitOnEnter?: boolean;
	maxLength?: number;
}) {
	const [value, setValue] = useState("");
	return (
		<Chat.Composer
			value={value}
			onValueChange={setValue}
			onSubmit={() => setValue("")}
			placeholder="Write a message…"
			sendLabel="Send"
			hint={props.submitOnEnter ? "↵ to send" : "⌘↵ to send"}
			disabled={props.disabled}
			sending={props.sending}
			submitOnEnter={props.submitOnEnter}
			maxLength={props.maxLength}
		/>
	);
}

export const Composer: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<ComposerPlayground />
		</div>
	),
};

export const ComposerSending: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<Chat.Composer
				value="I'll be online in 10 minutes."
				onValueChange={() => {}}
				onSubmit={() => {}}
				sendLabel="Send"
				sending
			/>
		</div>
	),
};

export const ComposerWithError: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<Chat.Composer
				value={"A message ".repeat(40)}
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Write a message…"
				sendLabel="Send"
				error="The message exceeds the 500-character limit."
				hint="⌘↵ to send"
			/>
		</div>
	),
};

/** Soft limit: the counter turns destructive and send is disabled once the
 * draft exceeds maxLength — type past 80 characters to see it. */
export const ComposerWithCounter: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-6">
			<ComposerPlayground maxLength={80} />
			<Chat.Composer
				value={"A message far too long for the configured limit. ".repeat(2)}
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Write a message…"
				sendLabel="Send"
				maxLength={80}
				error="The message exceeds the 80-character limit."
			/>
		</div>
	),
};

export const ComposerSubmitOnEnter: Story = {
	render: () => (
		<div className="w-full max-w-xl">
			<ComposerPlayground submitOnEnter />
		</div>
	),
};

export const ComposerArchived: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-2">
			<p className="text-muted-foreground text-sm">
				This conversation is archived.
			</p>
			<Chat.Composer
				value=""
				onValueChange={() => {}}
				onSubmit={() => {}}
				placeholder="Write a message…"
				sendLabel="Send"
				disabled
			/>
		</div>
	),
};

export const ConversationListItems: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-1">
			<Chat.ConversationItem
				leading={senderAvatar("SU")}
				title="Support"
				badges={<Badge variant="secondary">Support</Badge>}
				description="Our team replies to you right here."
				timestamp="09:10"
				unreadCount={2}
			/>
			<Chat.ConversationItem
				leading={senderAvatar("Q3")}
				title="Q3 brand refresh"
				badges={<Badge variant="outline">Project</Badge>}
				description="Last message yesterday"
				timestamp="Yesterday"
			/>
			<Chat.ConversationItem
				leading={senderAvatar("NW")}
				title="Northwind redesign — April 12"
				badges={
					<>
						<Badge variant="outline">Project</Badge>
						<Badge variant="secondary">Archived</Badge>
					</>
				}
				description="Archived conversation"
				timestamp="12/04"
			/>
			{/* unreadCount above 99 renders as the capped « 99+ » badge. */}
			<Chat.ConversationItem
				leading={senderAvatar("DA")}
				title="Very active discussion with a really long title that has to be truncated"
				description="Last message just now"
				timestamp="Just now"
				unreadCount={128}
			/>
			<Chat.ConversationItem
				leading={senderAvatar("CL")}
				title="Clickable conversation (link)"
				description="Rendered as an <a> via render — keyboard focus and hover active."
				timestamp="10:24"
				unreadCount={1}
				render={
					// biome-ignore lint/a11y/useAnchorContent: content is merged in from Chat.ConversationItem
					<a href="#conversation" />
				}
			/>
		</div>
	),
};

function AppendPlayground() {
	const [messages, setMessages] = useState([
		"Hi, I'll be online 30 minutes before the kickoff call.",
		"Is there a shared folder where I can drop my files?",
	]);
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					{messages.map((message, index) => (
						<Chat.MessageBubble key={`${index}-${message}`} variant="other">
							{message}
							<Chat.MessageTime>09:1{index}</Chat.MessageTime>
						</Chat.MessageBubble>
					))}
				</Chat.MessageGroup>
			</Chat.MessageList>
			<Button
				type="button"
				size="sm"
				onClick={() =>
					setMessages((previous) => [
						...previous,
						`New message #${previous.length + 1}`,
					])
				}
			>
				Add a message
			</Button>
		</div>
	);
}

export const AppendAutoScroll: Story = {
	render: () => <AppendPlayground />,
};

const demoActions = (
	<>
		<Chat.MessageAction icon={<CopySimpleIcon />}>Copy</Chat.MessageAction>
		<Chat.MessageAction icon={<PencilSimpleIcon />}>Edit</Chat.MessageAction>
		<Chat.MessageAction icon={<TrashIcon />} variant="destructive">
			Delete
		</Chat.MessageAction>
	</>
);

type DemoReaction = { emoji: string; count: number; mine: boolean };

function demoReactionRow(
	reactions: ReadonlyArray<DemoReaction>,
	align: "start" | "end",
	onReact: (emoji: string) => void,
) {
	if (reactions.length === 0) {
		return null;
	}
	return (
		<Chat.Reactions align={align}>
			{reactions.map((reaction) => (
				<Chat.Reaction
					key={reaction.emoji}
					emoji={reaction.emoji}
					count={reaction.count}
					active={reaction.mine}
					onClick={() => onReact(reaction.emoji)}
				/>
			))}
		</Chat.Reactions>
	);
}

function toggleReaction(
	reactions: ReadonlyArray<DemoReaction>,
	emoji: string,
): DemoReaction[] {
	const existing = reactions.find((reaction) => reaction.emoji === emoji);
	if (existing === undefined) {
		return [...reactions, { emoji, count: 1, mine: true }];
	}
	return reactions
		.map((reaction) =>
			reaction.emoji === emoji
				? {
						emoji,
						count: reaction.count + (reaction.mine ? -1 : 1),
						mine: !reaction.mine,
					}
				: reaction,
		)
		.filter((reaction) => reaction.count > 0);
}

function MessageActionsWithReactionsPlayground() {
	const [ownReactions, setOwnReactions] = useState<ReadonlyArray<DemoReaction>>(
		[
			{ emoji: "👍", count: 3, mine: true },
			{ emoji: "❤️", count: 1, mine: false },
		],
	);
	const [otherReactions, setOtherReactions] = useState<
		ReadonlyArray<DemoReaction>
	>([{ emoji: "😂", count: 2, mine: false }]);
	return (
		<div className="flex w-full max-w-xl flex-col gap-1 py-10">
			<Chat.MessageActions
				onReact={(emoji) =>
					setOtherReactions((previous) => toggleReaction(previous, emoji))
				}
				activeEmojis={otherReactions
					.filter((reaction) => reaction.mine)
					.map((reaction) => reaction.emoji)}
				reactionsLabel="React"
				menuLabel="Message actions"
				actions={demoActions}
			>
				<Chat.Bubble variant="muted">
					<Chat.BubbleContent>
						Hover me, right-click me, or long-press me on a touch screen.
						<Chat.Time dateTime="2026-06-12T09:02">09:02</Chat.Time>
					</Chat.BubbleContent>
					{demoReactionRow(otherReactions, "start", (emoji) =>
						setOtherReactions((previous) => toggleReaction(previous, emoji)),
					)}
				</Chat.Bubble>
			</Chat.MessageActions>
			<Chat.Bubble variant="muted">
				<Chat.BubbleContent>
					The reaction pill above pushes me down instead of covering me.
					<Chat.Time dateTime="2026-06-12T09:03">09:03</Chat.Time>
				</Chat.BubbleContent>
			</Chat.Bubble>
			<div data-align="end" className="flex flex-col items-end gap-1">
				<Chat.MessageActions
					onReact={(emoji) =>
						setOwnReactions((previous) => toggleReaction(previous, emoji))
					}
					activeEmojis={ownReactions
						.filter((reaction) => reaction.mine)
						.map((reaction) => reaction.emoji)}
					reactionsLabel="React"
					menuLabel="Message actions"
					actions={demoActions}
				>
					<Chat.Bubble align="end">
						<Chat.BubbleContent>
							Same combination on the end side: menu plus reactions.
							<Chat.Time dateTime="2026-06-12T09:04">09:04</Chat.Time>
						</Chat.BubbleContent>
						{demoReactionRow(ownReactions, "end", (emoji) =>
							setOwnReactions((previous) => toggleReaction(previous, emoji)),
						)}
					</Chat.Bubble>
				</Chat.MessageActions>
				<Chat.Bubble align="end">
					<Chat.BubbleContent>
						And I stay clear of the pill too.
						<Chat.Time dateTime="2026-06-12T09:05">09:05</Chat.Time>
					</Chat.BubbleContent>
				</Chat.Bubble>
			</div>
		</div>
	);
}

/** The non-regression combination: `Chat.MessageActions` wrapping bubbles that
 * carry reactions, on both sides of the thread. The pill sits in the flow and
 * pushes the next bubble; hovering shows the bar with the quick reactions and
 * the icon actions; right-click opens the menu; tapping a pill or a quick
 * reaction toggles it and pops the counter. */
export const MessageActionsWithReactions: Story = {
	render: () => <MessageActionsWithReactionsPlayground />,
};

/** The desktop affordance alone: hover the bubble with a mouse to get the
 * floating bar — the quick reactions, then each icon-carrying action one
 * press away. Right-click still opens the full menu. Nothing shows on a
 * touch screen. */
export const HoverActionBar: Story = {
	render: () => (
		<div className="flex w-full max-w-xl flex-col gap-1 py-16">
			<Chat.MessageActions
				onReact={() => {}}
				reactionsLabel="React"
				menuLabel="Message actions"
				actions={demoActions}
			>
				<Chat.Bubble variant="muted">
					<Chat.BubbleContent>
						Hover me with a mouse — the bar floats above without moving me.
					</Chat.BubbleContent>
				</Chat.Bubble>
			</Chat.MessageActions>
		</div>
	),
};

function PressSurfacePlayground() {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex w-full max-w-xl flex-col gap-3 py-6">
			<Button type="button" size="sm" onClick={() => setOpen(true)}>
				Force the long-press surface open
			</Button>
			<Chat.Bubble variant="muted">
				<Chat.BubbleContent>
					On a touch screen, a long press on me opens the same surface.
				</Chat.BubbleContent>
			</Chat.Bubble>
			<Chat.MessagePressSurface
				pressed={
					open
						? {
								rect: {
									top: 220,
									left: 24,
									right: 320,
									bottom: 280,
									width: 296,
								},
								end: false,
							}
						: null
				}
				onClose={() => setOpen(false)}
				emojis={CHAT_QUICK_REACTIONS}
				activeEmojis={new Set(["👍"])}
				onReact={() => setOpen(false)}
				reactionsLabel="React"
				label="Message actions"
				actions={demoActions}
			>
				<Chat.Bubble variant="muted">
					<Chat.BubbleContent>
						On a touch screen, a long press on me opens the same surface.
					</Chat.BubbleContent>
				</Chat.Bubble>
			</Chat.MessagePressSurface>
		</div>
	);
}

/** The full-screen long-press surface, forced open for inspection: veil
 * blurred, bubble lifted at its position, emoji row cascading in above it and
 * the actions card below. A tap on the veil closes it. */
export const LongPressSurface: Story = {
	render: () => <PressSurfacePlayground />,
};

/** Reactions on the very last message of a thread: the pill's height counts
 * in the flow, so nothing sits outside the scroller or gets clipped. */
export const ReactionOnLastMessage: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
					/>
					<Chat.MessageBubble variant="other">
						See you on Monday!
						<Chat.MessageTime dateTime="2026-06-12T09:02">
							09:02
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="end">
					<Chat.Bubble align="end">
						<Chat.BubbleContent>
							Perfect, thanks a lot!
							<Chat.Time dateTime="2026-06-12T09:03">09:03</Chat.Time>
						</Chat.BubbleContent>
						<Chat.Reactions align="end">
							<Chat.Reaction emoji="👍" count={2} active />
							<Chat.Reaction emoji="🙏" />
						</Chat.Reactions>
					</Chat.Bubble>
				</Chat.MessageGroup>
			</Chat.MessageList>
		</div>
	),
};
