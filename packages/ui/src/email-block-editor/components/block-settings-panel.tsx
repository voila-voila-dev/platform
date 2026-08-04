import { SelectedBlockSettings } from "#/email-block-editor/components/selected-block-settings.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorState,
} from "#/email-block-editor/context/email-editor-context.tsx";
import { allEmailEditorBlocks } from "#/email-block-editor/document/reducer.ts";

/**
 * The settings of the selected block, driven by the block registry. Rendered
 * bare so it can live either in the desktop sidebar card or in the mobile
 * bottom sheet without either owning the other's chrome.
 */
export function BlockSettingsPanel() {
	const { document, selectedBlockId } = useEmailEditorState();
	const { chrome } = useEmailEditorLabels();
	// Grid children are selectable too, so the lookup walks the whole tree.
	const selectedBlock =
		allEmailEditorBlocks(document.blocks).find(
			(block) => block.id === selectedBlockId,
		) ?? null;

	if (selectedBlock === null) {
		return (
			<p className="text-muted-foreground text-sm">
				{chrome.selectBlockPrompt}
			</p>
		);
	}

	return <SelectedBlockSettings block={selectedBlock} />;
}
