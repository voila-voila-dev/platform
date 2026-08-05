import type { CollisionDetection, DragEndEvent } from "@dnd-kit/core";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	rectIntersection,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import type { EmailEditorRegistry } from "#/email-block-editor/blocks/registry.ts";
import {
	CONTAINER_PREFIX,
	ROOT_CONTAINER,
} from "#/email-block-editor/dnd/sortable-block-list.ts";
import type { EmailEditorContainerId } from "#/email-block-editor/document/reducer.ts";
import {
	emailEditorContainerBlocks,
	emailEditorContainerOf,
} from "#/email-block-editor/document/reducer.ts";
import type { EmailEditorBlockLike } from "#/email-block-editor/document/types.ts";

const containerIdFromDroppable = (
	droppableId: string,
): EmailEditorContainerId | undefined => {
	if (!droppableId.startsWith(CONTAINER_PREFIX)) {
		return undefined;
	}
	return droppableId === ROOT_CONTAINER
		? null
		: droppableId.slice(CONTAINER_PREFIX.length);
};
/**
 * Rank a droppable by how specific it is, so the deepest target under the
 * pointer wins: a block nested in a grid beats that grid's own drop area,
 * which beats a root-level block (the grid's sortable node is one), which
 * beats the document root. Without this a drop aimed inside a grid would land
 * beside it.
 */
const droppableDepth = (
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<EmailEditorBlockLike>,
	droppableId: string,
): number => {
	if (droppableId === ROOT_CONTAINER) {
		return 3;
	}
	if (droppableId.startsWith(CONTAINER_PREFIX)) {
		return 1;
	}
	return emailEditorContainerOf(registry, blocks, droppableId) === null ? 2 : 0;
};
/** The container and index of a block that was dropped onto. */
const resolveDropOnBlock = (
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<EmailEditorBlockLike>,
	blockId: string,
): { containerId: EmailEditorContainerId; index: number } | undefined => {
	const containerId = emailEditorContainerOf(registry, blocks, blockId);
	if (containerId === undefined) {
		return undefined;
	}
	const siblings =
		emailEditorContainerBlocks(registry, blocks, containerId) ?? [];
	return {
		containerId,
		index: siblings.findIndex((block) => block.id === blockId),
	};
};

interface Props {
	registry: EmailEditorRegistry;
	blocks: ReadonlyArray<EmailEditorBlockLike>;
	onMove: (
		blockId: string,
		toContainerId: EmailEditorContainerId,
		toIndex: number,
	) => void;
	children: ReactNode;
}

/**
 * The dnd-kit context for the whole document: one instance at the editor root,
 * one `SortableContext` per container below it. Reordering is announced
 * through `onMove` with the dragged block id and its destination container and
 * index; the document itself stays owned by the editor reducer.
 */
export function EmailEditorDndContext({
	registry,
	blocks,
	onMove,
	children,
}: Props) {
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const collisionDetection: CollisionDetection = (args) => {
		const found = pointerWithin(args);
		const collisions = found.length > 0 ? found : rectIntersection(args);
		return [...collisions].sort(
			(left, right) =>
				droppableDepth(registry, blocks, String(left.id)) -
				droppableDepth(registry, blocks, String(right.id)),
		);
	};

	// fallow-ignore-next-line complexity -- one destination resolution with its guards; cognitive complexity is 7.
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over === null || active.id === over.id) {
			return;
		}
		const activeId = String(active.id);
		const overId = String(over.id);
		const overContainer = containerIdFromDroppable(overId);

		const destination =
			overContainer !== undefined
				? {
						containerId: overContainer,
						index: (
							emailEditorContainerBlocks(registry, blocks, overContainer) ?? []
						).length,
					}
				: resolveDropOnBlock(registry, blocks, overId);
		if (destination === undefined) {
			return;
		}

		// A container the destination refuses — a grid aimed at a grid's cell —
		// drops beside that container instead of doing nothing.
		const activeBlock = blocks.find((block) => block.id === activeId);
		const destinationType =
			destination.containerId === null
				? undefined
				: blocks.find((block) => block.id === destination.containerId)?.type;
		if (
			activeBlock !== undefined &&
			destinationType !== undefined &&
			!registry.accepts(destinationType, activeBlock.type)
		) {
			const rootIndex = blocks.findIndex(
				(block) => block.id === destination.containerId,
			);
			onMove(activeId, null, rootIndex === -1 ? blocks.length : rootIndex);
			return;
		}
		onMove(activeId, destination.containerId, destination.index);
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetection}
			onDragEnd={handleDragEnd}
		>
			{children}
		</DndContext>
	);
}
