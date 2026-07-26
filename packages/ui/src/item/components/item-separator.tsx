import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { Separator } from "#/separator/components/separator.tsx";

interface Props extends React.ComponentProps<typeof Separator> {}

export function ItemSeparator({ className, ...props }: Props) {
	return (
		<Separator
			data-slot="item-separator"
			orientation="horizontal"
			className={cn("my-2", className)}
			{...props}
		/>
	);
}
