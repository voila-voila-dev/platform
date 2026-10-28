import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const inputGroupButtonVariants = cva({
	base: "flex items-center gap-2 text-sm shadow-none",
	variants: {
		size: {
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
			// `sm` intentionally adds nothing: it falls through to the underlying
			// `Button` default size (h-8), filling the group's full height.
			sm: "",
			"icon-xs":
				"size-6 rounded-[min(var(--radius-md),10px)] p-0 has-[>svg]:p-0",
			"icon-sm": "size-8 p-0 has-[>svg]:p-0",
		},
	},
	defaultVariants: {
		size: "xs",
	},
});

interface Props
	extends Omit<React.ComponentProps<typeof Button>, "size" | "type">,
		VariantProps<typeof inputGroupButtonVariants> {
	type?: "button" | "submit" | "reset";
}

export function InputGroupButton({
	className,
	type = "button",
	variant = "ghost",
	size = "xs",
	...props
}: Props) {
	return (
		<Button
			type={type}
			variant={variant}
			className={cn(inputGroupButtonVariants({ size }), className)}
			{...props}
		/>
	);
}
