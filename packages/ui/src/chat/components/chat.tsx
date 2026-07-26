import { ChatComposer } from "#/chat/components/chat-composer.tsx";
import { ChatConversationItem } from "#/chat/components/chat-conversation-item.tsx";
import { ChatDateSeparator } from "#/chat/components/chat-date-separator.tsx";
import { ChatExternalLinkDialog } from "#/chat/components/chat-external-link-dialog.tsx";
import { ChatMessage } from "#/chat/components/chat-message.tsx";
import { ChatMessageGroup } from "#/chat/components/chat-message-group.tsx";
import { ChatMessageList } from "#/chat/components/chat-message-list.tsx";
import { ChatMessageSender } from "#/chat/components/chat-message-sender.tsx";
import { ChatMessageText } from "#/chat/components/chat-message-text.tsx";
import { ChatMessageTime } from "#/chat/components/chat-message-time.tsx";
import { ChatUnreadSeparator } from "#/chat/components/chat-unread-separator.tsx";

/**
 * The Chat parts as one namespace.
 *
 * A parts family without a `Root`: a chat screen composes the conversation
 * list, the message list and the composer directly.
 */
export const Chat = {
	Composer: ChatComposer,
	ConversationItem: ChatConversationItem,
	DateSeparator: ChatDateSeparator,
	ExternalLinkDialog: ChatExternalLinkDialog,
	Message: ChatMessage,
	MessageGroup: ChatMessageGroup,
	MessageList: ChatMessageList,
	MessageSender: ChatMessageSender,
	MessageText: ChatMessageText,
	MessageTime: ChatMessageTime,
	UnreadSeparator: ChatUnreadSeparator,
};
