import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "#/lib/utils.ts";

interface Props extends TabsPrimitive.Panel.Props {}

export function TabsContent({ className, ...props }: Props) {
	return (
		<TabsPrimitive.Panel
			data-slot="tabs-content"
			className={cn(
				// Inactive panels are unmounted, so the fade runs on each switch.
				"flex-1 animate-in text-sm outline-none fade-in-0 motion-reduce:animate-none!",
				className,
			)}
			{...props}
		/>
	);
}
