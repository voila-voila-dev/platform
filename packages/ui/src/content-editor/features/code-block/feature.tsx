import { CodeBlockIcon } from "@phosphor-icons/react";
import {
	createPlatePlugin,
	PlateElement,
	type PlateElementProps,
} from "platejs/react";
import {
	codeBlockNode,
	codeBlockReader,
} from "#/content-editor/features/code-block/reader.tsx";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { insertBlockInPlace } from "#/content-editor/lib/insert-block.ts";

/**
 * Declared with Plate's own node types, which is what fenced code comes back
 * from Markdown as, without `@platejs/code-block`: no highlighting, Enter
 * starts a new line of code.
 */
const CodeBlockPlugin = createPlatePlugin({
	key: "code_block",
	node: { isElement: true },
});

const CodeLinePlugin = createPlatePlugin({
	key: "code_line",
	node: { isElement: true },
});

export function CodeBlockElement(props: PlateElementProps) {
	return (
		<PlateElement
			{...props}
			as="pre"
			className="overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-sm"
		/>
	);
}

/** Lines of code sit flush: the canvas's gap between blocks would space them apart. */
export function CodeLineElement(props: PlateElementProps) {
	return <PlateElement {...props} className="mt-0!" />;
}

/** The caret goes into the code, not the paragraph that follows it. */
function insertCodeBlock(editor: ContentEditorApi) {
	const block = codeBlockNode.createNode();
	insertBlockInPlace(editor, block);
	const inserted = editor.api.node({ at: [], id: block.id as string });
	if (inserted !== undefined) {
		editor.tf.select(editor.api.start(inserted[1]));
	}
}

export const codeBlockFeature: ContentFeature = {
	...codeBlockReader,
	plugins: () => [CodeBlockPlugin, CodeLinePlugin],
	components: { code_block: CodeBlockElement, code_line: CodeLineElement },
	toolbar: [
		{
			key: "codeBlock",
			group: "insert",
			icon: CodeBlockIcon,
			label: "codeBlock",
			run: insertCodeBlock,
		},
	],
	slash: [
		{
			key: "codeBlock",
			icon: CodeBlockIcon,
			label: "codeBlock",
			keywords: ["code", "snippet", "pre"],
			run: insertCodeBlock,
		},
	],
};
