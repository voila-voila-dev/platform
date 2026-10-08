import type { SceneNode } from "#/core/types.ts";

/**
 * Guides that left the scene still fade out where they stood: a tick label
 * or a grid line vanishing at once reads as a glitch. Data marks never
 * linger — a bar the data no longer has would show a value that isn't true.
 */
const GUIDE_ROLES = new Set(["grid", "axis"]);

export interface LeavingGuide {
	readonly node: SceneNode;
	/** The group it sat in, or null at the root. */
	readonly parent: string | null;
	readonly index: number;
}

/** The guides of `nodes` whose keys `stays` no longer has. */
export function leavingGuides(
	nodes: readonly SceneNode[],
	stays: (key: string) => boolean,
	parent: string | null = null,
	into: LeavingGuide[] = [],
): LeavingGuide[] {
	for (const [index, node] of nodes.entries()) {
		if (node.kind === "group") {
			leavingGuides(node.children, stays, node.key, into);
			continue;
		}
		if (!stays(node.key) && GUIDE_ROLES.has(node.role ?? "")) {
			into.push({ node, parent, index });
		}
	}
	return into;
}

/** `children` with the leaving guides of `parent` back at their places, as `paint` draws them. */
export function withLeaving(
	children: readonly SceneNode[],
	parent: string | null,
	leaving: Iterable<LeavingGuide>,
	paint: (node: SceneNode) => SceneNode,
): SceneNode[] {
	const placed = [...children];
	for (const guide of leaving) {
		if (guide.parent !== parent) continue;
		placed.splice(Math.min(guide.index, placed.length), 0, paint(guide.node));
	}
	return placed;
}
