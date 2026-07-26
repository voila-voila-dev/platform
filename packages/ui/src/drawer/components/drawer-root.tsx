import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

// Alias, not `interface … extends`: vaul's root props are a union of the
// controlled/uncontrolled shapes, which an interface cannot extend.
type Props = React.ComponentProps<typeof DrawerPrimitive.Root>;

export function DrawerRoot(props: Props) {
	return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}
