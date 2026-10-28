import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { Command as CommandPrimitive } from "cmdk";
import type * as React from "react";
import { InputGroup } from "#/input-group/components/input-group.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof CommandPrimitive.Input> {}

export function CommandInput({ className, ...props }: Props) {
	return (
		<div data-slot="command-input-wrapper" className="p-1 pb-0">
			<InputGroup.Root className="h-8! rounded-lg! border-input/30 bg-input/30 shadow-none! *:data-[slot=input-group-addon]:pl-2!">
				<CommandPrimitive.Input
					data-slot="command-input"
					className={cn(
						"w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				/>
				<InputGroup.Addon>
					<MagnifyingGlassIcon className="size-4 shrink-0 opacity-50" />
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	);
}
