import type { Path } from "platejs";
import { useEditorRef, useEditorSelector } from "platejs/react";
import { useContentEditorConfig } from "#/content-editor/context/content-editor-context.tsx";
import type { ContentNodeLike } from "#/content-editor/features/content-value.ts";
import type { ContentField } from "#/content-editor/features/field-definition.ts";

export interface ContentInspectedElement {
	readonly node: ContentNodeLike;
	/** Stable while the author edits the same element: its id, or its path. */
	readonly identity: string;
	/** The key of the feature that owns the node, its name under `labels.items`. */
	readonly featureKey: string;
	readonly fields: ReadonlyArray<ContentField>;
	/** Writes one attribute on the node. */
	readonly set: (key: string, value: unknown) => void;
}

/**
 * The innermost element around the selection that has fields, or null. A
 * link inside a highlight is the link: the closest element is the one the
 * author just clicked. A host reads it to open the inspector's sheet only
 * when there is something to show.
 */
export function useInspectedElement(): ContentInspectedElement | null {
	const editor = useEditorRef();
	const { registry } = useContentEditorConfig();
	const entry = useEditorSelector(
		(current) => {
			if (current.selection === null) {
				return null;
			}
			const above = current.api.above({
				mode: "lowest",
				match: (node) =>
					registry.inspectorFor(String((node as ContentNodeLike).type)) !==
					undefined,
			});
			return above === undefined
				? null
				: { node: above[0] as unknown as ContentNodeLike, path: above[1] };
		},
		[registry],
		{
			equalityFn: (a, b) => a?.node === b?.node && samePath(a?.path, b?.path),
		},
	);
	if (entry === null) {
		return null;
	}
	const inspector = registry.inspectorFor(entry.node.type);
	if (inspector === undefined) {
		return null;
	}
	return {
		node: entry.node,
		identity:
			typeof entry.node.id === "string" ? entry.node.id : entry.path.join("."),
		featureKey: inspector.featureKey,
		fields: inspector.fields,
		set: (key, value) => {
			// Found again by id when it has one: an upload may land after the
			// element moved.
			const at =
				typeof entry.node.id === "string"
					? editor.api.node({ at: [], match: { id: entry.node.id } })?.[1]
					: entry.path;
			if (at !== undefined) {
				editor.tf.setNodes({ [key]: value } as never, { at });
			}
		},
	};
}

function samePath(a: Path | undefined, b: Path | undefined): boolean {
	return (
		a === b ||
		(a !== undefined &&
			b !== undefined &&
			a.length === b.length &&
			a.every((index, position) => index === b[position]))
	);
}
