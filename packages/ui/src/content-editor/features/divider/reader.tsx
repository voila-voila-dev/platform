import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { classAttribute } from "#/content-editor/reader/escape-html.ts";

export interface ContentDividerNode extends ContentNodeLike {
	readonly type: "hr";
	readonly id?: string;
}

export const dividerNode: ContentNodeReader<ContentDividerNode> = {
	type: "hr",
	kind: "void",
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
