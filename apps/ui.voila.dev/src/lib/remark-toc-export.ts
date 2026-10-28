/**
 * Collects h2/h3 headings and injects `export const toc = JSON.parse("…")`
 * into each MDX module, so the "On this page" rail costs no extra parse at
 * runtime. Slugs come from github-slugger — the same algorithm rehype-slug
 * uses on the rendered headings, so the anchors always line up.
 */
import GithubSlugger from "github-slugger";
import type { Heading, Root } from "mdast";
import { toString as mdastToString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

export interface TocEntry {
	depth: 2 | 3;
	text: string;
	id: string;
}

export function remarkTocExport() {
	return (tree: Root) => {
		const slugger = new GithubSlugger();
		const toc: TocEntry[] = [];
		visit(tree, "heading", (node: Heading) => {
			const text = mdastToString(node);
			// Slug every depth so the counter matches rehype-slug exactly.
			const id = slugger.slug(text);
			if (node.depth === 2 || node.depth === 3) {
				toc.push({ depth: node.depth, text, id });
			}
		});
		tree.children.unshift({
			type: "mdxjsEsm",
			value: "",
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ExportNamedDeclaration",
							specifiers: [],
							attributes: [],
							declaration: {
								type: "VariableDeclaration",
								kind: "const",
								declarations: [
									{
										type: "VariableDeclarator",
										id: { type: "Identifier", name: "toc" },
										init: {
											type: "CallExpression",
											optional: false,
											callee: {
												type: "MemberExpression",
												computed: false,
												optional: false,
												object: { type: "Identifier", name: "JSON" },
												property: { type: "Identifier", name: "parse" },
											},
											arguments: [
												{
													type: "Literal",
													value: JSON.stringify(toc),
												},
											],
										},
									},
								],
							},
						},
					],
				},
			},
			// biome-ignore lint/suspicious/noExplicitAny: mdast's types do not know about mdxjsEsm nodes.
		} as any);
	};
}
