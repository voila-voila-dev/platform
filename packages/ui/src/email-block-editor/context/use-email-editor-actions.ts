import * as React from "react";
import type { EmailEditorRegistry } from "#/email-block-editor/blocks/registry.ts";
import type { EmailEditorActionsContextValue } from "#/email-block-editor/context/email-editor-context.tsx";
import type {
	EmailEditorAction,
	EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";
import { createEmailEditorReducer } from "#/email-block-editor/document/reducer.ts";
import type {
	EmailEditorBlockLike,
	EmailEditorDocument,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";

interface Options {
	readonly registry: EmailEditorRegistry;
	readonly document: EmailEditorDocument<EmailEditorBlockLike>;
	readonly onDocumentChange: (
		document: EmailEditorDocument<EmailEditorBlockLike>,
	) => void;
	readonly selectedBlockId: string | null;
	readonly onSelectedBlockIdChange: (blockId: string | null) => void;
	readonly onPreviewChange: (preview: EmailEditorPreview) => void;
	readonly generateBlockId: () => string;
	/** Only in the compact layout, where the settings live in a sheet. */
	readonly openBlockSettings?: () => void;
}

/**
 * The editor's actions, stable for the lifetime of the instance. Each one
 * reduces over the *current* state, read through a ref rather than captured at
 * render, so a part that only edits never re-renders because the document
 * changed underneath it.
 */
export function useEmailEditorActions({
	registry,
	document,
	onDocumentChange,
	selectedBlockId,
	onSelectedBlockIdChange,
	onPreviewChange,
	generateBlockId,
	openBlockSettings,
}: Options): EmailEditorActionsContextValue {
	const latest = React.useRef({
		state: { document, selectedBlockId } satisfies EmailEditorState,
		onDocumentChange,
		onSelectedBlockIdChange,
		onPreviewChange,
		generateBlockId,
		registry,
	});
	React.useEffect(() => {
		latest.current = {
			state: { document, selectedBlockId },
			onDocumentChange,
			onSelectedBlockIdChange,
			onPreviewChange,
			generateBlockId,
			registry,
		};
	});

	const dispatch = React.useCallback((action: EmailEditorAction) => {
		const current = latest.current;
		const next = createEmailEditorReducer(
			current.registry,
			current.generateBlockId,
		)(current.state, action);
		// Kept in the ref so two dispatches inside one event compose instead of
		// the second one reducing over pre-event state.
		latest.current = { ...current, state: next };
		if (next.document !== current.state.document) {
			current.onDocumentChange(next.document);
		}
		if (next.selectedBlockId !== current.state.selectedBlockId) {
			current.onSelectedBlockIdChange(next.selectedBlockId);
		}
	}, []);

	return React.useMemo(
		() => ({
			addBlock: (blockType, options) =>
				dispatch({
					type: "add",
					blockType,
					containerId: options?.containerId,
					index: options?.index,
				}),
			updateBlock: (block) => dispatch({ type: "update", block }),
			removeBlock: (blockId) => dispatch({ type: "remove", blockId }),
			moveBlock: (blockId, toContainerId, toIndex) =>
				dispatch({ type: "move", blockId, toContainerId, toIndex }),
			duplicateBlock: (blockId) => dispatch({ type: "duplicate", blockId }),
			selectBlock: (blockId) => dispatch({ type: "select", blockId }),
			replaceDocument: (next) => dispatch({ type: "replace", document: next }),
			setPreview: (preview) => latest.current.onPreviewChange(preview),
			openBlockSettings,
		}),
		[dispatch, openBlockSettings],
	);
}
