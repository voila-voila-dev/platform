import type { EmailBlockComponentProps } from "#/email-block-editor/blocks/block-definitions.tsx";
import {
	useEmailEditorActions,
	useEmailEditorConfig,
	useEmailEditorLabels,
	useEmailEditorRegistry,
} from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorBlockLike } from "#/email-block-editor/document/types.ts";

interface Props {
	block: EmailEditorBlockLike;
}

/** The settings panel of whichever block is selected. */
export function SelectedBlockSettings({ block }: Props) {
	const { updateBlock } = useEmailEditorActions();
	const { onUploadImage } = useEmailEditorConfig();
	const { chrome } = useEmailEditorLabels();
	const registry = useEmailEditorRegistry();
	const definition = registry.definitionFor(block.type);
	if (definition?.Settings == null) {
		return (
			<p className="text-muted-foreground text-sm">{chrome.noBlockSettings}</p>
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
