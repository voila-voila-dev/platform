import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";

interface Props extends CollapsiblePrimitive.Root.Props {}

export function CollapsibleRoot({ className, ...props }: Props) {
	return (
		<CollapsiblePrimitive.Root
			data-slot="collapsible"
			className={className}
			{...props}
		/>
	);
}
