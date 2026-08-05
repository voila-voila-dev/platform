import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import type {
	AnyEmailBlockDefinition,
	EmailEditorRegistry,
} from "#/email-block-editor/blocks/registry.ts";
import { createEmailBlockRegistry } from "#/email-block-editor/blocks/registry.ts";
import { BlockSettingsSheet } from "#/email-block-editor/components/block-settings-sheet.tsx";
import { EditorCanvas } from "#/email-block-editor/components/editor-canvas.tsx";
import { EditorSidebar } from "#/email-block-editor/components/editor-sidebar.tsx";
import { PreviewToggle } from "#/email-block-editor/components/preview-toggle.tsx";
import { EmailEditorProvider } from "#/email-block-editor/context/email-editor-context.tsx";
import { useEmailEditorActions } from "#/email-block-editor/context/use-email-editor-actions.ts";
import type {
	EmailEditorBlockLike,
	EmailEditorDocument,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";
import type { EmailEditorLabelsInput } from "#/email-block-editor/labels.ts";
import { mergeEmailEditorLabels } from "#/email-block-editor/labels.ts";
import {
	useCoarsePointer,
	useCompactEditorLayout,
} from "#/email-block-editor/lib/use-media-query.ts";
import type { EmailEditorThemeInput } from "#/email-block-editor/theme.ts";
import { mergeEmailEditorTheme } from "#/email-block-editor/theme.ts";

interface Props<Block extends EmailEditorBlockLike> {
	/**
	 * The block types this editor offers, as definitions. `createEmailBlocks`
	 * returns the ones this package ships; add your own, drop the ones you do
	 * not want, reorder them. Either the list or a registry built from it.
	 */
	blocks: ReadonlyArray<AnyEmailBlockDefinition> | EmailEditorRegistry;
	/**
	 * The template being edited: `{ version, blocks }`, plain serialisable data.
	 * Controlled — the editor holds no copy of it, so persistence is one
	 * `JSON.stringify` away and undo is whatever you do with the state.
	 */
	document: EmailEditorDocument<Block>;
	/** Called with the whole next document on every edit, keystrokes included. */
	onChange: (document: EmailEditorDocument<Block>) => void;
	/** Delegated image upload: receives the picked file, resolves with its
	 * public URL. Omit to disable image uploads. */
	onUploadImage?: (file: File) => Promise<string>;
	/** Block-id factory, injectable for deterministic tests. */
	generateBlockId?: () => string;
	/** Colours, font, preview locale and metrics of the canvas. Merged over the
	 * defaults section by section, so `{ color: { brand } }` is a valid theme. */
	theme?: EmailEditorThemeInput;
	/** Every string the editor shows. Merged over the English defaults section
	 * by section, so overriding one key keeps the rest. */
	labels?: EmailEditorLabelsInput;
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
 * internal UI state. Everything below the root reads the editor through
 * context rather than through props.
 */
export function EmailBlockEditor<Block extends EmailEditorBlockLike>({
	blocks,
	document,
	onChange,
	onUploadImage,
	generateBlockId = () => crypto.randomUUID(),
	theme,
	labels,
	headerSlot,
	footerSlot,
}: Props<Block>) {
	const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
	const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
	const compact = useCompactEditorLayout();
	const coarsePointer = useCoarsePointer();
	// Editing on a phone starts on the phone rendering; the author can still
	// switch to the desktop one to check a multi-column row.
	const [preview, setPreview] = useState<EmailEditorPreview>(
		compact ? "mobile" : "desktop",
	);

	const openBlockSettings = useCallback(
		() => setSettingsSheetOpen(true),
		[setSettingsSheetOpen],
	);
	const registry = useMemo(
		() => (Array.isArray(blocks) ? createEmailBlockRegistry(blocks) : blocks),
		[blocks],
	) as EmailEditorRegistry;
	const actions = useEmailEditorActions({
		registry,
		document,
		// The one place a block union is forgotten. Everything below the root is
		// written against `EmailEditorBlockLike` and looks its definition up by
		// `type`, so the erased union is never needed again — and React contexts
		// cannot be generic, which is why it has to happen here.
		onDocumentChange: onChange as (
			next: EmailEditorDocument<EmailEditorBlockLike>,
		) => void,
		selectedBlockId,
		onSelectedBlockIdChange: setSelectedBlockId,
		onPreviewChange: setPreview,
		generateBlockId,
		// Only the sheet layout needs an opener; the sidebar layout is always there.
		openBlockSettings: compact ? openBlockSettings : undefined,
	});
	const config = useMemo(
		() => ({
			registry,
			theme: mergeEmailEditorTheme(theme),
			labels: mergeEmailEditorLabels(labels),
			onUploadImage,
			generateBlockId,
		}),
		[registry, theme, labels, onUploadImage, generateBlockId],
	);

	return (
		<EmailEditorProvider
			config={config}
			state={{ document, selectedBlockId, preview, compact, coarsePointer }}
			actions={actions}
		>
			<div
				className={
					compact
						? "grid grid-cols-1 items-start gap-6"
						: "grid grid-cols-[minmax(0,1fr)_280px] items-start gap-6"
				}
			>
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-end">
						<PreviewToggle />
					</div>
					<EditorCanvas headerSlot={headerSlot} footerSlot={footerSlot} />
				</div>
				{compact ? null : <EditorSidebar />}
			</div>
			{compact ? (
				<BlockSettingsSheet
					open={settingsSheetOpen}
					onOpenChange={setSettingsSheetOpen}
				/>
			) : null}
		</EmailEditorProvider>
	);
}
