import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentInsertableNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import { classAttribute } from "#/content-editor/reader/escape-html.ts";

export interface ContentDividerNode extends ContentNodeLike {
	readonly type: "hr";
	readonly id?: string;
}

export const dividerNode: ContentInsertableNodeReader<ContentDividerNode> = {
	type: "hr",
	kind: "void",
	createNode: (init) => ({
		id: newContentNodeId(),
		type: "hr",
		children: [{ text: "" }],
		...init,
	}),
	Render: ({ options }) => (
		<hr className={options.classNameFor?.("hr") ?? "border-border"} />
	),
	toHtml: (_node, _children, options) =>
		`<hr${classAttribute(options.classNameFor?.("hr"))}>`,
};

export const dividerReader = {
	key: "divider",
	nodes: [dividerNode],
} satisfies ContentFeatureReader;
