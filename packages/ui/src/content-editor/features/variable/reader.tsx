import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentFeatureReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { escapeHtml } from "#/content-editor/reader/escape-html.ts";

/** A value filled in per recipient when the mail is sent, e.g. `firstName`. */
export interface ContentVariableNode extends ContentNodeLike {
	readonly type: "variable";
	readonly id?: string;
	readonly name: string;
}

/** The placeholder a renderer substitutes: `{{firstName}}`. */
export const variablePlaceholder = (name: string): string => `{{${name}}}`;

export const variableNode: ContentNodeReader<ContentVariableNode> = {
	type: "variable",
	kind: "inline",
	markdown: {
		serialize: (node) => ({
			type: "text",
			value: variablePlaceholder(node.name),
		}),
	},
	Render: ({ node }) => <>{variablePlaceholder(node.name)}</>,
	toHtml: (node) => escapeHtml(variablePlaceholder(node.name)),
};

export const variableReader = {
	key: "variable",
	nodes: [variableNode],
} satisfies ContentFeatureReader;
