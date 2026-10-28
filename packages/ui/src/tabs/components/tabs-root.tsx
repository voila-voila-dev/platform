import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";

import { cn } from "#/lib/utils.ts";

interface Props extends TabsPrimitive.Root.Props {}

export function TabsRoot({ className, ...props }: Props) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn(
				"group/tabs flex gap-2 data-[orientation=horizontal]:flex-col",
				className,
			)}
			{...props}
		/>
	);
}
