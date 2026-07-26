import { Badge } from "#/badge/components/badge.tsx";

interface Props {
	unreadCount: number;
	unreadLabel?: string;
}

export function ChatConversationItemUnreadBadge({
	unreadCount,
	unreadLabel,
}: Props) {
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
