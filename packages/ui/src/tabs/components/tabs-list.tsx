import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import type { VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";
import { tabsListVariants } from "#/tabs/components/tabs-list-variants.ts";

interface Props
	extends TabsPrimitive.List.Props,
		VariantProps<typeof tabsListVariants> {}

export function TabsList({ className, variant = "default", ...props }: Props) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			data-variant={variant}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		/>
	);
}
