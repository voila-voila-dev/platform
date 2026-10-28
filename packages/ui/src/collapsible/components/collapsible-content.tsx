import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { cn } from "#/lib/utils.ts";

interface Props extends CollapsiblePrimitive.Panel.Props {}

export function CollapsibleContent({ className, ...props }: Props) {
	return (
		<CollapsiblePrimitive.Panel
			data-slot="collapsible-content"
			className={cn(
				"h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-200 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none",
				className,
			)}
			{...props}
		/>
	);
}
