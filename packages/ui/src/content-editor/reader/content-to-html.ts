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
 * Siblings joined with a space where two elements touch, or where an element
 * is followed by text that starts with a letter or digit: browsers collapse
 * a doubled space, so this never widens a gap that already exists.
 */
function childrenToHtml(
	registry: ContentReaderRegistry,
	children: ReadonlyArray<ContentDescendant>,
	options: ContentHtmlOptions,
): string {
	let html = "";
	children.forEach((child, index) => {
		html += descendantToHtml(registry, child, options);
		const next = children[index + 1];
		if (next === undefined || isContentText(child)) {
			return;
		}
		if (!isContentText(next) || /^[\p{L}\p{N}]/u.test(next.text)) {
			html += " ";
		}
	});
	return html;
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
	return reader.toHtml(
		node,
		childrenToHtml(registry, node.children, options),
		options,
	);
}

function runOf(
	reader: AnyContentNodeReader | undefined,
	node: ContentNodeLike,
): string | null {
	return reader?.wrapRun?.of(node) ?? null;
}

/** Top-level blocks, with runs (list items) wrapped once. */
function blocksToHtml(
	registry: ContentReaderRegistry,
	value: ContentValue,
	options: ContentHtmlOptions,
): string {
	let html = "";
	let index = 0;
	while (index < value.length) {
		const node = value[index] as ContentNodeLike;
		const reader = registry.nodeFor(node.type);
		const run = runOf(reader, node);
		if (run === null || reader?.wrapRun === undefined) {
			html += descendantToHtml(registry, node, options);
			index += 1;
			continue;
		}
		let inner = "";
		const first = node;
		while (index < value.length) {
			const candidate = value[index] as ContentNodeLike;
			if (candidate.type !== node.type || runOf(reader, candidate) !== run) {
				break;
			}
			inner += descendantToHtml(registry, candidate, options);
			index += 1;
		}
		html += reader.wrapRun.toHtml(run, inner, first);
	}
	return html;
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
				? childrenToHtml(registry, node.children, options)
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
