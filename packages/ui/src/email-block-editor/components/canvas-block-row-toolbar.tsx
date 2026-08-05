import type { ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import { EMAIL_LEAF_BLOCK_TYPES } from "#/email-block-editor/blocks/block-definitions.tsx";
import { BlockToolbar } from "#/email-block-editor/components/block-toolbar.tsx";
import {
	useEmailEditorActions,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { SortableBlockHandle } from "#/email-block-editor/dnd/sortable-block-list.ts";
import type { EmailEditorContainerId } from "#/email-block-editor/document/reducer.ts";
import type { EmailEditorBlock } from "#/email-block-editor/document/types.ts";
import { cn } from "#/lib/utils.ts";

/** Render `node` into `slot`, or in place when there is no slot. */
const renderIn = (slot: HTMLElement | null, node: ReactElement): ReactNode =>
	slot === null ? node : createPortal(node, slot);
/** Blocks whose content is edited through the span model, and therefore want
 * the toolbar's bold/italic/underline/link group. */
const RICH_TEXT_BLOCK_TYPES: ReadonlySet<string> = new Set([
	"paragraph",
	"list",
	"rating",
]);

interface Props {
	block: EmailEditorBlock;
	index: number;
	containerId: EmailEditorContainerId;
	handle: SortableBlockHandle;
	toolbarSlot: HTMLElement | null;
}

/**
 * The controls of the selected row. It stays mounted while dragging — dnd-kit
 * holds a reference to the drag handle it contains — but is hidden, so it
 * stops floating over the neighbouring blocks' text.
 *
 * Under a touch pointer the 44px bar is too tall to float without covering the
 * previous block, so it sits in the flow above its own block; a row inside a
 * grid cell hands it to the grid instead, which has the width for it. The
 * portal keeps it in this row's React tree, so dnd-kit and the selection
 * handlers are unaffected.
 */
// fallow-ignore-next-line complexity -- prop wiring: one dispatch per toolbar action, plus the nested/root split.
/** The per-block toolbar shown on the canvas: reorder, duplicate, delete. */
export function CanvasBlockRowToolbar({
	block,
	index,
	containerId,
	handle,
	toolbarSlot,
}: Props) {
	const { coarsePointer } = useEmailEditorState();
	const {
		addBlock,
		duplicateBlock,
		removeBlock,
		selectBlock,
		openBlockSettings,
	} = useEmailEditorActions();
	const nested = containerId !== null;
	return renderIn(
		toolbarSlot,
		<div
			className={cn(
				toolbarSlot !== null || coarsePointer
					? "mb-2"
					: "-top-9 absolute right-0 z-10",
				handle.isDragging && "pointer-events-none opacity-0",
			)}
		>
			<BlockToolbar
				handle={handle}
				richText={RICH_TEXT_BLOCK_TYPES.has(block.type)}
				coarsePointer={coarsePointer}
				addableTypes={nested ? EMAIL_LEAF_BLOCK_TYPES : undefined}
				onAddBelow={(type) => addBlock(type, { containerId, index: index + 1 })}
				onDuplicate={() => duplicateBlock(block.id)}
				onRemove={() => removeBlock(block.id)}
				onOpenSettings={openBlockSettings}
				onSelectContainer={nested ? () => selectBlock(containerId) : undefined}
			/>
		</div>,
	);
}
