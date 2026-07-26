import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import * as React from "react";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";
import type { toggleVariants } from "#/toggle/components/toggle-variants.ts";
import { ToggleGroupContext } from "#/toggle-group/context/toggle-group-context.ts";

interface Props
	extends ToggleGroupPrimitive.Props,
		VariantProps<typeof toggleVariants> {
	spacing?: number;
	orientation?: "horizontal" | "vertical";
}

export function ToggleGroupRoot({
	className,
	variant,
	size,
	spacing = 0,
	orientation = "horizontal",
	children,
	...props
}: Props) {
	const context = React.useMemo(
		() => ({ variant, size, spacing, orientation }),
		[variant, size, spacing, orientation],
	);

	return (
		<ToggleGroupPrimitive
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			data-spacing={spacing}
			orientation={orientation}
			style={{ "--gap": spacing } as React.CSSProperties}
			className={cn(
				"group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
				className,
			)}
			{...props}
		>
			<ToggleGroupContext.Provider value={context}>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive>
	);
}
