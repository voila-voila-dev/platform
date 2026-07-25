import * as React from "react";
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

function Kbd({
	className,
	size = "default",
	...props
}: React.ComponentProps<"kbd"> & VariantProps<typeof kbdVariants>) {
	return (
		<kbd
			data-slot="kbd"
			data-size={size}
			className={cn(kbdVariants({ size }), className)}
			{...props}
		/>
	);
}

function KbdGroup({
	className,
	separator,
	children,
	...props
}: React.ComponentProps<"kbd"> & { separator?: React.ReactNode }) {
	return (
		<kbd
			data-slot="kbd-group"
			className={cn(
				"inline-flex items-center gap-1 text-muted-foreground",
				className,
			)}
			{...props}
		>
			{separator === undefined
				? children
				: React.Children.toArray(children).map((child, index) => (
						<React.Fragment key={index}>
							{index > 0 && (
								<span aria-hidden="true" data-slot="kbd-separator">
									{separator}
								</span>
							)}
							{child}
						</React.Fragment>
					))}
		</kbd>
	);
}

export { Kbd, KbdGroup };
