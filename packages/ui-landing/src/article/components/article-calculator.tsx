import type {
	ContentNodeLike,
	ContentNodeReader,
} from "@voila.dev/ui/content-editor/reader";
import type { ComponentType } from "react";

/** The node a calculator is stored as in an article's body. */
export const ARTICLE_CALCULATOR_NODE_TYPE = "calculator";

/** A calculator in an article's body: a void block naming its `kind`. */
export interface ArticleCalculatorNode extends ContentNodeLike {
	readonly type: typeof ARTICLE_CALCULATOR_NODE_TYPE;
	readonly id?: string;
	readonly kind?: string;
}

export interface ArticleCalculatorProps {
	readonly kind: string;
	readonly id?: string;
}

/**
 * How the host draws a calculator: the site prints one that hydrates in the
 * reader's browser, the admin a stand-in, so neither the copy nor the client
 * code of the calculators lives here. `kinds` are the ones it can draw; any
 * other prints nothing.
 */
export interface ArticleCalculatorRenderer {
	readonly kinds: ReadonlyArray<string>;
	readonly Render: ComponentType<ArticleCalculatorProps>;
	readonly toHtml: (props: ArticleCalculatorProps) => string;
}

function knownKind(
	node: ArticleCalculatorNode,
	renderer: ArticleCalculatorRenderer,
): string | null {
	return node.kind !== undefined && renderer.kinds.includes(node.kind)
		? node.kind
		: null;
}

export function articleCalculatorNode(
	renderer: ArticleCalculatorRenderer,
): ContentNodeReader<ArticleCalculatorNode> {
	return {
		type: ARTICLE_CALCULATOR_NODE_TYPE,
		kind: "void",
		Render: ({ node, options }) => {
			const kind = knownKind(node, renderer);
			return kind === null ? null : (
				<renderer.Render kind={kind} id={options.idFor?.(node) ?? node.id} />
			);
		},
		toHtml: (node, _children, options) => {
			const kind = knownKind(node, renderer);
			return kind === null
				? ""
				: renderer.toHtml({ kind, id: options.idFor?.(node) ?? node.id });
		},
	};
}
