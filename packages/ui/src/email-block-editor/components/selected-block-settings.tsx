import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { emailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import type { EmailEditorAction } from "#/email-block-editor/document/reducer.ts";
import type { EmailEditorBlock } from "#/email-block-editor/document/types.ts";

interface Props {
	block: EmailEditorBlock;
	dispatch: (action: EmailEditorAction) => void;
	onUploadImage?: (file: File) => Promise<string>;
}

/** The settings panel of whichever block is selected. */
export function SelectedBlockSettings({
	block,
	dispatch,
	onUploadImage,
}: Props) {
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
