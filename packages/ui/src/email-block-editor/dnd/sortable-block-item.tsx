import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type * as React from "react";
import type { ReactNode } from "react";
import type { SortableBlockHandle } from "#/email-block-editor/dnd/sortable-block-list.ts";

// `children` is a render prop here, so it is replaced rather than inherited.
interface Props extends Omit<React.ComponentProps<"div">, "children"> {
	blockId: string;
	children: (handle: SortableBlockHandle) => ReactNode;
}

/** One draggable row; renders its content through a render prop that receives
 * the drag handle to attach to the block toolbar. */
export function SortableBlockItem({
	blockId,
	children,
	style,
	...props
}: Props) {
	const {
		attributes,
		listeners,
		setNodeRef,
		setActivatorNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: blockId });

	return (
		<div
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				...(isDragging && { opacity: 0.6, zIndex: 1, position: "relative" }),
				...style,
			}}
			{...props}
		>
			{children({ attributes, listeners, setActivatorNodeRef, isDragging })}
		</div>
	);
}
