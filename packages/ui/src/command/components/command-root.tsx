import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof CommandPrimitive> {}

export function CommandRoot({ className, ...props }: Props) {
	return (
		<CommandPrimitive
			data-slot="command"
			className={cn(
				"flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
				className,
			)}
			{...props}
		/>
	);
}
