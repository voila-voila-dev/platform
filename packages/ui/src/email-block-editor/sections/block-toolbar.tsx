import {
	ColumnsIcon,
	CopyIcon,
	DotsSixVerticalIcon,
	LinkIcon,
	PlusIcon,
	SlidersHorizontalIcon,
	TextBIcon,
	TextItalicIcon,
	TextUnderlineIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "#/components/button.tsx";
import type { SortableBlockHandle } from "#/email-block-editor/dnd/sortable-block-list.tsx";
import type { EmailEditorBlockType } from "#/email-block-editor/document/types.ts";
import { AddBlockMenu } from "#/email-block-editor/sections/add-block-menu.tsx";
import { LinkPopover } from "#/email-block-editor/sections/link-popover.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * Run a document.execCommand-based inline formatting command against the
 * current text selection, then poke the surrounding contentEditable's `input`
 * handler so the paragraph block re-reads the DOM into the span model. The
 * toolbar buttons prevent mousedown default so the text selection (and focus)
 * survive the click.
 */
const applyInlineFormat = (command: string, value?: string) => {
	document.execCommand("styleWithCSS", false, "false");
	document.execCommand(command, false, value);
	const node = window.getSelection()?.anchorNode;
	const element = node instanceof Element ? node : node?.parentElement;
	element
		?.closest("[contenteditable]")
		?.dispatchEvent(new Event("input", { bubbles: true }));
};

const keepSelection = (event: { preventDefault: () => void }) =>
	event.preventDefault();

/** The <a> the caret or selection currently sits in, if any. */
// fallow-ignore-next-line complexity -- a few null guards on the live selection; cognitive complexity is 3.
const selectedAnchorElement = (): HTMLAnchorElement | null => {
	const selection = window.getSelection();
	const node = selection?.anchorNode;
	if (!node) {
		return null;
	}
	const element = node instanceof Element ? node : node.parentElement;
	return element?.closest("a") ?? null;
};

const INLINE_MARKS = ["bold", "italic", "underline"] as const;

/** Track which marks are active at the caret, following the live selection. */
const useActiveInlineMarks = (): ReadonlySet<string> => {
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
};

/**
 * Tap targets reach the 44px floor on touch pointers and stay compact under a
 * mouse. `size-11` overrides the size variant's `size-*` through
 * tailwind-merge, so the two never fight.
 */
const toolbarButtonClassName = (coarsePointer: boolean, active = false) =>
	cn(
		"shrink-0",
		coarsePointer && "size-11",
		active && "bg-accent text-accent-foreground",
	);

function ToolbarIconButton({
	label,
	active = false,
	coarsePointer,
	onClick,
	onMouseDown,
	children,
}: {
	label: string;
	active?: boolean;
	coarsePointer: boolean;
	onClick?: () => void;
	onMouseDown?: (event: { preventDefault: () => void }) => void;
	children: React.ReactNode;
}) {
	return (
		<Button
			variant="ghost"
			size={coarsePointer ? "icon" : "icon-sm"}
			aria-label={label}
			aria-pressed={active || undefined}
			className={toolbarButtonClassName(coarsePointer, active)}
			onMouseDown={onMouseDown}
			onClick={onClick}
		>
			{children}
		</Button>
	);
}

/** Where the block sits in the document: add a sibling below, drag it, and —
 * for a block in a grid cell — reach the row it belongs to. */
function StructureControls({
	handle,
	coarsePointer,
	addableTypes,
	onAddBelow,
	onSelectContainer,
}: {
	handle: SortableBlockHandle;
	coarsePointer: boolean;
	addableTypes?: ReadonlyArray<EmailEditorBlockType>;
	onAddBelow: (type: EmailEditorBlockType) => void;
	onSelectContainer?: () => void;
}) {
	return (
		<>
			<AddBlockMenu
				onAdd={onAddBelow}
				types={addableTypes}
				trigger={
					<Button
						variant="ghost"
						size={coarsePointer ? "icon" : "icon-sm"}
						aria-label="Add a block"
						className={toolbarButtonClassName(coarsePointer)}
					>
						<PlusIcon aria-hidden />
					</Button>
				}
			/>
			<Button
				variant="ghost"
				size={coarsePointer ? "icon" : "icon-sm"}
				aria-label="Move block"
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
					label="Select the column row"
					coarsePointer={coarsePointer}
					onClick={onSelectContainer}
				>
					<ColumnsIcon aria-hidden />
				</ToolbarIconButton>
			) : null}
		</>
	);
}

function ToolbarSeparator() {
	return <div className="mx-0.5 h-5 w-px shrink-0 bg-border" />;
}

function RichTextControls({
	active,
	coarsePointer,
}: {
	active: ReadonlySet<string>;
	coarsePointer: boolean;
}) {
	return (
		<>
			<ToolbarSeparator />
			<ToolbarIconButton
				label="Bold"
				active={active.has("bold")}
				coarsePointer={coarsePointer}
				onMouseDown={keepSelection}
				onClick={() => applyInlineFormat("bold")}
			>
				<TextBIcon aria-hidden />
			</ToolbarIconButton>
			<ToolbarIconButton
				label="Italic"
				active={active.has("italic")}
				coarsePointer={coarsePointer}
				onMouseDown={keepSelection}
				onClick={() => applyInlineFormat("italic")}
			>
				<TextItalicIcon aria-hidden />
			</ToolbarIconButton>
			<ToolbarIconButton
				label="Underline"
				active={active.has("underline")}
				coarsePointer={coarsePointer}
				onMouseDown={keepSelection}
				onClick={() => applyInlineFormat("underline")}
			>
				<TextUnderlineIcon aria-hidden />
			</ToolbarIconButton>
			<SelectionLinkButton
				active={active.has("link")}
				coarsePointer={coarsePointer}
			/>
		</>
	);
}

/** Link editing on the current text selection. Opening on a caret inside an
 * existing link edits that whole link (URL prefilled); the selection is saved
 * while the popover holds focus and restored before the command applies. */
function SelectionLinkButton({
	active,
	coarsePointer,
}: {
	active: boolean;
	coarsePointer: boolean;
}) {
	const savedRangeRef = useRef<Range | null>(null);

	const restoreSelection = (): boolean => {
		const range = savedRangeRef.current;
		if (!range) {
			return false;
		}
		const selection = window.getSelection();
		selection?.removeAllRanges();
		selection?.addRange(range);
		return true;
	};

	return (
		<LinkPopover
			trigger={
				<Button
					variant="ghost"
					size={coarsePointer ? "icon" : "icon-sm"}
					aria-label="Insert a link"
					aria-pressed={active || undefined}
					className={toolbarButtonClassName(coarsePointer, active)}
					onMouseDown={keepSelection}
				>
					<LinkIcon aria-hidden />
				</Button>
			}
			initialHref={() => selectedAnchorElement()?.getAttribute("href") ?? ""}
			// fallow-ignore-next-line complexity -- selection bookkeeping guards; cognitive complexity is 4.
			onOpen={() => {
				// A caret inside a link edits the whole link, not an empty range.
				const anchor = selectedAnchorElement();
				const selection = window.getSelection();
				if (anchor && selection?.isCollapsed) {
					const range = document.createRange();
					range.selectNodeContents(anchor);
					selection.removeAllRanges();
					selection.addRange(range);
				}
				savedRangeRef.current =
					selection && selection.rangeCount > 0
						? selection.getRangeAt(0).cloneRange()
						: null;
			}}
			onApply={(href) => {
				if (restoreSelection()) {
					applyInlineFormat("createLink", href);
				}
			}}
			onRemove={() => {
				if (restoreSelection()) {
					applyInlineFormat("unlink");
				}
			}}
		/>
	);
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
}: {
	handle: SortableBlockHandle;
	/** Show the bold/italic/underline/link group (paragraph blocks). */
	richText: boolean;
	/** Touch pointer: grow every target to 44px. */
	coarsePointer: boolean;
	/** Restricts the add-below menu; a grid cell offers the leaf types only. */
	addableTypes?: ReadonlyArray<EmailEditorBlockType>;
	onAddBelow: (type: EmailEditorBlockType) => void;
	onDuplicate: () => void;
	onRemove: () => void;
	/** Present when the settings are in a sheet; opens it for this block. */
	onOpenSettings?: () => void;
	/** Present for a block inside a grid: selects the grid, which is otherwise
	 * only reachable through the thin band around its cells. */
	onSelectContainer?: () => void;
}) {
	const activeMarks = useActiveInlineMarks();
	return (
		<div
			className={cn(
				"flex max-w-full items-center gap-0.5 rounded-md border bg-background p-0.5 shadow-sm",
				coarsePointer ? "flex-wrap justify-start" : "flex-nowrap",
			)}
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
					label="Block settings"
					coarsePointer={coarsePointer}
					onClick={onOpenSettings}
				>
					<SlidersHorizontalIcon aria-hidden />
				</ToolbarIconButton>
			) : null}
			<ToolbarIconButton
				label="Duplicate block"
				coarsePointer={coarsePointer}
				onClick={onDuplicate}
			>
				<CopyIcon aria-hidden />
			</ToolbarIconButton>
			<ToolbarIconButton
				label="Delete block"
				coarsePointer={coarsePointer}
				onClick={onRemove}
			>
				<TrashIcon aria-hidden />
			</ToolbarIconButton>
		</div>
	);
}
