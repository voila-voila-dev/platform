import {
	type Descendant,
	ElementApi,
	NodeApi,
	type NodeEntry,
	TextApi,
} from "platejs";
import { createPlatePlugin, type PlateEditor } from "platejs/react";
import type { ContentFeature } from "#/content-editor/features/feature-definition.tsx";
import { paragraphNode } from "#/content-editor/features/paragraph/reader.tsx";

interface KnownNodes {
	readonly elements: ReadonlySet<string>;
	readonly marks: ReadonlySet<string>;
}

const known = new WeakMap<PlateEditor, KnownNodes>();

/** A pasted table cell, in an editor without tables: a block of its own. */
const LOOSE_CELL = "strict-loose-cell";

/** What this editor's plugins declare, read once: the plugins never change. */
function knownNodes(editor: PlateEditor): KnownNodes {
	const cached = known.get(editor);
	if (cached !== undefined) {
		return cached;
	}
	const plugins = Object.values(editor.plugins);
	const entry = {
		elements: new Set(
			plugins
				.filter(
					(plugin) =>
						plugin.node.isElement === true && plugin.node.type !== LOOSE_CELL,
				)
				.map((plugin) => plugin.node.type),
		),
		marks: new Set(
			plugins
				.filter((plugin) => plugin.node.isLeaf === true)
				.map((plugin) => plugin.node.type),
		),
	};
	known.set(editor, entry);
	return entry;
}

const holdsKnownElement = (
	node: Descendant,
	elements: ReadonlySet<string>,
): boolean =>
	ElementApi.isElement(node) &&
	node.children.some(
		(child) =>
			ElementApi.isElement(child) &&
			(elements.has(child.type) || holdsKnownElement(child, elements)),
	);

/**
 * One fix per call, as Slate expects, until nothing is left to fix.
 *
 * - A mark no plugin declares is dropped from the text.
 * - An element no plugin declares gives way to what it holds:
 *   - inside a line of text (a mention, a span), it is unwrapped into the line;
 *   - holding blocks (a table, its rows, a `<section>`), it is unwrapped and
 *     each block is judged in turn, so a pasted table ends as its cells' lines;
 *   - holding text, it becomes a paragraph with the same text;
 *   - holding nothing (an embed), it is removed.
 */
function normalizeStrictly(
	editor: PlateEditor,
	[node, path]: NodeEntry,
): boolean {
	const { elements, marks } = knownNodes(editor);
	if (TextApi.isText(node)) {
		const unknownMarks = Object.keys(node).filter(
			(key) => key !== "text" && !marks.has(key),
		);
		if (unknownMarks.length === 0) {
			return false;
		}
		editor.tf.unsetNodes(unknownMarks, { at: path });
		return true;
	}
	if (!ElementApi.isElement(node) || elements.has(node.type)) {
		return false;
	}
	const parent = NodeApi.parent(editor, path);
	const inLine =
		ElementApi.isElement(parent) &&
		parent.children.some((child) => TextApi.isText(child));
	if (inLine) {
		editor.tf.unwrapNodes({ at: path });
		return true;
	}
	const empty =
		NodeApi.string(node) === "" && !holdsKnownElement(node, elements);
	if (empty && editor.children.length > 1) {
		editor.tf.removeNodes({ at: path });
		return true;
	}
	const holdsBlocks = node.children.some(
		(child) => ElementApi.isElement(child) && !editor.api.isInline(child),
	);
	if (holdsBlocks) {
		editor.tf.unwrapNodes({ at: path });
		return true;
	}
	const attributes = Object.keys(node).filter(
		(key) => key !== "children" && key !== "type" && key !== "id",
	);
	editor.tf.withoutNormalizing(() => {
		editor.tf.unsetNodes(attributes, { at: path });
		editor.tf.setNodes({ type: paragraphNode.type } as never, { at: path });
	});
	return true;
}

const StrictNodesPlugin = createPlatePlugin({
	key: "strict-nodes",
}).overrideEditor(({ editor, tf: { normalizeNode } }) => ({
	transforms: {
		normalizeNode: (entry, options) => {
			if (normalizeStrictly(editor, entry)) {
				return;
			}
			normalizeNode(entry, options);
		},
	},
}));

/**
 * Without a table plugin, Plate's HTML paste flattens a table into one line,
 * its cells run together ("DayCoachMondayAnna"). Each cell comes in as a
 * block instead, which the normalizer then turns into a line of its own.
 */
const LooseCellPlugin = createPlatePlugin({
	key: LOOSE_CELL,
	node: { isElement: true },
	parsers: {
		html: {
			deserializer: {
				rules: [{ validNodeName: ["TD", "TH"] }],
				query: ({ editor }) => editor.plugins.td === undefined,
			},
		},
	},
});

/**
 * Keeps a document to the node set its features declare, whatever arrives:
 * a paste from Word or from another editor, a value set by the host. A
 * table pasted into a mail without `emailTableFeature` becomes its cells'
 * text, a heading becomes a paragraph, a strikethrough is dropped when the
 * preset has no strikethrough. The email presets include it, so a strict
 * email schema downstream never meets a node it does not know.
 */
export const strictNodesFeature: ContentFeature = {
	key: "strict-nodes",
	plugins: () => [LooseCellPlugin, StrictNodesPlugin],
	allowIn: () => true,
};
