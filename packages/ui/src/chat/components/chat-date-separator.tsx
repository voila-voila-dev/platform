import type * as React from "react";
import { ChatMarkerContent } from "#/chat/components/chat-marker-content.tsx";
import { chatMarkerVariants } from "#/chat/components/chat-marker-variants.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Day boundary rule: a centered label between two hairlines. */
export function ChatDateSeparator({ className, children, ...props }: Props) {
	return (
		<div
			data-slot="chat-date-separator"
			role="separator"
			className={cn(
				cn(chatMarkerVariants({ variant: "separator" })),
				"group/marker py-1 text-xs",
				className,
			)}
			{...props}
		>
			<ChatMarkerContent>{children}</ChatMarkerContent>
		</div>
	);
}
