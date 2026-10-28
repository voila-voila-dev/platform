import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends SelectPrimitive.ScrollDownArrow.Props {}

export function SelectScrollDownButton({ className, ...props }: Props) {
	return (
		<SelectPrimitive.ScrollDownArrow
			data-slot="select-scroll-down-button"
			className={cn(
				"bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*='size-'])]:size-4",
				className,
			)}
			{...props}
		>
			<CaretDownIcon />
		</SelectPrimitive.ScrollDownArrow>
	);
}
