import { EMAIL_LEAF_BLOCK_TYPES } from "#/email-block-editor/blocks/block-definitions.tsx";
import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import type { CanvasContext } from "#/email-block-editor/components/editor-canvas.tsx";

interface Props {
	gridId: string;
	context: CanvasContext;
}

/** The dashed add slot of a grid cell. */
export function GridAddCell({ gridId, context }: Props) {
	return (
		<div className="flex items-center justify-center rounded-lg border border-dashed px-2 py-6">
			<AddBlockMenu
				types={EMAIL_LEAF_BLOCK_TYPES}
				onAdd={(type) =>
					context.dispatch({
						type: "add",
						blockType: type,
						containerId: gridId,
					})
				}
			/>
		</div>
	);
}
