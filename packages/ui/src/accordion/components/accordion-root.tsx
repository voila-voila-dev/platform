import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "#/lib/utils.ts";

interface Props extends AccordionPrimitive.Root.Props {}

export function AccordionRoot({
	className,
	multiple = false,
	...props
}: Props) {
	return (
		<AccordionPrimitive.Root
			data-slot="accordion"
			className={cn("flex w-full flex-col", className)}
			multiple={multiple}
			{...props}
		/>
	);
}
