import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props {
	timestamp?: React.ReactNode;
	unread: boolean;
}

export function ChatConversationItemTimestamp({ timestamp, unread }: Props) {
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
