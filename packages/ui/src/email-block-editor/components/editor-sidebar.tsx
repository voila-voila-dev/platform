import { BlockSettingsPanel } from "#/email-block-editor/components/block-settings-panel.tsx";
import type {
	EmailEditorAction,
	EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";

interface Props {
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}

/** The desktop settings column: the panel above, in its own titled card. */
export function EditorSidebar({ state, dispatch, onUploadImage }: Props) {
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
