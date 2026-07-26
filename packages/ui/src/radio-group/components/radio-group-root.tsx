import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "#/lib/utils.ts";

interface Props extends RadioGroupPrimitive.Props {
	/**
	 * Layout direction of the items. `vertical` stacks them (the default);
	 * `horizontal` lays them out in a wrapping row - saves consumers from
	 * rebuilding a `flex-row` wrapper for short option sets.
	 */
	orientation?: "vertical" | "horizontal";
}

export function RadioGroupRoot({
	className,
	orientation = "vertical",
	...props
}: Props) {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			data-orientation={orientation}
			className={cn(
				orientation === "horizontal"
					? "flex flex-wrap items-center gap-x-4 gap-y-2"
					: "grid gap-2",
				className,
			)}
			{...props}
		/>
	);
}
