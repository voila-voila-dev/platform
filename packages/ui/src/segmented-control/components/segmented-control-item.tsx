import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SegmentedControlContext } from "#/segmented-control/context/segmented-control-context.ts";

interface Props extends RadioPrimitive.Root.Props {}

export function SegmentedControlItem({ className, ...props }: Props) {
	const { size } = React.useContext(SegmentedControlContext);

	return (
		<RadioPrimitive.Root
			data-slot="segmented-control-item"
			data-size={size}
			className={cn(
				// The thumb slides behind the items, so items keep a transparent
				// background and only transition their text color.
				"inline-flex h-full min-w-0 items-center justify-center gap-1.5 rounded-md border border-transparent px-2.5 text-sm font-medium whitespace-nowrap text-foreground/60 outline-none transition-colors hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:text-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-[size=sm]:px-2 data-[size=sm]:text-[0.8rem] dark:text-muted-foreground dark:hover:text-foreground dark:data-checked:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[size=sm]:[&_svg:not([class*='size-'])]:size-3.5",
				className,
			)}
			{...props}
		/>
	);
}
