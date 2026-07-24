import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "@voila.dev/ui/components/drawer";
import { type ReactNode, useCallback, useMemo, useState } from "react";
import {
	createEmailEditorReducer,
	type EmailEditorAction,
	type EmailEditorState,
} from "#/document/reducer.ts";
import type {
	EmailEditorDocument,
	EmailEditorPreview,
} from "#/document/types.ts";
import { useCompactEditorLayout } from "#/lib/use-media-query.ts";
import { EditorCanvas } from "#/sections/editor-canvas.tsx";
import {
	BlockSettingsPanel,
	EditorSidebar,
} from "#/sections/editor-sidebar.tsx";
import { PreviewToggle } from "#/sections/preview-toggle.tsx";

/** The block settings panel as a bottom sheet, for the viewports where a 280px
 * column would put the options a screenful away from their block. */
function BlockSettingsSheet({
	open,
	onOpenChange,
	state,
	dispatch,
	onUploadImage,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Block settings</DrawerTitle>
					<DrawerDescription className="sr-only">
						Options for the selected block.
					</DrawerDescription>
				</DrawerHeader>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 pb-8">
					<BlockSettingsPanel
						state={state}
						dispatch={dispatch}
						onUploadImage={onUploadImage}
					/>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

/**
 * The composed WYSIWYG email editor. On a wide viewport it is the canvas plus
 * a per-block settings column; below `lg` the column would push the options a
 * screenful away from the block they configure, so the settings move into a
 * bottom sheet opened from the selected block's toolbar.
 *
 * The document is controlled (`document`/`onChange`); the block selection is
 * internal UI state. Every building part (blocks, sections, dnd list, reducer)
 * is also exported individually for custom compositions.
 */
// fallow-ignore-next-line complexity -- composition, not logic: the compact/wide split picks a layout and the rest is prop wiring.
export function EmailBlockEditor({
	document,
	onChange,
	onUploadImage,
	generateBlockId = () => crypto.randomUUID(),
	headerSlot,
	footerSlot,
}: {
	document: EmailEditorDocument;
	onChange: (document: EmailEditorDocument) => void;
	/** Delegated image upload: receives the picked file, resolves with its
	 * public URL. Omit to disable image uploads. */
	onUploadImage?: (file: File) => Promise<string>;
	/** Block-id factory, injectable for deterministic tests. */
	generateBlockId?: () => string;
	headerSlot?: ReactNode;
	footerSlot?: ReactNode;
}) {
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
	const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
	const compact = useCompactEditorLayout();
	// Editing on a phone starts on the phone rendering; the author can still
	// switch to the desktop one to check a multi-column row.
	const [preview, setPreview] = useState<EmailEditorPreview>(
		compact ? "mobile" : "desktop",
	);
	const reduce = useMemo(
		() => createEmailEditorReducer(generateBlockId),
		[generateBlockId],
	);

	const dispatch = useCallback(
		(action: EmailEditorAction) => {
			const state = reduce({ document, selectedBlockId }, action);
			if (state.document !== document) {
				onChange(state.document);
			}
			setSelectedBlockId(state.selectedBlockId);
		},
		[reduce, document, selectedBlockId, onChange],
	);

	const state = { document, selectedBlockId };
	// Only the sheet layout needs an opener; the sidebar layout is always there.
	const openSettingsSheet = compact
		? () => setSettingsSheetOpen(true)
		: undefined;

	return (
		<>
			<div
				className={
					compact
						? "grid grid-cols-1 items-start gap-6"
						: "grid grid-cols-[minmax(0,1fr)_280px] items-start gap-6"
				}
			>
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-end">
						<PreviewToggle value={preview} onChange={setPreview} />
					</div>
					<EditorCanvas
						state={state}
						dispatch={dispatch}
						preview={preview}
						onUploadImage={onUploadImage}
						onOpenSettings={openSettingsSheet}
						headerSlot={headerSlot}
						footerSlot={footerSlot}
					/>
				</div>
				{compact ? null : (
					<EditorSidebar
						state={state}
						dispatch={dispatch}
						onUploadImage={onUploadImage}
					/>
				)}
			</div>
			{compact ? (
				<BlockSettingsSheet
					open={settingsSheetOpen}
					onOpenChange={setSettingsSheetOpen}
					state={state}
					dispatch={dispatch}
					onUploadImage={onUploadImage}
				/>
			) : null}
		</>
	);
}
