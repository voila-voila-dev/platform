import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof CommandPrimitive.Empty> {}

export function CommandEmpty({ className, ...props }: Props) {
	return (
		<CommandPrimitive.Empty
			data-slot="command-empty"
			className={cn(
				"py-6 text-center text-sm text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}
