import { EMAIL_LEAF_BLOCK_TYPES } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import { useEmailEditorActions } from "#/email-block-editor/context/email-editor-context.tsx";

interface Props {
	gridId: string;
}

/** The dashed add slot of a grid cell. */
export function GridAddCell({ gridId }: Props) {
	const { addBlock } = useEmailEditorActions();
	return (
		<div className="flex items-center justify-center rounded-lg border border-dashed px-2 py-6">
			<AddBlockMenu
				types={EMAIL_LEAF_BLOCK_TYPES}
				onAdd={(type) => addBlock(type, { containerId: gridId })}
			/>
		</div>
	);
}
