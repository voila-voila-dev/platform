import type { Icon } from "@phosphor-icons/react";
import {
	type AnyPlatePlugin,
	createPlatePlugin,
	type PlateElementProps,
} from "platejs/react";
import { type ComponentType, createElement, type ReactNode } from "react";
import { ElementFrame } from "#/content-editor/components/element-frame.tsx";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type {
	ContentCapability,
	ContentEditorApi,
	ContentFeature,
	ContentPluginContext,
	ContentSlashItem,
} from "#/content-editor/features/feature-definition.tsx";
import type {
	ContentElementDefaults,
	ContentFieldOf,
} from "#/content-editor/features/field-definition.ts";
import type {
	ContentInsertableNodeReader,
	ContentNodeReader,
} from "#/content-editor/features/reader-definition.tsx";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import { insertBlockBelow } from "#/content-editor/lib/insert-block.ts";

/**
 * - `text`: the author types its text in place; its fields are settings.
 * - `void`: nothing is typed in place; every field is in the inspector and
 *   the canvas shows a live preview.
 * - `container`: its children are other nodes.
 */
export type ContentElementKind = "text" | "void" | "container";

export interface ContentElementViewProps<Node extends ContentNodeLike> {
	/** The node with its defaults filled in, so a document stored before a
	 * field existed still renders. */
	readonly node: Node;
	/** The editable content of a text element or a container; absent on a void. */
	readonly children?: ReactNode;
}

export interface ContentElementFeatureDefinition<Node extends ContentNodeLike> {
	/** Unique across a registry; also the element's name under `labels.items`. */
	readonly key: string;
	readonly kind: ContentElementKind;
	/** The reader half: how the node renders outside the editor and to HTML.
	 * Its `kind: "inline"` makes the element flow inside text. */
	readonly node: ContentNodeReader<Node>;
	/** What the inspector edits, in the order it shows them. */
	readonly fields: ReadonlyArray<ContentFieldOf<Node>>;
	/** Every attribute a fresh node starts with. */
	readonly defaults: ContentElementDefaults<Node>;
	/** The canvas. Never the reader's `Render`: the canvas may show what a
	 * reader must not, such as an empty image's placeholder. */
	readonly view: ComponentType<ContentElementViewProps<Node>>;
	/** Offers the element in the slash menu and the toolbar's insert menu. */
	readonly insert?: {
		readonly icon: Icon;
		readonly keywords: ReadonlyArray<string>;
	};
	/** Plate plugins, when the element needs more than being declared (an input rule). */
	readonly plugins?: (
		context: ContentPluginContext,
	) => ReadonlyArray<AnyPlatePlugin>;
	readonly requires?: ReadonlyArray<ContentCapability>;
	readonly files?: ContentFeature["files"];
}

/**
 * One declaration, the whole element: the plugin, the canvas element, the
 * default node, the slash and insert entries and the inspector's fields.
 * The returned feature is a plain `ContentFeature`; nothing downstream
 * knows it was defined this way.
 */
export function defineElementFeature<Node extends ContentNodeLike>(
	definition: ContentElementFeatureDefinition<Node>,
): ContentFeature & {
	readonly nodes: readonly [ContentInsertableNodeReader<Node>];
} {
	const { key, kind, node, fields, defaults, view, insert } = definition;
	const inline = node.kind === "inline";

	const createNode = (init?: Partial<Node>): Node =>
		({
			id: newContentNodeId(),
			type: node.type,
			children: [{ text: "" }],
			...defaults,
			...init,
		}) as unknown as Node;

	const withDefaults = (element: unknown): Node =>
		({ ...defaults, ...(element as Node) }) as Node;

	const Element = (props: PlateElementProps) =>
		createElement(ElementFrame<Node>, {
			plate: props,
			kind,
			inline,
			node: withDefaults(props.element),
			view,
		});

	const run = (editor: ContentEditorApi) => {
		const fresh = createNode();
		if (inline) {
			editor.tf.insertNodes(fresh as never, { select: true });
			return;
		}
		insertBlockBelow(editor, fresh);
		// A void is filled in from the inspector, so it is what the author
		// wants selected next, not the paragraph under it.
		const inserted =
			kind === "void" && fields.length > 0
				? editor.api.node({ at: [], id: fresh.id as string })
				: undefined;
		if (inserted !== undefined) {
			editor.tf.select(inserted[1]);
		}
	};
	const slashItem: ContentSlashItem | undefined =
		insert === undefined
			? undefined
			: { key, icon: insert.icon, label: key, keywords: insert.keywords, run };

	return {
		key,
		nodes: [{ ...node, createNode }],
		plugins:
			definition.plugins ??
			(() => [
				createPlatePlugin({
					key: node.type,
					node: { isElement: true, isVoid: kind === "void", isInline: inline },
				}),
			]),
		components: { [node.type]: Element },
		fields: { [node.type]: fields },
		slash: slashItem === undefined ? undefined : [slashItem],
		toolbar:
			slashItem === undefined ? undefined : [{ ...slashItem, group: "insert" }],
		requires: definition.requires,
		files: definition.files,
	};
}
