import {
	ColumnsIcon,
	DotsSixVerticalIcon,
	PlusIcon,
} from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import { ToolbarIconButton } from "#/email-block-editor/components/toolbar-icon-button.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { SortableBlockHandle } from "#/email-block-editor/dnd/sortable-block-list.ts";
import { toolbarButtonClassName } from "#/email-block-editor/lib/inline-format.ts";
import { cn } from "#/lib/utils.ts";

interface Props {
	handle: SortableBlockHandle;
	coarsePointer: boolean;
	addableTypes?: ReadonlyArray<string>;
	onAddBelow: (type: string) => void;
	onSelectContainer?: () => void;
}

/** Where the block sits in the document: add a sibling below, drag it, and —
 * for a block in a grid cell — reach the row it belongs to. */
export function StructureControls({
	handle,
	coarsePointer,
	addableTypes,
	onAddBelow,
	onSelectContainer,
}: Props) {
	const { chrome } = useEmailEditorLabels();
	return (
		<>
			<AddBlockMenu
				onAdd={onAddBelow}
				types={addableTypes}
				trigger={
					<Button
						variant="ghost"
						size={coarsePointer ? "icon" : "icon-sm"}
						aria-label={chrome.addBlock}
						className={toolbarButtonClassName(coarsePointer)}
					>
						<PlusIcon aria-hidden />
					</Button>
				}
			/>
			<Button
				variant="ghost"
				size={coarsePointer ? "icon" : "icon-sm"}
				aria-label={chrome.moveBlock}
				className={cn(
					toolbarButtonClassName(coarsePointer),
					"cursor-grab touch-none active:cursor-grabbing",
				)}
				ref={handle.setActivatorNodeRef}
				{...handle.attributes}
				{...handle.listeners}
			>
				<DotsSixVerticalIcon aria-hidden />
			</Button>
			{onSelectContainer ? (
				<ToolbarIconButton
					label={chrome.selectContainer}
					coarsePointer={coarsePointer}
					onClick={onSelectContainer}
				>
					<ColumnsIcon aria-hidden />
				</ToolbarIconButton>
			) : null}
		</>
	);
}
