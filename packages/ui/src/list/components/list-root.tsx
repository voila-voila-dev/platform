import type * as React from "react";
import { Item } from "#/item/components/item.tsx";
import { cn } from "#/lib/utils.ts";

interface Props
	extends Omit<React.ComponentProps<typeof Item.Group>, "render"> {}

export function ListRoot({ className, ...props }: Props) {
	return (
		<Item.Group
			data-slot="list"
			render={
				// biome-ignore lint/a11y/noRedundantRoles: Safari/VoiceOver drop the implicit list role once list-style is none; the explicit role restores it.
				<ul role="list" />
			}
			className={cn("list-none", className)}
			{...props}
		/>
	);
}
