import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Status/actions line under the bubbles; follows the row's alignment. */
export function ChatFooter({ className, ...props }: Props) {
	return (
		<div
			data-slot="chat-footer"
			className={cn(
				"flex max-w-full min-w-0 items-center gap-1.5 px-3 font-medium text-muted-foreground text-xs group-data-[align=end]/message:justify-end group-has-data-[variant=ghost]/message:px-0",
				className,
			)}
			{...props}
		/>
	);
}
