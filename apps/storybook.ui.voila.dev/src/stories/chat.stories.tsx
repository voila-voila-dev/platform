import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Avatar, AvatarFallback } from "@voila.dev/ui/components/avatar";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import {
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
} from "@voila.dev/ui/components/chat";
import { useState } from "react";

const meta = {
	title: "UI/Chat",
	component: ChatMessageList,
	tags: ["autodocs"],
} satisfies Meta<typeof ChatMessageList>;

export default meta;

type Story = StoryObj<typeof meta>;

function senderAvatar(initials: string) {
	return (
		<Avatar size="sm">
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>
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
					<ChatConversationItem
						leading={senderAvatar("NW")}
						title="Northwind redesign — June 13"
						badges={<Badge variant="outline">Project</Badge>}
						description="Camille: Small change…"
						timestamp="08:55"
						unreadCount={2}
						className="bg-muted"
						render={<button type="button" />}
					/>
					<ChatConversationItem
						leading={senderAvatar("SU")}
						title="Support"
						badges={<Badge variant="secondary">Support</Badge>}
						description="Our team replies to you right here."
						timestamp="Yesterday"
						render={<button type="button" />}
					/>
					<ChatConversationItem
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
					<ChatMessageList
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
								<ChatDateSeparator>Monday</ChatDateSeparator>
								<ChatMessageGroup align="start">
									<ChatMessageSender
										avatar={senderAvatar("NG")}
										name="Nathan Guyot"
										badge={<Badge variant="highlight">Northwind</Badge>}
									/>
									<ChatMessage variant="other">
										Welcome to the project thread!
										<ChatMessageTime dateTime="2026-06-08T10:15">
											10:15
										</ChatMessageTime>
									</ChatMessage>
								</ChatMessageGroup>
								<ChatMessageGroup align="end">
									<ChatMessage variant="own">
										Thanks, glad to be on board.
										<ChatMessageTime dateTime="2026-06-08T10:20">
											10:20
										</ChatMessageTime>
									</ChatMessage>
								</ChatMessageGroup>
							</>
						) : null}
						<ChatDateSeparator>Yesterday</ChatDateSeparator>
						<ChatMessageGroup align="start">
							<ChatMessageSender
								avatar={senderAvatar("CD")}
								name="Camille Dubois"
								badge={<Badge variant="brand">Verified freelancer</Badge>}
							/>
							<ChatMessage variant="other">
								Hi, I'll be online 30 minutes before the kickoff call.
								<ChatMessageTime dateTime="2026-06-11T18:42">
									18:42
								</ChatMessageTime>
							</ChatMessage>
							<ChatMessage variant="other">
								Is there a shared folder where I can drop my files?
								<ChatMessageTime dateTime="2026-06-11T18:43">
									18:43
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						<ChatMessageGroup align="start">
							<ChatMessageSender
								avatar={senderAvatar("NG")}
								name="Nathan Guyot"
								badge={<Badge variant="highlight">Northwind</Badge>}
							/>
							<ChatMessage variant="other">
								Yes, the project drive has a folder set up for you.
								<ChatMessageTime dateTime="2026-06-11T19:05">
									19:05
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						<ChatMessageGroup align="end">
							<ChatMessage variant="own">
								Perfect, thanks! Talk on Monday.
								<ChatMessageTime dateTime="2026-06-11T19:10">
									19:10
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						<ChatUnreadSeparator>New messages</ChatUnreadSeparator>
						<ChatDateSeparator>Today</ChatDateSeparator>
						<ChatMessageGroup align="start">
							<ChatMessageSender
								avatar={senderAvatar("CD")}
								name="Camille Dubois"
								badge={<Badge variant="brand">Verified freelancer</Badge>}
							/>
							<ChatMessage variant="other">
								Small change: I'll join at 1:30pm instead.
								<ChatMessageTime dateTime="2026-06-12T08:55">
									08:55
								</ChatMessageTime>
							</ChatMessage>
						</ChatMessageGroup>
						{liveGroups.map((group) => {
							const [firstMessage] = group;
							if (firstMessage === undefined) {
								return null;
							}
							if (firstMessage.author === "own") {
								return (
									<ChatMessageGroup key={firstMessage.id} align="end">
										{group.map((message) => (
											<ChatMessage key={message.id} variant="own">
												<ChatMessageText onLinkClick={setPendingUrl}>
													{message.text}
												</ChatMessageText>
												<ChatMessageTime>
													{liveMessageTime(message.id)}
												</ChatMessageTime>
											</ChatMessage>
										))}
									</ChatMessageGroup>
								);
							}
							return (
								<ChatMessageGroup key={firstMessage.id} align="start">
									<ChatMessageSender
										avatar={senderAvatar("NG")}
										name="Nathan Guyot"
										badge={<Badge variant="highlight">Northwind</Badge>}
									/>
									{group.map((message) => (
										<ChatMessage key={message.id} variant="other">
											<ChatMessageText onLinkClick={setPendingUrl}>
												{message.text}
											</ChatMessageText>
											<ChatMessageTime>
												{liveMessageTime(message.id)}
											</ChatMessageTime>
										</ChatMessage>
									))}
								</ChatMessageGroup>
							);
						})}
					</ChatMessageList>
					<ChatComposer
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
			<ChatExternalLinkDialog
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
			<ChatMessageList
				header={
					<div className="flex justify-center">
						<Button type="button" variant="ghost" size="sm">
							Load earlier messages
						</Button>
					</div>
				}
			>
				<ChatDateSeparator>Yesterday</ChatDateSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<ChatMessage variant="other">
						Hi, I'll be online 30 minutes before the kickoff call.
						<ChatMessageTime dateTime="2026-06-11T18:42">18:42</ChatMessageTime>
					</ChatMessage>
					<ChatMessage variant="other">
						Is there a shared folder where I can drop my files?
						<ChatMessageTime dateTime="2026-06-11T18:43">18:43</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("NG")}
						name="Nathan Guyot"
						badge={<Badge variant="highlight">Northwind</Badge>}
					/>
					<ChatMessage variant="other">
						Yes, the project drive has a folder set up for you.
						<ChatMessageTime dateTime="2026-06-11T19:05">19:05</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatDateSeparator>Today</ChatDateSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("ET")}
						name="Emilien"
						badge={<Badge>Acme team</Badge>}
					/>
					<ChatMessage variant="other">
						Hi everyone, I'm around if you need anything.
						<ChatMessageTime dateTime="2026-06-12T09:02">09:02</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Perfect, thanks! Talk on Monday.
						<ChatMessageTime dateTime="2026-06-12T09:10">09:10</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
		</div>
	),
};

/** A thread opened with unread messages: the destructive rule marks where
 * the catch-up starts. */
export const UnreadSeparator: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Talk on Monday!
						<ChatMessageTime dateTime="2026-06-11T19:10">19:10</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatUnreadSeparator>New messages</ChatUnreadSeparator>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<ChatMessage variant="other">
						Small change: I'll join at 1:30pm instead.
						<ChatMessageTime dateTime="2026-06-12T08:55">08:55</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
		</div>
	),
};

/** The overflow regression case: an unbroken URL must wrap inside the bubble
 * instead of stretching the whole list horizontally. */
export const LongWordOverflow: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
					/>
					<ChatMessage variant="other">
						Here is the link to the checklist:
						https://intranet.acme.dev/handbooks/design-reviews/progressive-handoff-checklist-for-launches-2026
						<ChatMessageTime dateTime="2026-06-12T09:02">09:02</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						Supercalifragilisticexpialidocious-pneumonoultramicroscopicsilicovolcanoconiosis-extraordinarily
						<ChatMessageTime dateTime="2026-06-12T09:03">09:03</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
		</div>
	),
};

function MessageLinksPlayground() {
	const [pendingUrl, setPendingUrl] = useState<string | null>(null);
	return (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<ChatMessage variant="other">
						<ChatMessageText onLinkClick={setPendingUrl}>
							Here is the style guide:
							https://www.brand-guidelines.example.com/handoff. Let me know if
							the link does not work.
						</ChatMessageText>
						<ChatMessageTime dateTime="2026-06-12T09:02">09:02</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
				<ChatMessageGroup align="end">
					<ChatMessage variant="own">
						<ChatMessageText onLinkClick={setPendingUrl}>
							Thanks! I prefer this one:
							https://docs.example.com/brand/asset-delivery
						</ChatMessageText>
						<ChatMessageTime dateTime="2026-06-12T09:04">09:04</ChatMessageTime>
					</ChatMessage>
				</ChatMessageGroup>
			</ChatMessageList>
			<ChatExternalLinkDialog
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
 * ChatExternalLinkDialog: the reader confirms they trust the destination
 * before the link opens in a new tab. */
export const MessageLinks: Story = {
	render: () => <MessageLinksPlayground />,
};

/** What a conversation looks like before anyone has written. */
export const EmptyThread: Story = {
	render: () => (
		<div className="flex h-72 w-full max-w-xl flex-col gap-3">
			<ChatMessageList>
				<div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
					No messages yet — write the first one!
				</div>
			</ChatMessageList>
			<ChatComposer
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
			<ChatMessageList
				jumpToLatestLabel="New messages"
				onFollowChange={setFollowing}
			>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					{messages.map((message) => (
						<ChatMessage key={message} variant="other">
							{message}
						</ChatMessage>
					))}
				</ChatMessageGroup>
			</ChatMessageList>
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
		<ChatComposer
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
			<ChatComposer
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
			<ChatComposer
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
			<ChatComposer
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
			<ChatComposer
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
			<ChatConversationItem
				leading={senderAvatar("SU")}
				title="Support"
				badges={<Badge variant="secondary">Support</Badge>}
				description="Our team replies to you right here."
				timestamp="09:10"
				unreadCount={2}
			/>
			<ChatConversationItem
				leading={senderAvatar("Q3")}
				title="Q3 brand refresh"
				badges={<Badge variant="outline">Project</Badge>}
				description="Last message yesterday"
				timestamp="Yesterday"
			/>
			<ChatConversationItem
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
			<ChatConversationItem
				leading={senderAvatar("DA")}
				title="Very active discussion with a really long title that has to be truncated"
				description="Last message just now"
				timestamp="Just now"
				unreadCount={128}
			/>
			<ChatConversationItem
				leading={senderAvatar("CL")}
				title="Clickable conversation (link)"
				description="Rendered as an <a> via render — keyboard focus and hover active."
				timestamp="10:24"
				unreadCount={1}
				render={
					// biome-ignore lint/a11y/useAnchorContent: content is merged in from ChatConversationItem
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
			<ChatMessageList>
				<ChatMessageGroup align="start">
					<ChatMessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					{messages.map((message, index) => (
						<ChatMessage key={`${index}-${message}`} variant="other">
							{message}
							<ChatMessageTime>09:1{index}</ChatMessageTime>
						</ChatMessage>
					))}
				</ChatMessageGroup>
			</ChatMessageList>
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
