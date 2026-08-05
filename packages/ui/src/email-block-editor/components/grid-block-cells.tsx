import { useState } from "react";
import { emailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import { CanvasBlockRow } from "#/email-block-editor/components/canvas-block-row.tsx";
import { GridAddCell } from "#/email-block-editor/components/grid-add-cell.tsx";
import {
	useEmailEditorActions,
	useEmailEditorConfig,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { SortableBlockContainer } from "#/email-block-editor/dnd/sortable-block-container.tsx";
import type { EmailEditorGridBlock } from "#/email-block-editor/document/types.ts";

interface Props {
	block: EmailEditorGridBlock;
}

/** A grid block's cells, each a drop target for leaf blocks. */
export function GridBlockCells({ block }: Props) {
	const { selectedBlockId, preview, coarsePointer } = useEmailEditorState();
	const { updateBlock } = useEmailEditorActions();
	const { onUploadImage } = useEmailEditorConfig();
	const definition = emailBlockDefinition(block);
	const selected = selectedBlockId === block.id;
	const showAddCell = selected || block.children.length === 0;
	// Under a touch pointer a cell is far too narrow for a row of 44px targets,
	// so a selected child's toolbar is portalled up here and gets the whole
	// grid's width. Under a mouse the toolbar floats and needs no help.
	const [toolbarSlot, setToolbarSlot] = useState<HTMLDivElement | null>(null);
	return (
		<SortableBlockContainer
			containerId={block.id}
			blockIds={block.children.map((child) => child.id)}
			layout="grid"
		>
			<div ref={setToolbarSlot} className="mb-2 empty:mb-0" />
			<definition.View
				block={block}
				selected={selected}
				preview={preview}
				onChange={updateBlock}
				onUploadImage={onUploadImage}
			>
				{block.children.map((child, index) => (
					<CanvasBlockRow
						key={child.id}
						block={child}
						index={index}
						containerId={block.id}
						toolbarSlot={coarsePointer ? toolbarSlot : null}
					/>
				))}
				{showAddCell ? <GridAddCell gridId={block.id} /> : null}
			</definition.View>
		</SortableBlockContainer>
	);
}
