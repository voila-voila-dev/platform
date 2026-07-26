import type * as React from "react";
import { Item } from "#/item/components/item.tsx";

interface Props
	extends Omit<React.ComponentProps<typeof Item.Root>, "render"> {}

export function ListItem(props: Props) {
	return <Item.Root data-slot="list-item" render={<li />} {...props} />;
}
