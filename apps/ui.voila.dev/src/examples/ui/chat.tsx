import { Avatar } from "@voila.dev/ui/avatar";
import { Badge } from "@voila.dev/ui/badge";
import { Chat } from "@voila.dev/ui/chat";
import { useState } from "react";

/** The composer is fully controlled: the parent owns the draft and the send. */
function Composer() {
	const [draft, setDraft] = useState("");
	return (
		<Chat.Composer
			value={draft}
			onValueChange={setDraft}
			onSubmit={() => setDraft("")}
			placeholder="Write your message…"
			sendLabel="Send"
		/>
	);
}

function senderAvatar(initials: string) {
	return (
		<Avatar.Root size="sm">
			<Avatar.Fallback>{initials}</Avatar.Fallback>
		</Avatar.Root>
	);
}

export function Default() {
	return (
		<div className="flex h-96 w-full max-w-xl flex-col gap-3">
			<Chat.MessageList>
				<Chat.DateSeparator>Yesterday</Chat.DateSeparator>
				<Chat.MessageGroup align="start">
					<Chat.MessageSender
						avatar={senderAvatar("CD")}
						name="Camille Dubois"
						badge={<Badge variant="brand">Verified freelancer</Badge>}
					/>
					<Chat.MessageBubble variant="other">
						Hi, I will share the first drafts before our call tomorrow.
						<Chat.MessageTime dateTime="2026-06-11T18:42">
							18:42
						</Chat.MessageTime>
					</Chat.MessageBubble>
					<Chat.MessageBubble variant="other">
						Is there a shared folder where I can drop the files?
						<Chat.MessageTime dateTime="2026-06-11T18:43">
							18:43
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
				<Chat.MessageGroup align="end">
					<Chat.MessageBubble variant="own">
						Yes, the project drive is already shared with you.
						<Chat.MessageTime dateTime="2026-06-12T09:10">
							09:10
						</Chat.MessageTime>
					</Chat.MessageBubble>
				</Chat.MessageGroup>
			</Chat.MessageList>
			<Composer />
		</div>
	);
}

export function Conversations() {
	return (
		<div className="flex w-full max-w-xl flex-col gap-1">
			<Chat.ConversationItem
				leading={senderAvatar("SU")}
				title="Support"
				badges={<Badge variant="secondary">Support</Badge>}
				description="Our team replies to you directly here."
				timestamp="09:10"
				unreadCount={2}
			/>
			<Chat.ConversationItem
				leading={senderAvatar("RC")}
				title="Website launch — April 12"
				badges={<Badge variant="outline">Milestone</Badge>}
				description="Archived conversation"
				timestamp="12/04"
			/>
		</div>
	);
}
