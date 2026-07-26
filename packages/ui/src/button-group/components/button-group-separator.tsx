import * as React from "react";
import { ButtonGroupContext } from "#/button-group/context/button-group-context.ts";
import { cn } from "#/lib/utils.ts";
import { Separator } from "#/separator/components/separator.tsx";

interface Props extends React.ComponentProps<typeof Separator> {}

export function ButtonGroupSeparator({
	className,
	orientation,
	...props
}: Props) {
	const groupOrientation = React.useContext(ButtonGroupContext);
	return (
		<Separator
			data-slot="button-group-separator"
			orientation={
				orientation ??
				(groupOrientation === "horizontal" ? "vertical" : "horizontal")
			}
			className={cn(
				"relative self-stretch bg-input data-[orientation=horizontal]:mx-px data-[orientation=horizontal]:w-auto data-[orientation=vertical]:my-px data-[orientation=vertical]:h-auto",
				className,
			)}
			{...props}
		/>
	);
}
