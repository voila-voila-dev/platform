import type * as React from "react";
import { buttonGroupVariants } from "#/button-group/components/button-group-variants.ts";
import { ButtonGroupContext } from "#/button-group/context/button-group-context.ts";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends React.ComponentProps<"div">,
		VariantProps<typeof buttonGroupVariants> {}

export function ButtonGroupRoot({
	className,
	orientation = "horizontal",
	...props
}: Props) {
	return (
		<ButtonGroupContext.Provider value={orientation}>
			<div
				role="group"
				data-slot="button-group"
				data-orientation={orientation}
				className={cn(buttonGroupVariants({ orientation }), className)}
				{...props}
			/>
		</ButtonGroupContext.Provider>
	);
}
