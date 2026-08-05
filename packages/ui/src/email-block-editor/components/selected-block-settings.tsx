import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import { emailBlockDefinition } from "#/email-block-editor/blocks/block-definitions.tsx";
import {
	useEmailEditorActions,
	useEmailEditorConfig,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorBlock } from "#/email-block-editor/document/types.ts";

interface Props {
	block: EmailEditorBlock;
}

/** The settings panel of whichever block is selected. */
export function SelectedBlockSettings({ block }: Props) {
	const { updateBlock } = useEmailEditorActions();
	const { onUploadImage } = useEmailEditorConfig();
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
		onChange: updateBlock,
		onUploadImage,
	};
	return <definition.Settings key={block.id} {...settingsProps} />;
}
