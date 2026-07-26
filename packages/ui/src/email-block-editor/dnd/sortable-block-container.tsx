import { useDroppable } from "@dnd-kit/core";
import {
	rectSortingStrategy,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type * as React from "react";
import {
	CONTAINER_PREFIX,
	ROOT_CONTAINER,
} from "#/email-block-editor/dnd/sortable-block-list.ts";
import type { EmailEditorContainerId } from "#/email-block-editor/document/reducer.ts";

const containerDroppableId = (containerId: EmailEditorContainerId): string =>
	containerId === null ? ROOT_CONTAINER : `${CONTAINER_PREFIX}${containerId}`;

interface Props extends React.ComponentProps<"div"> {
	containerId: EmailEditorContainerId;
	blockIds: ReadonlyArray<string>;
	layout: "list" | "grid";
}

/**
 * One container's sortable children. `layout` picks the sorting strategy: a
 * vertical list for the document root, a rectangular one for a grid's cells.
 * The wrapper is itself droppable, which is what lets a block land in an empty
 * grid or in the blank space under the last block.
 */
export function SortableBlockContainer({
	containerId,
	blockIds,
	layout,
	children,
	...props
}: Props) {
	const { setNodeRef } = useDroppable({
		id: containerDroppableId(containerId),
	});
	return (
		<SortableContext
			items={[...blockIds]}
			strategy={
				layout === "grid" ? rectSortingStrategy : verticalListSortingStrategy
			}
		>
			<div ref={setNodeRef} {...props}>
				{children}
			</div>
		</SortableContext>
	);
}
