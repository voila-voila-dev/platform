import type { SceneNode, SceneRect } from "#/core/types.ts";

/**
 * The shape a data mark grows from when an update adds it, and collapses to
 * when an update removes it. Always a node of the same kind, so the store
 * springs it like any other change. Undefined when the mark has no such
 * shape: it fades in, and is gone at once when it leaves. A bar has its
 * baseline; a path asks the motion its mark brought (a slice opens from its
 * neighbour, an area grows from its lower edge).
 */

function collapsedBar(node: SceneRect): SceneRect | undefined {
	const { baseline } = node;
	if (!baseline) return undefined;
	return baseline.axis === "y"
		? { ...node, y: baseline.at, height: 0 }
		: { ...node, x: baseline.at, width: 0 };
}

/** Where a node an update adds starts from. `siblings` is the list it sits in, `before` the old scene. */
export function enterFrom(
	node: SceneNode,
	siblings: readonly SceneNode[],
	before: ReadonlyMap<string, SceneNode>,
): SceneNode | undefined {
	if (node.enter !== "grow") return undefined;
	if (node.kind === "rect") return collapsedBar(node);
	return node.kind === "path"
		? node.motion?.enter?.(node, siblings, before)
		: undefined;
}

/** Where a node an update removes collapses to. `siblings` is the old list it sat in, `after` the new scene. */
export function exitTo(
	node: SceneNode,
	siblings: readonly SceneNode[],
	after: ReadonlyMap<string, SceneNode>,
): SceneNode | undefined {
	if (node.enter !== "grow") return undefined;
	if (node.kind === "rect") return collapsedBar(node);
	return node.kind === "path"
		? node.motion?.exit?.(node, siblings, after)
		: undefined;
}
