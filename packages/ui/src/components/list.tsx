import type * as React from "react";

import { Item, ItemGroup, ItemSeparator } from "#/components/item.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Semantic `ul`/`li` counterparts of `ItemGroup`/`Item`: same styling and
 * variants, but screen readers announce the collection and its size. The
 * explicit `role="list"` restores list semantics that Safari/VoiceOver drop
 * once `list-style: none` is applied.
 */
function List({
	className,
	...props
}: Omit<React.ComponentProps<typeof ItemGroup>, "render">) {
	return (
		<ItemGroup
			data-slot="list"
			render={
				// biome-ignore lint/a11y/noRedundantRoles: Safari/VoiceOver drop the implicit list role once list-style is none; the explicit role restores it.
				<ul role="list" />
			}
			className={cn("list-none", className)}
			{...props}
		/>
	);
}

function ListItem(props: Omit<React.ComponentProps<typeof Item>, "render">) {
	return <Item data-slot="list-item" render={<li />} {...props} />;
}

/** A separator between list items, hidden from the accessibility tree so it
 * does not count as an item and the `ul` only contains `li` children. */
function ListSeparator({
	className,
	...props
}: React.ComponentProps<typeof ItemSeparator>) {
	return (
		<li role="presentation" aria-hidden="true" data-slot="list-separator">
			<ItemSeparator className={className} {...props} />
		</li>
	);
}

export { List, ListItem, ListSeparator };
