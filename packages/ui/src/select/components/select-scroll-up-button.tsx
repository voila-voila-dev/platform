import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CaretUpIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends SelectPrimitive.ScrollUpArrow.Props {}

export function SelectScrollUpButton({ className, ...props }: Props) {
	return (
		<SelectPrimitive.ScrollUpArrow
			data-slot="select-scroll-up-button"
			className={cn(
				"top-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<CaretUpIcon />
		</SelectPrimitive.ScrollUpArrow>
	);
}
