import type { ReactNode } from "react";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import { CanvasBlockRow } from "#/email-block-editor/components/canvas-block-row.tsx";
import { CardFooterPlaceholder } from "#/email-block-editor/components/card-footer-placeholder.tsx";
import { CardHeaderPlaceholder } from "#/email-block-editor/components/card-header-placeholder.tsx";
import {
	useEmailEditorActions,
	useEmailEditorLabels,
	useEmailEditorRegistry,
	useEmailEditorState,
	useEmailEditorTheme,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { EmailEditorDndContext } from "#/email-block-editor/dnd/email-editor-dnd-context.tsx";
import { SortableBlockContainer } from "#/email-block-editor/dnd/sortable-block-container.tsx";
import {
	EMAIL_EDITOR_MAIN_COLUMN,
	useRegisterEmailEditorPart,
} from "#/email-block-editor/parts/layout.tsx";
import { cn } from "#/lib/utils.ts";

interface CanvasProps {
	className?: string;
	/** Replaces the card's contents. Omit for the header, the blocks and the
	 * footer, which is what a canvas is. */
	children?: ReactNode;
}

/**
 * The editing surface, dressed as the email it produces: the grey backdrop,
 * the white card at the previewed width, and whatever the card holds. The real
 * chrome is rendered by your own renderer — the canvas only mirrors it.
 */
export function EmailEditorCanvas({ className, children }: CanvasProps) {
	const theme = useEmailEditorTheme();
	const { preview } = useEmailEditorState();
	useRegisterEmailEditorPart("canvas");
	return (
		<div
			className={cn(
				"flex justify-center rounded-lg px-4 py-8",
				EMAIL_EDITOR_MAIN_COLUMN,
				className,
			)}
			style={{ backgroundColor: theme.color.canvas }}
		>
			<div
				className="w-full"
				style={{ maxWidth: `${theme.previewWidth[preview]}px` }}
			>
				{children ?? (
					<>
						<EmailEditorCard>
							<EmailEditorCardHeader />
							<EmailEditorBlocks />
						</EmailEditorCard>
						<EmailEditorCardFooter />
					</>
				)}
			</div>
		</div>
	);
}

/**
 * The white card the email is read in. A part of its own because the footer
 * sits *outside* it — that is where a sent email puts contact details and the
 * unsubscribe line — so the card cannot simply be the canvas's wrapper.
 */
export function EmailEditorCard({ className, children }: CanvasProps) {
	const theme = useEmailEditorTheme();
	return (
		<div
			className={cn("overflow-hidden rounded-[14px] border", className)}
			style={{
				backgroundColor: theme.color.card,
				borderColor: theme.color.border,
			}}
		>
			{children}
		</div>
	);
}

interface CardSlotProps {
	/** Your own chrome. Omit for a neutral placeholder saying one goes here. */
	render?: ReactNode;
}

/** The band above the card's blocks — your logo, usually. */
export function EmailEditorCardHeader({ render }: CardSlotProps) {
	return <>{render ?? <CardHeaderPlaceholder />}</>;
}

/** The band below the card's blocks — contact details, unsubscribe. Outside
 * the card on purpose: that is where a sent email puts it. */
export function EmailEditorCardFooter({ render }: CardSlotProps) {
	return <>{render ?? <CardFooterPlaceholder />}</>;
}

interface BlocksProps {
	className?: string;
}

/** The document itself: every block, selectable, draggable, edited in place. */
export function EmailEditorBlocks({ className }: BlocksProps) {
	const theme = useEmailEditorTheme();
	const { document } = useEmailEditorState();
	const { addBlock, moveBlock } = useEmailEditorActions();
	const { chrome } = useEmailEditorLabels();
	const registry = useEmailEditorRegistry();
	const blocks = document.blocks;
	return (
		<div className={cn("px-8 pt-2 pb-8", className)}>
			<EmailEditorDndContext
				registry={registry}
				blocks={blocks}
				onMove={moveBlock}
			>
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
	);
}
