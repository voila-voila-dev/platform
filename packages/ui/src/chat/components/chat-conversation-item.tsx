import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";
import { ChatConversationItemMeta } from "#/chat/components/chat-conversation-item-meta.tsx";
import { ChatConversationItemText } from "#/chat/components/chat-conversation-item-text.tsx";
import { cn } from "#/lib/utils.ts";

// Intersection, not `extends`: `title` here is a ReactNode, which conflicts
// with the DOM `title` attribute an interface would have to stay assignable to.
type Props = useRender.ComponentProps<"div"> & {
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
};

export function ChatConversationItem({
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
}: Props) {
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
