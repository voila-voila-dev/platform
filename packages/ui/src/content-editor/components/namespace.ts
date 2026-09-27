import { ContentEditorCanvas } from "#/content-editor/components/canvas.tsx";
import { ContentEditorCharacterCount } from "#/content-editor/components/character-count.tsx";
import { ContentEditorDropZone } from "#/content-editor/components/drop-zone.tsx";
import { ContentEditorFloatingToolbar } from "#/content-editor/components/floating-toolbar.tsx";
import { ContentEditorInspector } from "#/content-editor/components/inspector.tsx";
import { ContentEditorLayout } from "#/content-editor/components/layout.tsx";
import { ContentEditorRoot } from "#/content-editor/components/root.tsx";
import { ContentEditorToolbar } from "#/content-editor/components/toolbar.tsx";
import { ContentEditorToolbarGroup } from "#/content-editor/components/toolbar-group.tsx";
import { ContentEditorToolbarItem } from "#/content-editor/components/toolbar-item.tsx";
import { ContentEditorToolbarMenu } from "#/content-editor/components/toolbar-menu.tsx";

/**
 * The content editor parts as one namespace, in composition order: the
 * Root provides, the DropZone takes files anywhere inside it, the Layout
 * arranges, the Canvas is the document, and the rest is chrome.
 */
export const ContentEditor = {
	Root: ContentEditorRoot,
	DropZone: ContentEditorDropZone,
	Layout: ContentEditorLayout,
	Toolbar: ContentEditorToolbar,
	ToolbarGroup: ContentEditorToolbarGroup,
	ToolbarItem: ContentEditorToolbarItem,
	ToolbarMenu: ContentEditorToolbarMenu,
	Canvas: ContentEditorCanvas,
	FloatingToolbar: ContentEditorFloatingToolbar,
	Inspector: ContentEditorInspector,
	CharacterCount: ContentEditorCharacterCount,
};
