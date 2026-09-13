import { createContext, useContext } from "react";
import type {
	ContentCapability,
	ContentEditorMode,
	ContentUploadedImage,
} from "#/content-editor/features/feature-definition.tsx";
import type { ContentRegistry } from "#/content-editor/features/registry.ts";
import type { ContentEditorLabels } from "#/content-editor/labels.ts";
import type { ContentEditorTheme } from "#/content-editor/theme.ts";

/**
 * What an editor instance is configured with, as opposed to what it shows.
 * Memoised once by the root, so a part reading it does not re-render on
 * every keystroke; the document itself lives in Plate's own store.
 */
export interface ContentEditorConfigContextValue {
	readonly registry: ContentRegistry;
	readonly mode: ContentEditorMode;
	readonly labels: ContentEditorLabels;
	readonly theme: ContentEditorTheme;
	readonly capabilities: ReadonlySet<ContentCapability>;
	readonly uploadImage: ((file: File) => Promise<ContentUploadedImage>) | null;
	readonly generateNodeId: () => string;
	readonly readOnly: boolean;
}

const ContentEditorConfigContext =
	createContext<ContentEditorConfigContextValue | null>(null);

export const ContentEditorConfigProvider = ContentEditorConfigContext.Provider;

export function useContentEditorConfig(): ContentEditorConfigContextValue {
	const value = useContext(ContentEditorConfigContext);
	if (value === null) {
		throw new Error(
			"A content editor part was rendered outside <ContentEditor.Root>.",
		);
	}
	return value;
}

export function useContentEditorLabels(): ContentEditorLabels {
	return useContentEditorConfig().labels;
}

export function useContentEditorRegistry(): ContentRegistry {
	return useContentEditorConfig().registry;
}
