/**
 * Expands `<PropTable of="Badge" />` into a real markdown table, at build time,
 * from the props the type checker read out of `packages/ui` (see
 * `props-extract.ts`).
 *
 * A remark transform rather than a React component reading a virtual module,
 * for two reasons. The manifest is 600kB of JSON — as a runtime module it lands
 * in a chunk every one of the 194 pages pulls, to render markup that never
 * changes after the build. And a table built as mdast inherits the `MdxTable`
 * styling every hand-written table already uses, so the generated tables look
 * like the ones they replace instead of like a new component. Nothing about the
 * props reaches the browser; the page ships the finished table.
 *
 * An `of=` that names nothing renders nothing and never fails the build — a
 * half-written page still previews. `scripts/check-docs.mjs` is what turns a
 * typo into a red build.
 */
import type {
	Paragraph,
	PhrasingContent,
	Root,
	RowContent,
	Table,
	TableRow,
} from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import type { DocsPropEntry, DocsPropsManifest } from "./docs-props.types";
import { readPropsManifest } from "./props-extract";

/**
 * The walk costs ~2.4s, and every page transform needs the same answer, so it
 * runs once per process and every later page awaits the same promise.
 */
let pending: Promise<DocsPropsManifest> | undefined;

export function loadPropsManifest(): Promise<DocsPropsManifest> {
	pending ??= readPropsManifest();
	return pending;
}

/** Dev only: drop the memo so the next transform re-reads the package. */
export function invalidatePropsManifest(): void {
	pending = undefined;
}

function code(value: string): PhrasingContent {
	return { type: "inlineCode", value };
}

function text(value: string): PhrasingContent {
	return { type: "text", value };
}

const inlineParser = unified().use(remarkParse);

/**
 * JSDoc is markdown, and the props here use it: Base UI writes ``the `render`
 * prop``, and the cva recipes in this repo do the same. Emitted as a plain text
 * node the backticks and asterisks reach the page literally, so the doc is
 * parsed and its inline nodes spliced into the cell.
 *
 * Paragraphs are joined with a space rather than kept apart — a table cell is
 * one line of prose, and a JSDoc block that needs two paragraphs is saying more
 * than a cell can hold.
 */
function docCell(doc: string): PhrasingContent[] {
	const tree = inlineParser.parse(doc);
	const out: PhrasingContent[] = [];
	for (const node of tree.children) {
		if (node.type !== "paragraph") continue;
		if (out.length) out.push(text(" "));
		out.push(...dropHtml((node as Paragraph).children));
	}
	return out.length ? out : [text(doc.replace(/\s+/g, " "))];
}

/**
 * Two of Base UI's prop docs use inline HTML — `<kbd>Enter</kbd>`. Markdown
 * parses those to `html` nodes, which become `raw` hast nodes, which MDX
 * refuses to compile ("Cannot handle unknown node `raw`") and fails the whole
 * build. Dropping the tags keeps the text between them.
 */
function dropHtml(nodes: PhrasingContent[]): PhrasingContent[] {
	const out: PhrasingContent[] = [];
	for (const node of nodes) {
		if (node.type === "html") continue;
		if ("children" in node && Array.isArray(node.children)) {
			out.push({
				...node,
				children: dropHtml(node.children as PhrasingContent[]),
			} as PhrasingContent);
			continue;
		}
		out.push(node);
	}
	return out;
}

function cell(children: PhrasingContent[]): RowContent {
	return { type: "tableCell", children };
}

function row(cells: RowContent[]): TableRow {
	return { type: "tableRow", children: cells };
}

/**
 * `| undefined` on an optional prop is noise — the `?` already said it, and
 * dropping it takes the longest types down to something that fits a cell.
 */
function readableType(type: string, optional: boolean): string {
	if (!optional) return type;
	return type.replace(/\s*\|\s*undefined$/, "");
}

/**
 * Splits a union into its top-level members, ignoring every `|` nested inside
 * generics, parens, braces, brackets or a string literal. Returns a single
 * element when the type is not a union.
 */
function splitUnion(type: string): string[] {
	const members: string[] = [];
	let depth = 0;
	let quote: string | undefined;
	let start = 0;
	for (let i = 0; i < type.length; i += 1) {
		const char = type[i];
		if (quote) {
			if (char === "\\") i += 1;
			else if (char === quote) quote = undefined;
			continue;
		}
		if (char === '"' || char === "'" || char === "`") quote = char;
		else if (char === "<" || char === "(" || char === "{" || char === "[")
			depth += 1;
		else if (char === ">" || char === ")" || char === "}" || char === "]")
			depth -= 1;
		else if (char === "|" && depth === 0) {
			members.push(type.slice(start, i).trim());
			start = i + 1;
		}
	}
	members.push(type.slice(start).trim());
	return members.filter(Boolean);
}

/**
 * A union in one `inlineCode` cannot wrap — `Badge`'s 20-colour `color` ran off
 * the side of the table as a single line. Emitting each member as its own code
 * span with the `|` as plain text between them lets the cell wrap at the
 * separators, so a long union grows downwards instead of sideways.
 */
function typeCell(type: string): PhrasingContent[] {
	const members = splitUnion(type);
	if (members.length < 2 || type.length <= 48) return [code(type)];
	const out: PhrasingContent[] = [];
	for (const [index, member] of members.entries()) {
		if (index > 0) out.push(text(" | "));
		out.push(code(member));
	}
	return out;
}

function buildTable(entry: DocsPropEntry): Table {
	const header = row([
		cell([text("Prop")]),
		cell([text("Type")]),
		cell([text("Default")]),
		cell([]),
	]);
	const rows = entry.members.map((member) =>
		row([
			cell([code(member.name)]),
			cell(typeCell(readableType(member.type, member.optional))),
			cell([
				member.default !== undefined
					? code(member.default)
					: member.optional
						? text("—")
						: { type: "emphasis", children: [text("required")] },
			]),
			cell(member.doc ? docCell(member.doc) : []),
		]),
	);
	return {
		type: "table",
		align: [null, null, null, null],
		children: [header, ...rows],
		// Generated tables always have these same four columns, so they can be
		// given fixed proportions — left to `auto`, a 20-member union took 60%
		// of the width and squeezed the description into a 126px ribbon.
		// `hProperties` is how mdast passes attributes through to hast.
		data: { hProperties: { className: ["prop-table"] } },
	};
}

/** "Plus every `<span>` prop." — the 280 React attributes, in one line. */
function buildFooter(entry: DocsPropEntry): PhrasingContent[] {
	const out: PhrasingContent[] = [];
	if (entry.element) {
		out.push(text("Plus every "), code(`<${entry.element}>`), text(" prop. "));
	} else {
		out.push(text("Plus the DOM props of the element it renders. "));
	}
	out.push(text("Source: "), code(entry.source), text("."));
	return out;
}

export function remarkPropTable() {
	return async (tree: Root) => {
		const targets: { index: number; parent: Root; of: string }[] = [];
		visit(tree, (node, index, parent) => {
			if (
				node.type !== "mdxJsxFlowElement" ||
				index === undefined ||
				parent?.type !== "root"
			) {
				return;
			}
			// biome-ignore lint/suspicious/noExplicitAny: mdast's types do not know about mdxJsxFlowElement nodes.
			const jsx = node as any;
			if (jsx.name !== "PropTable") return;
			const attribute = jsx.attributes?.find(
				(a: { name?: string }) => a?.name === "of",
			);
			const of = typeof attribute?.value === "string" ? attribute.value : "";
			if (of) targets.push({ index, parent, of });
		});
		if (!targets.length) return;

		const manifest = await loadPropsManifest();
		// Back to front, so the earlier indices stay valid as nodes are replaced.
		for (const target of targets.reverse()) {
			const entry = manifest[target.of];
			if (!entry) {
				target.parent.children.splice(target.index, 1);
				continue;
			}
			const replacement: Root["children"] = [];
			if (entry.members.length) replacement.push(buildTable(entry));
			replacement.push({
				type: "paragraph",
				children: buildFooter(entry),
			});
			target.parent.children.splice(target.index, 1, ...replacement);
		}
	};
}
