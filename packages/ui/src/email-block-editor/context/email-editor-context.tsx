import * as React from "react";
import type { EmailEditorContainerId } from "#/email-block-editor/document/reducer.ts";
import type {
	EmailEditorBlock,
	EmailEditorBlockType,
	EmailEditorDocument,
	EmailEditorPreview,
} from "#/email-block-editor/document/types.ts";

/**
 * What an editor instance is configured with, as opposed to what it currently
 * shows. Memoised once by the root, so a reader of this context does not
 * re-render on every keystroke.
 */
export interface EmailEditorConfigContextValue {
	/** Delegated image upload: receives the picked file, resolves with its
	 * public URL. Undefined disables image uploads. */
	readonly onUploadImage?: (file: File) => Promise<string>;
	readonly generateBlockId: () => string;
}

/** What the editor is showing right now. Changes on every edit. */
export interface EmailEditorStateContextValue {
	readonly document: EmailEditorDocument;
	readonly selectedBlockId: string | null;
	readonly preview: EmailEditorPreview;
	/** The settings live in a bottom sheet rather than in a side column. */
	readonly compact: boolean;
	/** Touch rather than mouse: the toolbars need room instead of hover. */
	readonly coarsePointer: boolean;
}

/**
 * Every edit an editor part can ask for. The callbacks are stable for the
 * lifetime of the editor — they read the current state through a ref — so a
 * part that only acts never re-renders because the document changed.
 */
export interface EmailEditorActionsContextValue {
	readonly addBlock: (
		blockType: EmailEditorBlockType,
		options?: {
			readonly containerId?: EmailEditorContainerId;
			/** Insertion position within the container; appends when omitted. */
			readonly index?: number;
		},
	) => void;
	readonly updateBlock: (block: EmailEditorBlock) => void;
	readonly removeBlock: (blockId: string) => void;
	readonly moveBlock: (
		blockId: string,
		toContainerId: EmailEditorContainerId,
		toIndex: number,
	) => void;
	readonly duplicateBlock: (blockId: string) => void;
	readonly selectBlock: (blockId: string | null) => void;
	readonly replaceDocument: (document: EmailEditorDocument) => void;
	readonly setPreview: (preview: EmailEditorPreview) => void;
	/** Opens the block settings sheet. Undefined in the wide layout, where the
	 * settings column is always on screen. */
	readonly openBlockSettings?: () => void;
}

const EmailEditorConfigContext =
	React.createContext<EmailEditorConfigContextValue | null>(null);
const EmailEditorStateContext =
	React.createContext<EmailEditorStateContextValue | null>(null);
const EmailEditorActionsContext =
	React.createContext<EmailEditorActionsContextValue | null>(null);

export function EmailEditorProvider({
	config,
	state,
	actions,
	children,
}: {
	readonly config: EmailEditorConfigContextValue;
	readonly state: EmailEditorStateContextValue;
	readonly actions: EmailEditorActionsContextValue;
	readonly children: React.ReactNode;
}) {
	return (
		<EmailEditorConfigContext.Provider value={config}>
			<EmailEditorActionsContext.Provider value={actions}>
				<EmailEditorStateContext.Provider value={state}>
					{children}
				</EmailEditorStateContext.Provider>
			</EmailEditorActionsContext.Provider>
		</EmailEditorConfigContext.Provider>
	);
}

const use = <T,>(context: React.Context<T | null>, hook: string): T => {
	const value = React.useContext(context);
	if (value === null) {
		throw new Error(`${hook} must be used within an <EmailBlockEditor />`);
	}
	return value;
};

export const useEmailEditorConfig = (): EmailEditorConfigContextValue =>
	use(EmailEditorConfigContext, "useEmailEditorConfig");

export const useEmailEditorState = (): EmailEditorStateContextValue =>
	use(EmailEditorStateContext, "useEmailEditorState");

export const useEmailEditorActions = (): EmailEditorActionsContextValue =>
	use(EmailEditorActionsContext, "useEmailEditorActions");

/** State and actions together, for the parts that both read and edit. */
export const useEmailEditor = (): EmailEditorStateContextValue &
	EmailEditorActionsContextValue => ({
	...useEmailEditorState(),
	...useEmailEditorActions(),
});
