import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { BlockSettingsSheet } from "#/email-block-editor/components/block-settings-sheet.tsx";
import { EditorCanvas } from "#/email-block-editor/components/editor-canvas.tsx";
import { EditorSidebar } from "#/email-block-editor/components/editor-sidebar.tsx";
import { PreviewToggle } from "#/email-block-editor/components/preview-toggle.tsx";
import type { EmailEditorAction } from "#/email-block-editor/document/reducer.ts";
import { createEmailEditorReducer } from "#/email-block-editor/document/reducer.ts";
import type {
	EmailEditorDocument,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";
import { useCompactEditorLayout } from "#/email-block-editor/lib/use-media-query.ts";

interface Props {
	/**
	 * The template being edited: `{ version, blocks }`, plain serialisable data.
	 * Controlled — the editor holds no copy of it, so persistence is one
	 * `JSON.stringify` away and undo is whatever you do with the state.
	 */
	document: EmailEditorDocument;
	/** Called with the whole next document on every edit, keystrokes included. */
	onChange: (document: EmailEditorDocument) => void;
	/** Delegated image upload: receives the picked file, resolves with its
	 * public URL. Omit to disable image uploads. */
	onUploadImage?: (file: File) => Promise<string>;
	/** Block-id factory, injectable for deterministic tests. */
	generateBlockId?: () => string;
	/** Replaces the neutral header placeholder above the canvas with your own chrome. */
	headerSlot?: ReactNode;
	/** Replaces the neutral footer placeholder below the canvas. */
	footerSlot?: ReactNode;
}

/**
 * The composed WYSIWYG email editor. On a wide viewport it is the canvas plus
 * a per-block settings column; below `lg` the column would push the options a
 * screenful away from the block they configure, so the settings move into a
 * bottom sheet opened from the selected block's toolbar.
 *
 * The document is controlled (`document`/`onChange`); the block selection is
 * internal UI state. The block registry (`EMAIL_BLOCK_DEFINITIONS`) is public
 * so a host can render the same blocks outside the editor.
 */
// fallow-ignore-next-line complexity -- composition, not logic: the compact/wide split picks a layout and the rest is prop wiring.
export function EmailBlockEditor({
	document,
	onChange,
	onUploadImage,
	generateBlockId = () => crypto.randomUUID(),
	headerSlot,
	footerSlot,
}: Props) {
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
