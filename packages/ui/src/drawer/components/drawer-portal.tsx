import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

interface Props extends React.ComponentProps<typeof DrawerPrimitive.Portal> {}

export function DrawerPortal(props: Props) {
	return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}
