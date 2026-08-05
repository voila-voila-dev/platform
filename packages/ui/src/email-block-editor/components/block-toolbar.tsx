import {
	CopyIcon,
	SlidersHorizontalIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { RichTextControls } from "#/email-block-editor/components/rich-text-controls.tsx";
import { StructureControls } from "#/email-block-editor/components/structure-controls.tsx";
import { ToolbarIconButton } from "#/email-block-editor/components/toolbar-icon-button.tsx";
import { ToolbarSeparator } from "#/email-block-editor/components/toolbar-separator.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { SortableBlockHandle } from "#/email-block-editor/dnd/sortable-block-list.ts";
import {
	INLINE_MARKS,
	selectedAnchorElement,
} from "#/email-block-editor/lib/inline-format.ts";
import { cn } from "#/lib/utils.ts";

/** Track which marks are active at the caret, following the live selection. */
function useActiveInlineMarks(): ReadonlySet<string> {
	const [active, setActive] = useState<ReadonlySet<string>>(new Set());
	useEffect(() => {
		const readSelection = () => {
			const next = new Set<string>();
			for (const command of INLINE_MARKS) {
				if (document.queryCommandState(command)) {
					next.add(command);
				}
			}
			if (selectedAnchorElement() !== null) {
				next.add("link");
			}
			setActive(next);
		};
		document.addEventListener("selectionchange", readSelection);
		readSelection();
		return () => document.removeEventListener("selectionchange", readSelection);
	}, []);
	return active;
}

interface Props {
	handle: SortableBlockHandle;
	/** Show the bold/italic/underline/link group (paragraph blocks). */
	richText: boolean;
	/** Touch pointer: grow every target to 44px. */
	coarsePointer: boolean;
	/** Restricts the add-below menu; a grid cell offers the leaf types only. */
	addableTypes?: ReadonlyArray<string>;
	onAddBelow: (type: string) => void;
	onDuplicate: () => void;
	onRemove: () => void;
	/** Present when the settings are in a sheet; opens it for this block. */
	onOpenSettings?: () => void;
	/** Present for a block inside a grid: selects the grid, which is otherwise
	 * only reachable through the thin band around its cells. */
	onSelectContainer?: () => void;
}

/**
 * The controls of the selected block: add-below, drag handle, inline
 * formatting when the block holds rich text, duplicate, delete, plus a
 * Settings button when the settings live in a bottom sheet rather than in
 * the sidebar. App-chrome styling on purpose — the toolbar is editor UI, not
 * part of the email. Only ever rendered for the selected block, so a single
 * toolbar is visible at a time.
 *
 * At 44px per target the full set is wider than a 390px viewport, so the row
 * wraps under a touch pointer rather than scrolling: it sits in the flow there
 * (see the canvas), so a second line costs nothing, while a scrolling row
 * would hide Delete behind an edge with no affordance.
 *
 * Its `stopPropagation` is load-bearing, exactly as in {@link EmailEditorToolbar}:
 * a host commonly deselects the block when the page around the editor is
 * clicked, and this toolbar only exists while a block is selected — so without
 * it, clicking the add-block trigger deselects, unmounts the toolbar, and takes
 * the just-opened menu down with it. A menu popup is portalled but stays a
 * React child of this row, so its items are covered too. Only clicks: the drag
 * handle's keyboard sensor listens on the document, so swallowing keydown here
 * would break picking a block up and moving it with the keyboard.
 */
export function BlockToolbar({
	handle,
	richText,
	coarsePointer,
	addableTypes,
	onAddBelow,
	onDuplicate,
	onRemove,
	onOpenSettings,
	onSelectContainer,
}: Props) {
	const activeMarks = useActiveInlineMarks();
	const { chrome } = useEmailEditorLabels();
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: not a control; it only stops a click from reaching the host's deselect handler.
		// biome-ignore lint/a11y/useKeyWithClickEvents: same as above; a keyboard equivalent would swallow the drag handle's keys.
		<div
			className={cn(
				"flex max-w-full items-center gap-0.5 rounded-md border bg-background p-0.5 shadow-sm",
				coarsePointer ? "flex-wrap justify-start" : "flex-nowrap",
			)}
			onClick={(event) => event.stopPropagation()}
		>
			<StructureControls
				handle={handle}
				coarsePointer={coarsePointer}
				addableTypes={addableTypes}
				onAddBelow={onAddBelow}
				onSelectContainer={onSelectContainer}
			/>
			{richText ? (
				<RichTextControls active={activeMarks} coarsePointer={coarsePointer} />
			) : null}
			<ToolbarSeparator />
			{onOpenSettings ? (
				<ToolbarIconButton
					label={chrome.blockSettings}
					coarsePointer={coarsePointer}
					onClick={onOpenSettings}
				>
					<SlidersHorizontalIcon aria-hidden />
				</ToolbarIconButton>
			) : null}
			<ToolbarIconButton
				label={chrome.duplicateBlock}
				coarsePointer={coarsePointer}
				onClick={onDuplicate}
			>
				<CopyIcon aria-hidden />
			</ToolbarIconButton>
			<ToolbarIconButton
				label={chrome.deleteBlock}
				coarsePointer={coarsePointer}
				onClick={onRemove}
			>
				<TrashIcon aria-hidden />
			</ToolbarIconButton>
		</div>
	);
}
