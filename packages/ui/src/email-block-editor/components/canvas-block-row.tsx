import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { emailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { CanvasBlockRowToolbar } from "#/email-block-editor/components/canvas-block-row-toolbar.tsx";
import { GridBlockCells } from "#/email-block-editor/components/grid-block-cells.tsx";
import {
	useEmailEditorActions,
	useEmailEditorConfig,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { SortableBlockItem } from "#/email-block-editor/dnd/sortable-block-item.tsx";
import type { EmailEditorContainerId } from "#/email-block-editor/document/reducer.ts";
import type { EmailEditorBlock } from "#/email-block-editor/document/types.ts";
import { isEmailEditorGridBlock } from "#/email-block-editor/document/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	block: EmailEditorBlock;
	index: number;
	containerId: EmailEditorContainerId;
	/** Where to render the toolbar when the row's own column is too narrow for
	 * it; see {@link GridBlockCells}. */
	toolbarSlot?: HTMLElement | null;
}

/**
 * One block on the canvas, wrapped in its selection affordance and
 * toolbar.
 */
export function CanvasBlockRow({
	block,
	index,
	containerId,
	toolbarSlot = null,
}: Props) {
	const { selectedBlockId, preview } = useEmailEditorState();
	const { updateBlock, selectBlock } = useEmailEditorActions();
	const { onUploadImage } = useEmailEditorConfig();
	const selected = selectedBlockId === block.id;
	const definition = emailBlockDefinition(block);
	const grid = isEmailEditorGridBlock(block) ? block : null;
	const viewProps: EmailBlockComponentProps = {
		block,
		selected,
		preview,
		onChange: updateBlock,
		onUploadImage,
	};
	// Selecting the innermost block: the child's handler runs first and stops
	// the event, so clicking inside a grid cell never selects the grid.
	const select = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();
		selectBlock(block.id);
	};

	return (
		<SortableBlockItem
			blockId={block.id}
			className={cn(
				"group relative rounded-lg py-3",
				// Every row's *content* starts at its container's edge, root or
				// cell — that alignment is what makes the canvas read as one email.
				// The padding that gives the selection ring its breathing room is
				// cancelled by an equal negative margin, so it never shifts content.
				// A cell gets half the 16px gutter on each side, so two neighbouring
				// rings meet exactly rather than overlapping.
				containerId === null ? "-mx-3 px-3" : "-mx-2 px-2",
				selected && "ring-2 ring-ring/50",
			)}
		>
			{(handle) => (
				<>
					{selected ? (
						<CanvasBlockRowToolbar
							block={block}
							index={index}
							containerId={containerId}
							handle={handle}
							toolbarSlot={toolbarSlot}
						/>
					) : null}
					{/* Selection follows focus (most blocks host a focusable control)
					    plus plain clicks for non-editable blocks like the divider. */}
					{/* biome-ignore lint/a11y/noStaticElementInteractions: selection sugar; the real controls inside stay keyboard-accessible. */}
					{/* biome-ignore lint/a11y/useKeyWithClickEvents: same as above. */}
					<div onClick={select} onFocus={select}>
						{grid === null ? (
							<definition.View {...viewProps} />
						) : (
							<GridBlockCells block={grid} />
						)}
					</div>
				</>
			)}
		</SortableBlockItem>
	);
}
