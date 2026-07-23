import { cn } from "@voila.dev/ui/lib/utils";
import { type ReactElement, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";
import {
	EMAIL_LEAF_BLOCK_TYPES,
	type EmailBlockComponentProps,
	emailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import { EMAIL_GRID_GAP_PX } from "#/blocks/grid-block.tsx";
import {
	EmailEditorDndContext,
	SortableBlockContainer,
	type SortableBlockHandle,
	SortableBlockItem,
} from "#/dnd/sortable-block-list.tsx";
import type {
	EmailEditorAction,
	EmailEditorContainerId,
	EmailEditorState,
} from "#/document/reducer.ts";
import {
	EMAIL_PREVIEW_WIDTH,
	type EmailEditorBlock,
	type EmailEditorGridBlock,
	type EmailEditorPreview,
	isEmailEditorGridBlock,
} from "#/document/types.ts";
import { useCoarsePointer } from "#/lib/use-media-query.ts";
import { AddBlockMenu } from "#/sections/add-block-menu.tsx";
import { BlockToolbar } from "#/sections/block-toolbar.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/theme.ts";

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

/** Everything the block rows need from the editor, threaded down one level of
 * nesting without turning each row into a ten-prop component. */
interface CanvasContext {
	readonly state: EmailEditorState;
	readonly dispatch: (action: EmailEditorAction) => void;
	readonly coarsePointer: boolean;
	readonly preview: EmailEditorPreview;
	readonly onUploadImage?: (file: File) => Promise<string>;
	readonly onOpenSettings?: () => void;
}

/** The dashed « ajouter » slot of a grid cell. */
function GridAddCell({
	gridId,
	context,
}: {
	gridId: string;
	context: CanvasContext;
}) {
	return (
		<div className="flex items-center justify-center rounded-lg border border-dashed px-2 py-6">
			<AddBlockMenu
				types={EMAIL_LEAF_BLOCK_TYPES}
				onAdd={(type) =>
					context.dispatch({
						type: "add",
						blockType: type,
						containerId: gridId,
					})
				}
			/>
		</div>
	);
}

function GridBlockCells({
	block,
	context,
}: {
	block: EmailEditorGridBlock;
	context: CanvasContext;
}) {
	const definition = emailBlockDefinition(block);
	const selected = context.state.selectedBlockId === block.id;
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
				preview={context.preview}
				onChange={(updated) =>
					context.dispatch({ type: "update", block: updated })
				}
				onUploadImage={context.onUploadImage}
			>
				{block.children.map((child, index) => (
					<CanvasBlockRow
						key={child.id}
						block={child}
						index={index}
						containerId={block.id}
						context={context}
						toolbarSlot={context.coarsePointer ? toolbarSlot : null}
					/>
				))}
				{showAddCell ? (
					<GridAddCell gridId={block.id} context={context} />
				) : null}
			</definition.View>
		</SortableBlockContainer>
	);
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
function CanvasBlockRowToolbar({
	block,
	index,
	containerId,
	context,
	handle,
	toolbarSlot,
}: {
	block: EmailEditorBlock;
	index: number;
	containerId: EmailEditorContainerId;
	context: CanvasContext;
	handle: SortableBlockHandle;
	toolbarSlot: HTMLElement | null;
}) {
	const { dispatch, coarsePointer } = context;
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
				onAddBelow={(type) =>
					dispatch({
						type: "add",
						blockType: type,
						containerId,
						index: index + 1,
					})
				}
				onDuplicate={() => dispatch({ type: "duplicate", blockId: block.id })}
				onRemove={() => dispatch({ type: "remove", blockId: block.id })}
				onOpenSettings={context.onOpenSettings}
				onSelectContainer={
					nested
						? () => dispatch({ type: "select", blockId: containerId })
						: undefined
				}
			/>
		</div>,
	);
}

function CanvasBlockRow({
	block,
	index,
	containerId,
	context,
	toolbarSlot = null,
}: {
	block: EmailEditorBlock;
	index: number;
	containerId: EmailEditorContainerId;
	context: CanvasContext;
	/** Where to render the toolbar when the row's own column is too narrow for
	 * it; see {@link GridBlockCells}. */
	toolbarSlot?: HTMLElement | null;
}) {
	const { dispatch } = context;
	const selected = context.state.selectedBlockId === block.id;
	const definition = emailBlockDefinition(block);
	const grid = isEmailEditorGridBlock(block) ? block : null;
	const viewProps: EmailBlockComponentProps = {
		block,
		selected,
		preview: context.preview,
		onChange: (updated) => dispatch({ type: "update", block: updated }),
		onUploadImage: context.onUploadImage,
	};
	// Selecting the innermost block: the child's handler runs first and stops
	// the event, so clicking inside a grid cell never selects the grid.
	const select = (event: { stopPropagation: () => void }) => {
		event.stopPropagation();
		dispatch({ type: "select", blockId: block.id });
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
							context={context}
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
							<GridBlockCells block={grid} context={context} />
						)}
					</div>
				</>
			)}
		</SortableBlockItem>
	);
}

/**
 * Neutral stand-in for the branded header the server prepends. Pass
 * `headerSlot` to render your own logo instead.
 */
function CardHeaderPlaceholder() {
	return (
		<div
			className="flex justify-center pt-8 pb-2 text-[13px]"
			style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
		>
			<div className="rounded-md border border-dashed px-4 py-3">
				Your header
			</div>
		</div>
	);
}

/**
 * Neutral stand-in for the branded footer the server appends. Pass
 * `footerSlot` to render your own.
 */
function CardFooterPlaceholder() {
	return (
		<div
			className="px-8 pt-6 pb-2 text-center text-[13px] leading-[1.6]"
			style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
		>
			<div>
				The full footer (contact details, social links, unsubscribe) is added
				when the email is sent.
			</div>
		</div>
	);
}

/**
 * The editing surface, dressed as the email it produces: the grey canvas, the
 * 600px white card, the blocks, and header/footer placeholders.
 * The real chrome is rendered server-side — the canvas only mirrors it.
 * Blocks are added from the selected block's toolbar (+); an empty document
 * shows a single centered add button instead.
 */
export function EditorCanvas({
	state,
	dispatch,
	preview,
	onUploadImage,
	onOpenSettings,
	headerSlot,
	footerSlot,
}: {
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	/** Which rendering to mirror: the 600px card, or a phone-width one where
	 * grids collapse to their mobile column count. */
	preview: EmailEditorPreview;
	onUploadImage?: (file: File) => Promise<string>;
	/** Present when the settings live in a sheet rather than in the sidebar;
	 * each selected block's toolbar then offers a « Réglages » button. */
	onOpenSettings?: () => void;
	headerSlot?: ReactNode;
	footerSlot?: ReactNode;
}) {
	const coarsePointer = useCoarsePointer();
	const blocks = state.document.blocks;
	const context: CanvasContext = {
		state,
		dispatch,
		coarsePointer,
		preview,
		onUploadImage,
		onOpenSettings,
	};
	return (
		<div
			className="flex justify-center rounded-lg px-4 py-8"
			style={{ backgroundColor: EMAIL_COLOR.canvas }}
		>
			<div
				className="w-full"
				style={{ maxWidth: `${EMAIL_PREVIEW_WIDTH[preview]}px` }}
			>
				<div
					className="rounded-[14px] border"
					style={{
						backgroundColor: EMAIL_COLOR.card,
						borderColor: EMAIL_COLOR.border,
					}}
				>
					{headerSlot ?? <CardHeaderPlaceholder />}
					<div className="px-8 pt-2 pb-8">
						<EmailEditorDndContext
							blocks={blocks}
							onMove={(blockId, toContainerId, toIndex) =>
								dispatch({ type: "move", blockId, toContainerId, toIndex })
							}
						>
							<SortableBlockContainer
								containerId={null}
								blockIds={blocks.map((block) => block.id)}
								layout="list"
								style={{ minHeight: `${EMAIL_GRID_GAP_PX}px` }}
							>
								{blocks.map((block, index) => (
									<CanvasBlockRow
										key={block.id}
										block={block}
										index={index}
										containerId={null}
										context={context}
									/>
								))}
							</SortableBlockContainer>
						</EmailEditorDndContext>
						{blocks.length === 0 ? (
							<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-10">
								<p
									className="text-[14px]"
									style={{ color: EMAIL_COLOR.muted, fontFamily: EMAIL_FONT }}
								>
									Votre email est vide.
								</p>
								<AddBlockMenu
									onAdd={(type) => dispatch({ type: "add", blockType: type })}
								/>
							</div>
						) : null}
					</div>
				</div>
				{footerSlot ?? <CardFooterPlaceholder />}
			</div>
		</div>
	);
}
