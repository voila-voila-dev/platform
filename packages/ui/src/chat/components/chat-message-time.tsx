import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"time"> {}

export function ChatMessageTime({ className, ...props }: Props) {
	return (
		<time
			data-slot="chat-message-time"
			className={cn(
				"select-none text-xs opacity-70 group-data-[align=end]:text-primary-foreground",
				className,
			)}
			{...props}
		/>
	);
}
