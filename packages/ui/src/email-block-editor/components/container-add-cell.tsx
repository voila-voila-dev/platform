import { AddBlockMenu } from "#/email-block-editor/components/add-block-menu.tsx";
import {
	useEmailEditorActions,
	useEmailEditorRegistry,
} from "#/email-block-editor/context/email-editor-context.tsx";

interface Props {
	containerId: string;
	containerType: string;
}

/** The dashed add slot of a container's cell, offering the types that
 * container accepts. */
export function ContainerAddCell({ containerId, containerType }: Props) {
	const { addBlock } = useEmailEditorActions();
	const registry = useEmailEditorRegistry();
	return (
		<div className="flex items-center justify-center rounded-lg border border-dashed px-2 py-6">
			<AddBlockMenu
				types={registry.types.filter((type) =>
					registry.accepts(containerType, type),
				)}
				onAdd={(type) => addBlock(type, { containerId })}
			/>
		</div>
	);
}
