import { BlockSettingsPanel } from "#/email-block-editor/components/block-settings-panel.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";

/** The desktop settings column: the panel above, in its own titled card. */
export function EditorSidebar() {
	const { chrome } = useEmailEditorLabels();
	return (
		<div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
			<h3 className="font-medium text-sm">{chrome.blockSettings}</h3>
			<BlockSettingsPanel />
		</div>
	);
}
