import {
	EmailEditorBlocks,
	EmailEditorCanvas,
	EmailEditorCard,
	EmailEditorCardFooter,
	EmailEditorCardHeader,
} from "#/email-block-editor/parts/canvas.tsx";
import { EmailEditorLayout } from "#/email-block-editor/parts/layout.tsx";
import { EmailEditorRoot } from "#/email-block-editor/parts/root.tsx";
import {
	EmailEditorBlockSettings,
	EmailEditorDocumentSettings,
	EmailEditorSettingsSheet,
	EmailEditorSidebar,
} from "#/email-block-editor/parts/settings.tsx";
import { EmailEditorToolbar } from "#/email-block-editor/parts/toolbar.tsx";

/**
 * The email editor, as parts you arrange.
 *
 * ```tsx
 * <EmailEditor.Root blocks={BLOCKS} document={doc} onDocumentChange={setDoc}>
 *   <EmailEditor.Layout>
 *     <EmailEditor.Toolbar />
 *     <EmailEditor.Canvas />
 *     <EmailEditor.Sidebar />
 *   </EmailEditor.Layout>
 *   <EmailEditor.SettingsSheet />
 * </EmailEditor.Root>
 * ```
 *
 * Every part renders a sensible default with no children, so the shape above
 * is a complete editor. Pass children to any of them to take over.
 */
export const EmailEditor = {
	Root: EmailEditorRoot,
	Layout: EmailEditorLayout,
	Toolbar: EmailEditorToolbar,
	Canvas: EmailEditorCanvas,
	Card: EmailEditorCard,
	CardHeader: EmailEditorCardHeader,
	CardFooter: EmailEditorCardFooter,
	Blocks: EmailEditorBlocks,
	Sidebar: EmailEditorSidebar,
	DocumentSettings: EmailEditorDocumentSettings,
	BlockSettings: EmailEditorBlockSettings,
	SettingsSheet: EmailEditorSettingsSheet,
};
