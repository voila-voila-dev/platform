import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import type {
	AnyEmailBlockDefinition,
	EmailEditorRegistry,
} from "#/email-block-editor/blocks/registry.ts";
import { createEmailBlockRegistry } from "#/email-block-editor/blocks/registry.ts";
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

export interface EmailEditorRootProps<Block extends EmailEditorBlockLike> {
	/**
	 * The block types this editor offers. `createEmailBlocks` returns the ones
	 * this package ships; add your own, drop what you do not want, reorder them.
	 * Either the definition list or a registry built from it.
	 */
	blocks: ReadonlyArray<AnyEmailBlockDefinition> | EmailEditorRegistry;
	/**
	 * The document being edited: `{ version, blocks }`, plain serialisable data.
	 * Controlled — the editor holds no copy, so persistence is one
	 * `JSON.stringify` away and undo is whatever you do with the state.
	 */
	document: EmailEditorDocument<Block>;
	/** Called with the whole next document on every edit, keystrokes included. */
	onDocumentChange: (document: EmailEditorDocument<Block>) => void;
	/** Controls the selection. Omit both to let the editor keep it internally. */
	selectedBlockId?: string | null;
	onSelectedBlockIdChange?: (blockId: string | null) => void;
	/** Controls which rendering the canvas mirrors. Omit both and the editor
	 * starts on the one that suits the viewport. */
	preview?: EmailEditorPreview;
	onPreviewChange?: (preview: EmailEditorPreview) => void;
	/** Delegated image upload: receives the picked file, resolves with its
	 * public URL. Omit to disable image uploads. */
	onUploadImage?: (file: File) => Promise<string>;
	/** Block-id factory, injectable for deterministic tests. */
	generateBlockId?: () => string;
	/** Colours, font, preview locale and metrics of the canvas. */
	theme?: EmailEditorThemeInput;
	/** Every string the editor shows. */
	labels?: EmailEditorLabelsInput;
	children: ReactNode;
}

/**
 * The editor's provider. It renders no chrome of its own: what the editor
 * looks like is the parts you compose inside it.
 *
 * Selection and preview are controlled if you pass them and internal if you do
 * not, so a host with its own undo stack can own them without every host
 * having to.
 */
export function EmailEditorRoot<Block extends EmailEditorBlockLike>({
	blocks,
	document,
	onDocumentChange,
	selectedBlockId,
	onSelectedBlockIdChange,
	preview,
	onPreviewChange,
	onUploadImage,
	generateBlockId = () => crypto.randomUUID(),
	theme,
	labels,
	children,
}: EmailEditorRootProps<Block>) {
	const compact = useCompactEditorLayout();
	const coarsePointer = useCoarsePointer();
	const [ownSelectedBlockId, setOwnSelectedBlockId] = useState<string | null>(
		null,
	);
	// Editing on a phone starts on the phone rendering; the author can still
	// switch to the desktop one to check a multi-column row.
	const [ownPreview, setOwnPreview] = useState<EmailEditorPreview>(
		compact ? "mobile" : "desktop",
	);
	const [blockSettingsOpen, setBlockSettingsOpen] = useState(false);

	const registry = useMemo(
		() => (Array.isArray(blocks) ? createEmailBlockRegistry(blocks) : blocks),
		[blocks],
	) as EmailEditorRegistry;

	const openBlockSettings = useCallback(() => setBlockSettingsOpen(true), []);
	const actions = useEmailEditorActions({
		registry,
		document,
		// The one place the block union is forgotten. Everything below the root
		// is written against `EmailEditorBlockLike` and looks its definition up
		// by `type`, so the erased union is never needed again — and a React
		// context cannot be generic, which is why it has to happen here.
		onDocumentChange: onDocumentChange as (
			next: EmailEditorDocument<EmailEditorBlockLike>,
		) => void,
		selectedBlockId: selectedBlockId ?? ownSelectedBlockId,
		onSelectedBlockIdChange: onSelectedBlockIdChange ?? setOwnSelectedBlockId,
		onPreviewChange: onPreviewChange ?? setOwnPreview,
		generateBlockId,
		// Only the sheet layout needs an opener; the settings column is always
		// on screen in the wide one.
		openBlockSettings: compact ? openBlockSettings : undefined,
		setBlockSettingsOpen,
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
			state={{
				document,
				selectedBlockId: selectedBlockId ?? ownSelectedBlockId,
				preview: preview ?? ownPreview,
				compact,
				coarsePointer,
				blockSettingsOpen,
			}}
			actions={actions}
		>
			{children}
		</EmailEditorProvider>
	);
}
