import {
	type CollisionDetection,
	DndContext,
	type DragEndEvent,
	type DraggableAttributes,
	type DraggableSyntheticListeners,
	KeyboardSensor,
	PointerSensor,
	pointerWithin,
	rectIntersection,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	rectSortingStrategy,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ReactNode } from "react";
import {
	type EmailEditorContainerId,
	emailEditorContainerBlocks,
	emailEditorContainerOf,
} from "#/document/reducer.ts";
import {
	type EmailEditorBlock,
	isEmailEditorGridBlock,
} from "#/document/types.ts";

/**
 * Containers are droppable in their own right — that is how a block lands in
 * an empty grid, or below the last block of the document. Their droppable ids
 * are namespaced so they never collide with the block ids of the sortables.
 */
const CONTAINER_PREFIX = "container:";
const ROOT_CONTAINER = `${CONTAINER_PREFIX}root`;

const containerDroppableId = (containerId: EmailEditorContainerId): string =>
	containerId === null ? ROOT_CONTAINER : `${CONTAINER_PREFIX}${containerId}`;

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
 * What a sortable item hands to its drag handle: spread `attributes` and
 * `listeners` on the handle element and pass it `setActivatorNodeRef`, so the
 * drag starts from the handle only (keyboard included) and the block's inputs
 * stay freely clickable.
 */
export interface SortableBlockHandle {
	readonly attributes: DraggableAttributes;
	readonly listeners: DraggableSyntheticListeners;
	readonly setActivatorNodeRef: (element: HTMLElement | null) => void;
	readonly isDragging: boolean;
}

/**
 * Rank a droppable by how specific it is, so the deepest target under the
 * pointer wins: a block nested in a grid beats that grid's own drop area,
 * which beats a root-level block (the grid's sortable node is one), which
 * beats the document root. Without this a drop aimed inside a grid would land
 * beside it.
 */
const droppableDepth = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	droppableId: string,
): number => {
	if (droppableId === ROOT_CONTAINER) {
		return 3;
	}
	if (droppableId.startsWith(CONTAINER_PREFIX)) {
		return 1;
	}
	return emailEditorContainerOf(blocks, droppableId) === null ? 2 : 0;
};

/**
 * The dnd-kit context for the whole document: one instance at the editor root,
 * one `SortableContext` per container below it. Reordering is announced
 * through `onMove` with the dragged block id and its destination container and
 * index; the document itself stays owned by the editor reducer.
 */
export function EmailEditorDndContext({
	blocks,
	onMove,
	children,
}: {
	blocks: ReadonlyArray<EmailEditorBlock>;
	onMove: (
		blockId: string,
		toContainerId: EmailEditorContainerId,
		toIndex: number,
	) => void;
	children: ReactNode;
}) {
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
				droppableDepth(blocks, String(left.id)) -
				droppableDepth(blocks, String(right.id)),
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
						index: (emailEditorContainerBlocks(blocks, overContainer) ?? [])
							.length,
					}
				: resolveDropOnBlock(blocks, overId);
		if (destination === undefined) {
			return;
		}

		// A grid cannot nest: aiming one at something inside another grid drops
		// it beside that grid instead of doing nothing.
		const activeBlock = blocks.find((block) => block.id === activeId);
		if (
			activeBlock !== undefined &&
			isEmailEditorGridBlock(activeBlock) &&
			destination.containerId !== null
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

/** The container and index of a block that was dropped onto. */
const resolveDropOnBlock = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	blockId: string,
): { containerId: EmailEditorContainerId; index: number } | undefined => {
	const containerId = emailEditorContainerOf(blocks, blockId);
	if (containerId === undefined) {
		return undefined;
	}
	const siblings = emailEditorContainerBlocks(blocks, containerId) ?? [];
	return {
		containerId,
		index: siblings.findIndex((block) => block.id === blockId),
	};
};

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
	className,
	style,
	children,
}: {
	containerId: EmailEditorContainerId;
	blockIds: ReadonlyArray<string>;
	layout: "list" | "grid";
	className?: string;
	style?: React.CSSProperties;
	children: ReactNode;
}) {
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
			<div ref={setNodeRef} className={className} style={style}>
				{children}
			</div>
		</SortableContext>
	);
}

/** One draggable row; renders its content through a render prop that receives
 * the drag handle to attach to the block toolbar. */
export function SortableBlockItem({
	blockId,
	className,
	children,
}: {
	blockId: string;
	className?: string;
	children: (handle: SortableBlockHandle) => ReactNode;
}) {
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
			className={className}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				...(isDragging && { opacity: 0.6, zIndex: 1, position: "relative" }),
			}}
		>
			{children({ attributes, listeners, setActivatorNodeRef, isDragging })}
		</div>
	);
}
