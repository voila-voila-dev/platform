import type { ReactNode } from "react";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import { CanvasBlockRow } from "#/email-block-editor/components/canvas-block-row.tsx";
import { CardFooterPlaceholder } from "#/email-block-editor/components/card-footer-placeholder.tsx";
import { CardHeaderPlaceholder } from "#/email-block-editor/components/card-header-placeholder.tsx";
import { EmailEditorDndContext } from "#/email-block-editor/dnd/email-editor-dnd-context.tsx";
import { SortableBlockContainer } from "#/email-block-editor/dnd/sortable-block-container.tsx";
import type {
	EmailEditorAction,
	EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";
import type { EmailEditorPreview } from "#/email-block-editor/document/types.ts";
import { EMAIL_PREVIEW_WIDTH } from "#/email-block-editor/document/types.ts";
import { useCoarsePointer } from "#/email-block-editor/lib/use-media-query.ts";
import {
	EMAIL_COLOR,
	EMAIL_FONT,
	EMAIL_GRID_GAP_PX,
} from "#/email-block-editor/theme.ts";

interface Props {
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	/** Which rendering to mirror: the 600px card, or a phone-width one where
	 * grids collapse to their mobile column count. */
	preview: EmailEditorPreview;
	onUploadImage?: (file: File) => Promise<string>;
	/** Present when the settings live in a sheet rather than in the sidebar;
	 * each selected block's toolbar then offers a Settings button. */
	onOpenSettings?: () => void;
	headerSlot?: ReactNode;
	footerSlot?: ReactNode;
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
}: Props) {
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
									Your email is empty.
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

/** Everything the block rows need from the editor, threaded down one level of
 * nesting without turning each row into a ten-prop component. */
export interface CanvasContext {
	readonly state: EmailEditorState;
	readonly dispatch: (action: EmailEditorAction) => void;
	readonly coarsePointer: boolean;
	readonly preview: EmailEditorPreview;
	readonly onUploadImage?: (file: File) => Promise<string>;
	readonly onOpenSettings?: () => void;
}
