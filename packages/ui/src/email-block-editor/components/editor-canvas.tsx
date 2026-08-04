import type { ReactNode } from "react";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import { CanvasBlockRow } from "#/email-block-editor/components/canvas-block-row.tsx";
import { CardFooterPlaceholder } from "#/email-block-editor/components/card-footer-placeholder.tsx";
import { CardHeaderPlaceholder } from "#/email-block-editor/components/card-header-placeholder.tsx";
import {
	useEmailEditorActions,
	useEmailEditorLabels,
	useEmailEditorState,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { EmailEditorDndContext } from "#/email-block-editor/dnd/email-editor-dnd-context.tsx";
import { SortableBlockContainer } from "#/email-block-editor/dnd/sortable-block-container.tsx";

interface Props {
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
export function EditorCanvas({ headerSlot, footerSlot }: Props) {
	const theme = useEmailEditorTheme();
	const { document, preview } = useEmailEditorState();
	const { addBlock, moveBlock } = useEmailEditorActions();
	const { chrome } = useEmailEditorLabels();
	const blocks = document.blocks;
	return (
		<div
			className="flex justify-center rounded-lg px-4 py-8"
			style={{ backgroundColor: theme.color.canvas }}
		>
			<div
				className="w-full"
				style={{ maxWidth: `${theme.previewWidth[preview]}px` }}
			>
				<div
					className="rounded-[14px] border"
					style={{
						backgroundColor: theme.color.card,
						borderColor: theme.color.border,
					}}
				>
					{headerSlot ?? <CardHeaderPlaceholder />}
					<div className="px-8 pt-2 pb-8">
						<EmailEditorDndContext blocks={blocks} onMove={moveBlock}>
							<SortableBlockContainer
								containerId={null}
								blockIds={blocks.map((block) => block.id)}
								layout="list"
								style={{ minHeight: `${theme.gridGapPx}px` }}
							>
								{blocks.map((block, index) => (
									<CanvasBlockRow
										key={block.id}
										block={block}
										index={index}
										containerId={null}
									/>
								))}
							</SortableBlockContainer>
						</EmailEditorDndContext>
						{blocks.length === 0 ? (
							<div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-4 py-10">
								<p
									className="text-[14px]"
									style={{ color: theme.color.muted, fontFamily: theme.font }}
								>
									{chrome.emptyDocument}
								</p>
								<AddBlockMenu onAdd={(type) => addBlock(type)} />
							</div>
						) : null}
					</div>
				</div>
				{footerSlot ?? <CardFooterPlaceholder />}
			</div>
		</div>
	);
}
