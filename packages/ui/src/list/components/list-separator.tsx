import type * as React from "react";

import { Item } from "#/item/components/item.tsx";

interface Props extends React.ComponentProps<typeof Item.Separator> {}

export function ListSeparator({ className, ...props }: Props) {
	return (
		<li role="presentation" aria-hidden="true" data-slot="list-separator">
			<Item.Separator className={className} {...props} />
		</li>
	);
}
