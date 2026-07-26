import { SelectedBlockSettings } from "#/email-block-editor/components/selected-block-settings.tsx";
import type {
	EmailEditorAction,
	EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";
import { allEmailEditorBlocks } from "#/email-block-editor/document/reducer.ts";

interface Props {
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}

/**
 * The settings of the selected block, driven by the block registry. Rendered
 * bare so it can live either in the desktop sidebar card or in the mobile
 * bottom sheet without either owning the other's chrome.
 */
export function BlockSettingsPanel({ state, dispatch, onUploadImage }: Props) {
	// Grid children are selectable too, so the lookup walks the whole tree.
	const selectedBlock =
		allEmailEditorBlocks(state.document.blocks).find(
			(block) => block.id === state.selectedBlockId,
		) ?? null;

	if (selectedBlock === null) {
		return (
			<p className="text-muted-foreground text-sm">
				Select a block to edit its settings.
			</p>
		);
	}

	return (
		<SelectedBlockSettings
			block={selectedBlock}
			dispatch={dispatch}
			onUploadImage={onUploadImage}
		/>
	);
}
