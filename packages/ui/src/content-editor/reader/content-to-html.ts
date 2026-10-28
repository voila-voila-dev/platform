import {
	type ContentDescendant,
	type ContentNodeLike,
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";
import type {
	AnyContentNodeReader,
	ContentFeatureReader,
	ContentHtmlOptions,
} from "#/content-editor/features/reader-definition.tsx";
import {
	type ContentReaderRegistry,
	createContentReaderRegistry,
} from "#/content-editor/features/reader-registry.ts";
import { escapeHtml } from "#/content-editor/reader/escape-html.ts";

export interface ContentToHtmlOptions extends ContentHtmlOptions {
	readonly features:
		| ReadonlyArray<ContentFeatureReader>
		| ContentReaderRegistry;
}

export function toReaderRegistry(
	features: ReadonlyArray<ContentFeatureReader> | ContentReaderRegistry,
): ContentReaderRegistry {
	return Array.isArray(features)
		? createContentReaderRegistry(features)
		: (features as ContentReaderRegistry);
}

function leafToHtml(
	registry: ContentReaderRegistry,
	leaf: { readonly text: string; readonly [mark: string]: unknown },
): string {
	let html = escapeHtml(leaf.text).replace(/\n/g, "<br>");
	for (const decorator of [...registry.leaves].reverse()) {
		if (leaf[decorator.key] === true) {
			html = decorator.toHtml(html);
		}
	}
	return html;
}

/**
 * Siblings in document order, a run of consecutive list items gathered into
 * one entry so it gets one wrapper, wherever the run sits: at the top level,
 * in a quote, in a table cell.
 */
export type ContentSiblingGroup =
	| { readonly kind: "single"; readonly node: ContentDescendant }
	| {
			readonly kind: "run";
			readonly runKey: string;
			readonly reader: AnyContentNodeReader & {
				readonly wrapRun: NonNullable<AnyContentNodeReader["wrapRun"]>;
			};
			readonly nodes: ReadonlyArray<ContentNodeLike>;
	  };

export function groupSiblings(
	registry: ContentReaderRegistry,
	siblings: ReadonlyArray<ContentDescendant>,
): ReadonlyArray<ContentSiblingGroup> {
	const groups: ContentSiblingGroup[] = [];
	let index = 0;
	while (index < siblings.length) {
		const node = siblings[index] as ContentDescendant;
		const reader = isContentText(node)
			? undefined
			: registry.nodeFor(node.type);
		const runKey =
			isContentText(node) || reader?.wrapRun === undefined
				? null
				: reader.wrapRun.of(node);
		if (
			runKey === null ||
			reader?.wrapRun === undefined ||
			isContentText(node)
		) {
			groups.push({ kind: "single", node });
			index += 1;
			continue;
		}
		const nodes: ContentNodeLike[] = [];
		while (index < siblings.length) {
			const candidate = siblings[index] as ContentDescendant;
			if (
				isContentText(candidate) ||
				candidate.type !== node.type ||
				reader.wrapRun.of(candidate) !== runKey
			) {
				break;
			}
			nodes.push(candidate);
			index += 1;
		}
		groups.push({
			kind: "run",
			runKey,
			reader: reader as Extract<ContentSiblingGroup, { kind: "run" }>["reader"],
			nodes,
		});
	}
	return groups;
}

/**
 * The children a reader renders: a lone plain paragraph's own children when
 * the reader unwraps it, the node's children otherwise.
 */
export function renderedChildren(
	reader: AnyContentNodeReader,
	node: ContentNodeLike,
): ReadonlyArray<ContentDescendant> {
	const only = node.children.length === 1 ? node.children[0] : undefined;
	return reader.unwrapLoneParagraph === true &&
		only !== undefined &&
		!isContentText(only) &&
		only.type === "p" &&
		only.listStyleType === undefined &&
		only.indent === undefined
		? only.children
		: node.children;
}

function groupToHtml(
	registry: ContentReaderRegistry,
	group: ContentSiblingGroup,
	options: ContentHtmlOptions,
): string {
	if (group.kind === "single") {
		return descendantToHtml(registry, group.node, options);
	}
	const [first] = group.nodes;
	return group.reader.wrapRun.toHtml(
		group.runKey,
		group.nodes
			.map((node) => descendantToHtml(registry, node, options))
			.join(""),
		first,
	);
}

function lastNodeOf(group: ContentSiblingGroup): ContentDescendant {
	return group.kind === "single"
		? group.node
		: (group.nodes.at(-1) as ContentNodeLike);
}

function firstNodeOf(group: ContentSiblingGroup): ContentDescendant {
	return group.kind === "single"
		? group.node
		: (group.nodes[0] as ContentNodeLike);
}

/**
 * Siblings joined with a space where two elements touch, or where an element
 * is followed by text that starts with a letter or digit: browsers collapse
 * a doubled space, so this never widens a gap that already exists.
 */
function childrenToHtml(
	registry: ContentReaderRegistry,
	children: ReadonlyArray<ContentDescendant>,
	options: ContentHtmlOptions,
): { readonly html: string; readonly parts: ReadonlyArray<string> } {
	const groups = groupSiblings(registry, children);
	const parts = groups.map((group) => groupToHtml(registry, group, options));
	let html = "";
	groups.forEach((group, index) => {
		html += parts[index];
		const next = groups[index + 1];
		const last = lastNodeOf(group);
		if (next === undefined || isContentText(last)) {
			return;
		}
		const following = firstNodeOf(next);
		if (!isContentText(following) || /^[\p{L}\p{N}]/u.test(following.text)) {
			html += " ";
		}
	});
	return { html, parts };
}

function descendantToHtml(
	registry: ContentReaderRegistry,
	node: ContentDescendant,
	options: ContentHtmlOptions,
): string {
	if (isContentText(node)) {
		return leafToHtml(registry, node);
	}
	const reader = registry.nodeFor(node.type);
	if (reader === undefined) {
		return "";
	}
	const { html, parts } = childrenToHtml(
		registry,
		renderedChildren(reader, node),
		options,
	);
	return reader.toHtml(node, html, options, parts);
}

/** Top-level blocks, with runs (list items) wrapped once. */
function blocksToHtml(
	registry: ContentReaderRegistry,
	value: ContentValue,
	options: ContentHtmlOptions,
): string {
	return groupSiblings(registry, value)
		.map((group) => groupToHtml(registry, group, options))
		.join("");
}

export function contentToHtml(
	value: ContentValue | null,
	{ features, ...options }: ContentToHtmlOptions,
): string {
	if (value === null) {
		return "";
	}
	return blocksToHtml(toReaderRegistry(features), value, options);
}

/**
 * The same, with top-level paragraphs unwrapped and joined by `<br>`: for a
 * value rendered inside an element that already is a block, such as a list
 * item or a table cell of the host's own.
 */
export function contentToInlineHtml(
	value: ContentValue | null,
	{ features, ...options }: ContentToHtmlOptions,
): string {
	if (value === null) {
		return "";
	}
	const registry = toReaderRegistry(features);
	return value
		.map((node) =>
			node.type === "p"
				? childrenToHtml(registry, node.children, options).html
				: descendantToHtml(registry, node, options),
		)
		.join("<br>");
}

/** Every url the nodes of one type carry, for a build that preloads them. */
export function collectContentUrls(
	value: ContentValue | null,
	type = "image",
): ReadonlyArray<string> {
	const urls: string[] = [];
	const visit = (nodes: ReadonlyArray<ContentDescendant>) => {
		for (const node of nodes) {
			if (isContentText(node)) {
				continue;
			}
			if (
				node.type === type &&
				typeof node.url === "string" &&
				node.url !== ""
			) {
				urls.push(node.url);
			}
			visit(node.children);
		}
	};
	visit(value ?? []);
	return urls;
}
