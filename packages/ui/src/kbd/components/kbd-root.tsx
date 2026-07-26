import type * as React from "react";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

const kbdVariants = cva({
	base: "pointer-events-none inline-flex w-fit items-center justify-center rounded-sm bg-muted font-sans font-medium text-muted-foreground select-none in-data-[slot=input-group-addon]:rounded-[calc(var(--radius)-5px)] in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10",
	variants: {
		size: {
			default:
				"h-5 min-w-5 gap-1 px-1 text-xs [&_svg:not([class*='size-'])]:size-3",
			sm: "h-4 min-w-4 gap-0.5 px-0.5 text-[10px] [&_svg:not([class*='size-'])]:size-2.5",
		},
	},
});

interface Props
	extends React.ComponentProps<"kbd">,
		VariantProps<typeof kbdVariants> {}

export function KbdRoot({ className, size = "default", ...props }: Props) {
	return (
		<kbd
			data-slot="kbd"
			data-size={size}
			className={cn(kbdVariants({ size }), className)}
			{...props}
		/>
	);
}
