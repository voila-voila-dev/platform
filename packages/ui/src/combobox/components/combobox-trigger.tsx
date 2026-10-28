import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends ComboboxPrimitive.Trigger.Props {}

export function ComboboxTrigger({
	className,
	children,
	"aria-label": ariaLabel = "Open list",
	...props
}: Props) {
	return (
		<ComboboxPrimitive.Trigger
			data-slot="combobox-trigger"
			aria-label={ariaLabel}
			className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
			{...props}
		>
			{children}
			<CaretDownIcon className="pointer-events-none size-4 text-muted-foreground" />
		</ComboboxPrimitive.Trigger>
	);
}
