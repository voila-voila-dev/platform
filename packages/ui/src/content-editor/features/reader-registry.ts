import type {
	AnyContentNodeReader,
	ContentFeatureReader,
	ContentLeafDecorator,
} from "#/content-editor/features/reader-definition.tsx";

export interface ContentReaderRegistry {
	readonly features: ReadonlyArray<ContentFeatureReader>;
	/** `undefined` for a stored node whose feature this registry no longer
	 * has: the real path of a document that outlives a feature someone removed. */
	readonly nodeFor: (type: string) => AnyContentNodeReader | undefined;
	readonly nodeTypes: ReadonlyArray<string>;
	/** Every text mark, in declaration order, which is also the nesting order. */
	readonly leaves: ReadonlyArray<ContentLeafDecorator>;
	readonly indentableTypes: ReadonlyArray<string>;
}

/**
 * The one place a feature list becomes a reader registry. Throws on a
 * duplicate feature key or node type rather than letting the later one
 * silently win: two features claiming `image` means one renders nodes it
 * did not create, and a startup error is cheaper to read than that.
 */
export function createContentReaderRegistry(
	features: ReadonlyArray<ContentFeatureReader>,
): ContentReaderRegistry {
	const keys = new Set<string>();
	const nodes = new Map<string, AnyContentNodeReader>();
	const leaves: ContentLeafDecorator[] = [];
	for (const feature of features) {
		if (keys.has(feature.key)) {
			throw new Error(`Content feature "${feature.key}" is declared twice.`);
		}
		keys.add(feature.key);
		for (const node of feature.nodes ?? []) {
			if (nodes.has(node.type)) {
				throw new Error(
					`Content node type "${node.type}" is declared by two features.`,
				);
			}
			nodes.set(node.type, node);
		}
		for (const leaf of feature.leaves ?? []) {
			if (leaves.some((existing) => existing.key === leaf.key)) {
				throw new Error(`Content mark "${leaf.key}" is declared twice.`);
			}
			leaves.push(leaf);
		}
	}
	return {
		features,
		nodeFor: (type) => nodes.get(type),
		nodeTypes: [...nodes.keys()],
		leaves,
		indentableTypes: [...nodes.values()]
			.filter((node) => node.indentable === true)
			.map((node) => node.type),
	};
}
