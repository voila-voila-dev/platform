import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import {
	type ContentVariableNode,
	variablePlaceholder,
} from "#/content-editor/features/variable/reader.tsx";
import type { ContentElementViewProps } from "#/content-editor/lib/define-element-feature.ts";

/** The variable as a chip, by its label; the placeholder it stands for on hover. */
export function VariableChip({
	node,
}: ContentElementViewProps<ContentVariableNode>) {
	const { variables } = useContentEditorConfig();
	const variable = variables.find((candidate) => candidate.name === node.name);
	return (
		<span
			data-slot="content-editor-variable"
			title={variablePlaceholder(node.name)}
			className="rounded-md bg-(--content-editor-brand)/10 px-1.5 font-medium text-(color:--content-editor-brand) text-[0.9em]"
		>
			{variable?.label ?? node.name}
		</span>
	);
}
