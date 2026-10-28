import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

interface Props extends CollapsiblePrimitive.Trigger.Props {}

export function CollapsibleTrigger({ className, ...props }: Props) {
	return (
		<CollapsiblePrimitive.Trigger
			data-slot="collapsible-trigger"
			className={className}
			{...props}
		/>
	);
}
