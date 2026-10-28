import type * as React from "react";
import { ChatConversationItemTimestamp } from "#/chat/components/chat-conversation-item-timestamp.tsx";
import { ChatConversationItemUnreadBadge } from "#/chat/components/chat-conversation-item-unread-badge.tsx";

interface Props {
	timestamp?: React.ReactNode;
	unread: boolean;
	unreadCount: number;
	unreadLabel?: string;
}

/** The row's trailing column: timestamp over the unread badge. */
export function ChatConversationItemMeta({
	timestamp,
	unread,
	unreadCount,
	unreadLabel,
}: Props) {
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
