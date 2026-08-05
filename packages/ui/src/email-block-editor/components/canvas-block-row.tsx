import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { CanvasBlockRowToolbar } from "#/email-block-editor/components/canvas-block-row-toolbar.tsx";
import { ContainerBlockCells } from "#/email-block-editor/components/container-block-cells.tsx";
import { UnknownBlock } from "#/email-block-editor/components/unknown-block.tsx";
import {
	useEmailEditorActions,
	useEmailEditorConfig,
	useEmailEditorRegistry,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { SortableBlockItem } from "#/email-block-editor/dnd/sortable-block-item.tsx";
import type { EmailEditorContainerId } from "#/email-block-editor/document/reducer.ts";
import type { EmailEditorBlockLike } from "#/email-block-editor/document/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	block: EmailEditorBlockLike;
	index: number;
	containerId: EmailEditorContainerId;
	/** Where to render the toolbar when the row's own column is too narrow for
	 * it; see {@link ContainerBlockCells}. */
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
	const registry = useEmailEditorRegistry();
	const selected = selectedBlockId === block.id;
	const definition = registry.definitionFor(block.type);
	const viewProps: EmailBlockComponentProps = {
		block,
		selected,
		preview,
		onChange: updateBlock,
		onUploadImage,
	};
	// Selecting the innermost block: the child's handler runs first and stops
	// the event, so clicking inside a cell never selects the container.
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
						{definition === undefined ? (
							<UnknownBlock type={block.type} />
						) : definition.container === undefined ? (
							<definition.View {...viewProps} />
						) : (
							<ContainerBlockCells block={block} definition={definition} />
						)}
					</div>
				</>
			)}
		</SortableBlockItem>
	);
}
