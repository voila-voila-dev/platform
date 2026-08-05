import type { ReactNode } from "react";
import { Drawer } from "#/drawer/components/drawer.tsx";
import { BlockSettingsPanel } from "#/email-block-editor/components/block-settings-panel.tsx";
import {
	useEmailEditorActions,
	useEmailEditorLabels,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import {
	EMAIL_EDITOR_MAIN_COLUMN,
	EMAIL_EDITOR_SIDE_COLUMN,
} from "#/email-block-editor/parts/layout.tsx";
import { cn } from "#/lib/utils.ts";

/**
 * A click inside any settings surface must not reach the host's own deselect
 * handler: the panel edits the selected block, so deselecting on the way in
 * would leave every control acting on nothing. Attached by the parts rather
 * than by the composition, so a consumer cannot forget it.
 */
const stopPropagation = {
	onClick: (event: { stopPropagation: () => void }) => event.stopPropagation(),
	onKeyDown: (event: { stopPropagation: () => void }) =>
		event.stopPropagation(),
};

interface SidebarProps {
	className?: string;
	/** Replaces the column's contents. Omit for the selected block's settings. */
	children?: ReactNode;
}

/** The settings column, beside the canvas on a wide viewport. Renders nothing
 * in the compact layout, where the settings live in the sheet. */
export function EmailEditorSidebar({ className, children }: SidebarProps) {
	const { compact } = useEmailEditorState();
	if (compact) {
		return null;
	}
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: not a control; it only stops a click from reaching the host's deselect handler.
		<div
			className={cn("flex flex-col gap-4", EMAIL_EDITOR_SIDE_COLUMN, className)}
			{...stopPropagation}
		>
			{children ?? <EmailEditorBlockSettings />}
		</div>
	);
}

interface CardProps {
	className?: string;
	/** The heading above the panel. Omit for the default "Block settings". */
	title?: ReactNode;
	children?: ReactNode;
}

/** The selected block's settings, in their own titled card. */
export function EmailEditorBlockSettings({
	className,
	title,
	children,
}: CardProps) {
	const { chrome } = useEmailEditorLabels();
	return (
		<div
			className={cn(
				"flex flex-col gap-4 rounded-lg border bg-background p-4",
				className,
			)}
		>
			<h3 className="font-medium text-sm">{title ?? chrome.blockSettings}</h3>
			{children ?? <BlockSettingsPanel />}
		</div>
	);
}

/**
 * Settings for the document as a whole — a subject line, a preheader, whatever
 * your model has around the blocks. The editor has no opinion on the contents;
 * it owns where they sit and that a click inside them does not deselect.
 *
 * Above the canvas when the layout is compact, at the top of the settings
 * column when it is wide, so the fields are never a screenful from the canvas.
 */
export function EmailEditorDocumentSettings({
	className,
	title,
	children,
}: CardProps) {
	const { compact } = useEmailEditorState();
	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: not a control; it only stops a click from reaching the host's deselect handler.
		<div
			className={cn(
				"flex flex-col gap-4 rounded-lg border bg-background p-4",
				compact ? EMAIL_EDITOR_MAIN_COLUMN : EMAIL_EDITOR_SIDE_COLUMN,
				compact ? null : "lg:row-end-auto",
				className,
			)}
			{...stopPropagation}
		>
			{title === undefined ? null : (
				<h3 className="font-medium text-sm">{title}</h3>
			)}
			{children}
		</div>
	);
}

/**
 * The block settings as a bottom sheet, for the viewports where a 280px column
 * would put the options a screenful away from their block. Opened from the
 * selected block's toolbar; renders nothing in the wide layout.
 */
export function EmailEditorSettingsSheet() {
	const { compact, blockSettingsOpen } = useEmailEditorState();
	const { setBlockSettingsOpen } = useEmailEditorActions();
	const { chrome } = useEmailEditorLabels();
	if (!compact) {
		return null;
	}
	return (
		<Drawer.Root open={blockSettingsOpen} onOpenChange={setBlockSettingsOpen}>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>{chrome.blockSettings}</Drawer.Title>
					<Drawer.Description className="sr-only">
						{chrome.blockSettingsDescription}
					</Drawer.Description>
				</Drawer.Header>
				{/* biome-ignore lint/a11y/noStaticElementInteractions: not a control; it only stops a click from reaching the host's deselect handler. */}
				<div
					className="flex flex-col gap-4 overflow-y-auto px-4 pb-8"
					{...stopPropagation}
				>
					<BlockSettingsPanel />
				</div>
			</Drawer.Content>
		</Drawer.Root>
	);
}
