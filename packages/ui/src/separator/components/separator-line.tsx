import type { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"span"> {
	orientation: NonNullable<SeparatorPrimitive.Props["orientation"]>;
}

export function SeparatorLine({ orientation, className, ...props }: Props) {
	return (
		<span
			aria-hidden
			data-slot="separator-line"
			className={cn(
				"flex-1 bg-border",
				orientation === "vertical" ? "w-px" : "h-px",
				className,
			)}
			{...props}
		/>
	);
}
