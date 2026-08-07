import { ChatAvatar } from "#/chat/components/chat-avatar.tsx";
import { ChatBubble } from "#/chat/components/chat-bubble.tsx";
import { ChatBubbleContent } from "#/chat/components/chat-bubble-content.tsx";
import { ChatBubbleGroup } from "#/chat/components/chat-bubble-group.tsx";
import { ChatComposer } from "#/chat/components/chat-composer.tsx";
import { ChatContent } from "#/chat/components/chat-content.tsx";
import { ChatConversationItem } from "#/chat/components/chat-conversation-item.tsx";
import { ChatDateSeparator } from "#/chat/components/chat-date-separator.tsx";
import { ChatExternalLinkDialog } from "#/chat/components/chat-external-link-dialog.tsx";
import { ChatFooter } from "#/chat/components/chat-footer.tsx";
import { ChatGroup } from "#/chat/components/chat-group.tsx";
import { ChatHeader } from "#/chat/components/chat-header.tsx";
import { ChatItem } from "#/chat/components/chat-item.tsx";
import { ChatMarker } from "#/chat/components/chat-marker.tsx";
import { ChatMarkerContent } from "#/chat/components/chat-marker-content.tsx";
import { ChatMarkerIcon } from "#/chat/components/chat-marker-icon.tsx";
import { ChatMessage } from "#/chat/components/chat-message.tsx";
import { ChatMessageAction } from "#/chat/components/chat-message-action.tsx";
import { ChatMessageActions } from "#/chat/components/chat-message-actions.tsx";
import { ChatMessageBubble } from "#/chat/components/chat-message-bubble.tsx";
import { ChatMessageGroup } from "#/chat/components/chat-message-group.tsx";
import { ChatMessageList } from "#/chat/components/chat-message-list.tsx";
import { ChatMessagePressSurface } from "#/chat/components/chat-message-press-surface.tsx";
import { ChatMessageSender } from "#/chat/components/chat-message-sender.tsx";
import { ChatMessageText } from "#/chat/components/chat-message-text.tsx";
import { ChatMessageTime } from "#/chat/components/chat-message-time.tsx";
import { ChatProvider } from "#/chat/components/chat-provider.tsx";
import { ChatReaction } from "#/chat/components/chat-reaction.tsx";
import { ChatReactions } from "#/chat/components/chat-reactions.tsx";
import { ChatRoot } from "#/chat/components/chat-root.tsx";
import { ChatScrollButton } from "#/chat/components/chat-scroll-button.tsx";
import { ChatText } from "#/chat/components/chat-text.tsx";
import { ChatTime } from "#/chat/components/chat-time.tsx";
import { ChatTranscript } from "#/chat/components/chat-transcript.tsx";
import { ChatUnreadSeparator } from "#/chat/components/chat-unread-separator.tsx";
import { ChatViewport } from "#/chat/components/chat-viewport.tsx";

/**
 * The Chat parts as one namespace. The bubble, message, marker and scroller
 * anatomy (and their styling) are vendored from shadcn/ui's Base UI components;
 * the composer, conversation rows and link-confirmation pieces are ours. Purely
 * presentational: every string (labels, names, placeholders) comes in via props
 * so the kit stays i18n- and domain-agnostic.
 *
 * Composition:
 *   <Chat.Provider autoScroll>
 *     <Chat.Root>
 *       <Chat.Viewport aria-label="Messages">
 *         <Chat.Transcript>
 *           <Chat.Item messageId="day-1">
 *             <Chat.DateSeparator>Aujourd'hui</Chat.DateSeparator>
 *           </Chat.Item>
 *           <Chat.Item messageId="m1">
 *             <Chat.Message align="start">
 *               <Chat.Avatar>…</Chat.Avatar>
 *               <Chat.Content>
 *                 <Chat.Header>Jeanne D. <Badge>…</Badge></Chat.Header>
 *                 <Chat.BubbleGroup>
 *                   <Chat.Bubble variant="muted">
 *                     <Chat.BubbleContent>
 *                       <Chat.Text>Bonjour !</Chat.Text>
 *                       <Chat.Time dateTime="…">09:12</Chat.Time>
 *                     </Chat.BubbleContent>
 *                   </Chat.Bubble>
 *                 </Chat.BubbleGroup>
 *               </Chat.Content>
 *             </Chat.Message>
 *           </Chat.Item>
 *         </Chat.Transcript>
 *       </Chat.Viewport>
 *       <Chat.ScrollButton label="Nouveaux messages" />
 *     </Chat.Root>
 *   </Chat.Provider>
 *   <Chat.Composer … />
 *
 * `MessageList`, `MessageGroup`, `MessageBubble`, `MessageSender`,
 * `MessageText` and `MessageTime` are the earlier, self-scrolling anatomy kept
 * for the screens still on it.
 */
export const Chat = {
	// Scroller
	Provider: ChatProvider,
	Root: ChatRoot,
	Viewport: ChatViewport,
	Transcript: ChatTranscript,
	Item: ChatItem,
	ScrollButton: ChatScrollButton,
	// Message row
	Group: ChatGroup,
	Message: ChatMessage,
	Avatar: ChatAvatar,
	Content: ChatContent,
	Header: ChatHeader,
	Footer: ChatFooter,
	// Bubble
	BubbleGroup: ChatBubbleGroup,
	Bubble: ChatBubble,
	BubbleContent: ChatBubbleContent,
	Reactions: ChatReactions,
	Reaction: ChatReaction,
	MessageActions: ChatMessageActions,
	MessageAction: ChatMessageAction,
	MessagePressSurface: ChatMessagePressSurface,
	// Marker
	Marker: ChatMarker,
	MarkerIcon: ChatMarkerIcon,
	MarkerContent: ChatMarkerContent,
	DateSeparator: ChatDateSeparator,
	UnreadSeparator: ChatUnreadSeparator,
	// Body helpers
	Text: ChatText,
	Time: ChatTime,
	ExternalLinkDialog: ChatExternalLinkDialog,
	// Composer + conversation list
	Composer: ChatComposer,
	ConversationItem: ChatConversationItem,
	// Self-scrolling message list anatomy
	MessageList: ChatMessageList,
	MessageGroup: ChatMessageGroup,
	MessageBubble: ChatMessageBubble,
	MessageSender: ChatMessageSender,
	MessageText: ChatMessageText,
	MessageTime: ChatMessageTime,
};
