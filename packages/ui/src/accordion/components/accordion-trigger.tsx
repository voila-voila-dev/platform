import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { CaretDownIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends AccordionPrimitive.Trigger.Props {}

export function AccordionTrigger({ className, children, ...props }: Props) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					"group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
					className,
				)}
				{...props}
			>
				{children}
				<CaretDownIcon
					data-slot="accordion-trigger-icon"
					className="pointer-events-none shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180 motion-reduce:transition-none"
				/>
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}
