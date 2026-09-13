import { ContentEditorCanvas } from "#/content-editor/components/canvas.tsx";
import { ContentEditorCharacterCount } from "#/content-editor/components/character-count.tsx";
import { ContentEditorFloatingToolbar } from "#/content-editor/components/floating-toolbar.tsx";
import { ContentEditorLayout } from "#/content-editor/components/layout.tsx";
import { ContentEditorRoot } from "#/content-editor/components/root.tsx";
import { ContentEditorToolbar } from "#/content-editor/components/toolbar.tsx";
import { ContentEditorToolbarGroup } from "#/content-editor/components/toolbar-group.tsx";
import { ContentEditorToolbarItem } from "#/content-editor/components/toolbar-item.tsx";

/**
 * The content editor parts as one namespace, in composition order: the
 * Root provides, the Layout arranges, the Canvas is the document, and the
 * rest is chrome.
 */
export const ContentEditor = {
	Root: ContentEditorRoot,
	Layout: ContentEditorLayout,
	Toolbar: ContentEditorToolbar,
	ToolbarGroup: ContentEditorToolbarGroup,
	ToolbarItem: ContentEditorToolbarItem,
	Canvas: ContentEditorCanvas,
	FloatingToolbar: ContentEditorFloatingToolbar,
	CharacterCount: ContentEditorCharacterCount,
};
