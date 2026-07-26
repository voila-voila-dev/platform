import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {}

export function ChipRemove({ className, children, ...props }: Props) {
	return (
		<button
			type="button"
			data-slot="chip-remove"
			aria-label="Remove"
			className={cn(
				"inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-60 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&>svg]:size-2.5",
				className,
			)}
			{...props}
		>
			{children ?? <XIcon aria-hidden />}
		</button>
	);
}
