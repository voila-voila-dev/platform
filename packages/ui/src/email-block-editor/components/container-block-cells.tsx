import { useState } from "react";
import type { AnyEmailBlockDefinition } from "#/email-block-editor/blocks/registry.ts";
import { CanvasBlockRow } from "#/email-block-editor/components/canvas-block-row.tsx";
import { ContainerAddCell } from "#/email-block-editor/components/container-add-cell.tsx";
import {
	useEmailEditorActions,
	useEmailEditorConfig,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { SortableBlockContainer } from "#/email-block-editor/dnd/sortable-block-container.tsx";
import type { EmailEditorBlockLike } from "#/email-block-editor/document/types.ts";

interface Props {
	block: EmailEditorBlockLike;
	/** Known to be a container: the caller checked before rendering this. */
	definition: AnyEmailBlockDefinition;
}

/** A container block's cells, each a drop target for the types it accepts. */
export function ContainerBlockCells({ block, definition }: Props) {
	const { selectedBlockId, preview, coarsePointer } = useEmailEditorState();
	const { updateBlock } = useEmailEditorActions();
	const { onUploadImage } = useEmailEditorConfig();
	const container = definition.container;
	const children: ReadonlyArray<EmailEditorBlockLike> =
		container?.children(block) ?? [];
	const selected = selectedBlockId === block.id;
	const showAddCell = selected || children.length === 0;
	// Under a touch pointer a cell is far too narrow for a row of 44px targets,
	// so a selected child's toolbar is portalled up here and gets the whole
	// container's width. Under a mouse the toolbar floats and needs no help.
	const [toolbarSlot, setToolbarSlot] = useState<HTMLDivElement | null>(null);
	return (
		<SortableBlockContainer
			containerId={block.id}
			blockIds={children.map((child) => child.id)}
			layout={container?.layout ?? "list"}
		>
			<div ref={setToolbarSlot} className="mb-2 empty:mb-0" />
			<definition.View
				block={block}
				selected={selected}
				preview={preview}
				onChange={updateBlock}
				onUploadImage={onUploadImage}
			>
				{children.map((child, index) => (
					<CanvasBlockRow
						key={child.id}
						block={child}
						index={index}
						containerId={block.id}
						toolbarSlot={coarsePointer ? toolbarSlot : null}
					/>
				))}
				{showAddCell ? (
					<ContainerAddCell containerType={block.type} containerId={block.id} />
				) : null}
			</definition.View>
		</SortableBlockContainer>
	);
}
