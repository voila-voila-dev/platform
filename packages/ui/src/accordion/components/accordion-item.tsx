import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "#/lib/utils.ts";

interface Props extends AccordionPrimitive.Item.Props {}

export function AccordionItem({ className, ...props }: Props) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn("not-last:border-b", className)}
			{...props}
		/>
	);
}
