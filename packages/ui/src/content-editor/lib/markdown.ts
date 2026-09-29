import {
	convertChildrenDeserialize,
	convertNodesSerialize,
	deserializeMd,
	MarkdownPlugin,
	type MdRules,
	remarkMdx,
	serializeMd,
} from "@platejs/markdown";
import { createPlateEditor } from "platejs/react";
import remarkGfm from "remark-gfm";
import {
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import type { ContentMarkdownContext } from "#/content-editor/features/reader-definition.tsx";
import {
	type ContentRegistry,
	toContentRegistry,
} from "#/content-editor/features/registry.ts";

export interface ContentMarkdownOptions {
	readonly features: ReadonlyArray<ContentFeature> | ContentRegistry;
}

/**
 * The rules the registry's readers declare, keyed the way Plate looks them
 * up: a serializer under the node's type, a deserializer under the key
 * Plate maps the mdast kind to (`img` for an image), MDX elements under
 * their tag name.
 */
function rulesOf(registry: ContentRegistry): MdRules {
	const rules: MdRules = {};
	for (const type of registry.reader.nodeTypes) {
		const reader = registry.reader.nodeFor(type);
		const rule = reader?.markdown;
		if (reader === undefined || rule === undefined) {
			continue;
		}
		if (rule.serialize !== undefined) {
			const serialize = rule.serialize;
			rules[type] = {
				...rules[type],
				serialize: (node, options) =>
					serialize(node, {
						serializeChildren: (child) =>
							convertNodesSerialize(child.children as never, options),
						deserializeChildren: () => [],
					}) as never,
			};
		}
		if (rule.deserialize !== undefined) {
			const deserialize = rule.deserialize;
			const key = rule.deserializeKey ?? type;
			rules[key] = {
				...rules[key],
				deserialize: (mdast, deco, options) =>
					deserialize(mdast as never, {
						serializeChildren: () => [],
						deserializeChildren: (parent) =>
							convertChildrenDeserialize(
								(parent as { children?: never[] }).children ?? [],
								deco,
								options,
							) as never,
					} satisfies ContentMarkdownContext) as never,
			};
		}
	}
	return rules;
}

interface MdastNode {
	readonly type: string;
	value?: string;
	readonly children?: ReadonlyArray<MdastNode>;
}

/**
 * CommonMark reads a newline inside a paragraph as a soft break: the text
 * flows on, as a space. Plate keeps it as a newline, which the reader writes
 * as `<br>`. A hard break (two trailing spaces, a backslash, `<br>`) is a
 * `break` node, never a text newline, so it is left alone.
 */
function remarkSoftBreaksAsSpaces() {
	const visit = (node: MdastNode) => {
		if (node.type === "text" && node.value !== undefined) {
			node.value = node.value.replace(/[ \t]*\r?\n[ \t]*/g, " ");
		}
		node.children?.forEach(visit);
	};
	return visit;
}

const REMARK_PLUGINS = [remarkGfm, remarkMdx];

function markdownEditor(features: ContentMarkdownOptions["features"]) {
	const registry = toContentRegistry(features, "block");
	return createPlateEditor({
		plugins: [
			...registry.plugins,
			MarkdownPlugin.configure({
				options: {
					remarkPlugins: REMARK_PLUGINS,
					rules: rulesOf(registry),
				},
			}),
		],
	});
}

/** GFM, with the nodes Markdown has no words for written as MDX elements. */
export function contentToMarkdown(
	value: ContentValue | null,
	options: ContentMarkdownOptions,
): string {
	if (value === null || value.length === 0) {
		return "";
	}
	return serializeMd(markdownEditor(options.features), {
		value: value as never,
	});
}

/**
 * An mdast image is inline, so it comes back inside a paragraph; a void
 * block of ours standing alone in one is lifted out, as it was written.
 */
function liftVoidBlocks(
	value: ContentValue,
	registry: ContentRegistry,
): ContentValue {
	return value.map((node) => {
		const only = node.children.length === 1 ? node.children[0] : undefined;
		if (
			node.type === "p" &&
			only !== undefined &&
			!isContentText(only) &&
			registry.reader.nodeFor(only.type)?.kind === "void"
		) {
			return only;
		}
		return node;
	});
}

export function contentFromMarkdown(
	markdown: string,
	options: ContentMarkdownOptions,
): ContentValue {
	const registry = toContentRegistry(options.features, "block");
	const value = deserializeMd(markdownEditor(registry), markdown, {
		remarkPlugins: [...REMARK_PLUGINS, remarkSoftBreaksAsSpaces],
	}) as ContentValue;
	return liftVoidBlocks(value, registry);
}
