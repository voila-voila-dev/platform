import { Drawer } from "#/drawer/components/drawer.tsx";
import { BlockSettingsPanel } from "#/email-block-editor/components/block-settings-panel.tsx";
import type {
	EmailEditorAction,
	EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	state: EmailEditorState;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}

/** The block settings panel as a bottom sheet, for the viewports where a 280px
 * column would put the options a screenful away from their block. */
export function BlockSettingsSheet({
	open,
	onOpenChange,
	state,
	dispatch,
	onUploadImage,
}: Props) {
	return (
		<Drawer.Root open={open} onOpenChange={onOpenChange}>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Block settings</Drawer.Title>
					<Drawer.Description className="sr-only">
						Options for the selected block.
					</Drawer.Description>
				</Drawer.Header>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 pb-8">
					<BlockSettingsPanel
						state={state}
						dispatch={dispatch}
						onUploadImage={onUploadImage}
					/>
				</div>
			</Drawer.Content>
		</Drawer.Root>
	);
}
