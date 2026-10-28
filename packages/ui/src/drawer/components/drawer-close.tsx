import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

interface Props extends React.ComponentProps<typeof DrawerPrimitive.Close> {}

export function DrawerClose(props: Props) {
	return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}
