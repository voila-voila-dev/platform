import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

interface Props extends React.ComponentProps<typeof DrawerPrimitive.Trigger> {}

export function DrawerTrigger(props: Props) {
	return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}
