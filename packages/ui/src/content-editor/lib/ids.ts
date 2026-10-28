import {
	type ContentDescendant,
	type ContentValue,
	isContentText,
} from "#/content-editor/features/content-value.ts";

/**
 * Every element carries an id: React keys on the canvas and anchor ids in
 * the rendered HTML. `crypto.randomUUID` is everywhere the editor runs; the
 * fallback exists for a test runtime without it.
 */
export function newContentNodeId(): string {
	return typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `node-${Math.random().toString(36).slice(2)}`;
}

/**
 * The document with every repeated element id replaced by a fresh one, the
 * first element to carry it keeping it. A document saved before splits and
 * pastes got fresh ids can hold the same id twice, and the inspector finds
 * an element again by its id. Unchanged branches keep their reference, and
 * so does the value when nothing repeats.
 */
export function withUniqueNodeIds<Value extends ContentValue>(
	value: Value,
	createId: () => string = newContentNodeId,
): Value {
	const seen = new Set<unknown>();
	const visit = (node: ContentDescendant): ContentDescendant => {
		if (isContentText(node)) {
			return node;
		}
		const repeated = node.id !== undefined && seen.has(node.id);
		seen.add(node.id);
		const children = visitAll(node.children);
		return repeated || children !== node.children
			? {
					...node,
					...(repeated ? { id: createId() } : {}),
					children,
				}
			: node;
	};
	const visitAll = <Nodes extends ReadonlyArray<ContentDescendant>>(
		nodes: Nodes,
	): Nodes => {
		const next = nodes.map(visit);
		return next.every((node, index) => node === nodes[index])
			? nodes
			: (next as unknown as Nodes);
	};
	return visitAll(value) as Value;
}
