import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props {
	title: React.ReactNode;
	description?: React.ReactNode;
	badges?: React.ReactNode;
	unread: boolean;
}

/** The row's text column: title with trailing badges, then the description. */
export function ChatConversationItemText({
	title,
	description,
	badges,
	unread,
}: Props) {
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
