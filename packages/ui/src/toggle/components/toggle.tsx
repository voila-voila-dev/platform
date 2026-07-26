import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";
import { toggleVariants } from "#/toggle/components/toggle-variants.ts";

interface Props
	extends TogglePrimitive.Props,
		VariantProps<typeof toggleVariants> {}

export function Toggle({
	className,
	variant = "default",
	size = "default",
	...props
}: Props) {
	return (
		<TogglePrimitive
			data-slot="toggle"
			className={cn(toggleVariants({ variant, size }), className)}
			{...props}
		/>
	);
}
