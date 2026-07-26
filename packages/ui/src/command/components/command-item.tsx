import { CheckIcon } from "@phosphor-icons/react";
import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";
import { menuItemVariants } from "#/menu/components/menu-variants.ts";

interface Props extends React.ComponentProps<typeof CommandPrimitive.Item> {}

export function CommandItem({ className, children, ...props }: Props) {
	return (
		<CommandPrimitive.Item
			data-slot="command-item"
			className={cn(
				menuItemVariants(),
				"in-data-[slot=dialog-content]:rounded-lg!",
				className,
			)}
			{...props}
		>
			{children}
			<CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/menu-item:hidden group-data-[checked=true]/menu-item:opacity-100" />
		</CommandPrimitive.Item>
	);
}
