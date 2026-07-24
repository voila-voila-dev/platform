import {
	type EmailBlockComponentProps,
	emailBlockDefinition,
} from "#/blocks/block-definitions.tsx";
import {
	allEmailEditorBlocks,
	type EmailEditorAction,
	type EmailEditorState,
} from "#/document/reducer.ts";
import type { EmailEditorBlock } from "#/document/types.ts";

function SelectedBlockSettings({
	block,
	dispatch,
	onUploadImage,
}: {
	block: EmailEditorBlock;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}) {
	const definition = emailBlockDefinition(block);
	if (definition.Settings === null) {
		return (
			<p className="text-muted-foreground text-sm">
				This block has no settings.
			</p>
		);
	}
	const settingsProps: EmailBlockComponentProps = {
		block,
		selected: true,
		onChange: (updated) => dispatch({ type: "update", block: updated }),
		onUploadImage,
	};
	return <definition.Settings key={block.id} {...settingsProps} />;
}

/**
 * The settings of the selected block, driven by the block registry. Rendered
 * bare so it can live either in the desktop sidebar card or in the mobile
 * bottom sheet without either owning the other's chrome.
 */
export function BlockSettingsPanel({
	state,
	dispatch,
	onUploadImage,
}: {
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}) {
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

/** The desktop settings column: the panel above, in its own titled card. */
export function EditorSidebar({
	state,
	dispatch,
	onUploadImage,
}: {
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}) {
	return (
		<div className="flex flex-col gap-4 rounded-lg border bg-background p-4">
			<h3 className="font-medium text-sm">Block settings</h3>
			<BlockSettingsPanel
				state={state}
				dispatch={dispatch}
				onUploadImage={onUploadImage}
			/>
		</div>
	);
}
