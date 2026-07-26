import type {
	DraggableAttributes,
	DraggableSyntheticListeners,
} from "@dnd-kit/core";
/**
 * Containers are droppable in their own right — that is how a block lands in
 * an empty grid, or below the last block of the document. Their droppable ids
 * are namespaced so they never collide with the block ids of the sortables.
 */
export const CONTAINER_PREFIX = "container:";
export const ROOT_CONTAINER = `${CONTAINER_PREFIX}root`;
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
