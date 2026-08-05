import type { EmailEditorRegistry } from "#/email-block-editor/blocks/registry.ts";
import type {
	EmailEditorBlockLike,
	EmailEditorDocument,
} from "#/email-block-editor/document/types.ts";

/** The editor's full state: the document plus which block is selected. */
export interface EmailEditorState<
	Block extends EmailEditorBlockLike = EmailEditorBlockLike,
> {
	readonly document: EmailEditorDocument<Block>;
	readonly selectedBlockId: string | null;
}

/**
 * Which container an action addresses: `null` is the document root, a string
 * is a container block's id. What may go in a container is the container's own
 * business (`definition.container.accepts`), enforced here at runtime for the
 * drag-and-drop layer, which cannot be typed.
 */
export type EmailEditorContainerId = string | null;

export type EmailEditorAction<
	Block extends EmailEditorBlockLike = EmailEditorBlockLike,
> =
	| {
			readonly type: "add";
			readonly blockType: string;
			readonly containerId?: EmailEditorContainerId;
			/** Insertion position within the container; appends when omitted. */
			readonly index?: number;
	  }
	| { readonly type: "update"; readonly block: Block }
	| { readonly type: "remove"; readonly blockId: string }
	| {
			readonly type: "move";
			readonly blockId: string;
			readonly toContainerId: EmailEditorContainerId;
			readonly toIndex: number;
	  }
	| { readonly type: "duplicate"; readonly blockId: string }
	| { readonly type: "select"; readonly blockId: string | null }
	| {
			readonly type: "replace";
			readonly document: EmailEditorDocument<Block>;
	  };

/** Insert at `index`, clamped into the list — an out-of-range drop appends or
 * prepends rather than losing the block. */
const insertAt = <Block>(
	blocks: ReadonlyArray<Block>,
	index: number,
	block: Block,
): ReadonlyArray<Block> => {
	const position = Math.max(0, Math.min(index, blocks.length));
	return [...blocks.slice(0, position), block, ...blocks.slice(position)];
};

/**
 * The reducer's whole view of "this block holds other blocks". Everything
 * below is written against these three helpers, so a second container type
 * needs no change here.
 */
const containerOf = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	block: Block,
) => registry.definitionFor(block.type)?.container;

const childrenOf = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	block: Block,
): ReadonlyArray<Block> | undefined =>
	// A container's children are blocks of the same document, which
	// `EmailBlockContainer` has no way to say: it knows the type of the block it
	// belongs to, not the union that block lives in.
	containerOf(registry, block)?.children(block) as
		| ReadonlyArray<Block>
		| undefined;

const withChildren = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	block: Block,
	children: ReadonlyArray<Block>,
): Block =>
	containerOf(registry, block)?.withChildren(block, children) ?? block;

/** Every block in the document, containers and their children alike. */
export const allEmailEditorBlocks = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<Block>,
): ReadonlyArray<Block> =>
	blocks.flatMap((block) => {
		const children = childrenOf(registry, block);
		return children === undefined ? [block] : [block, ...children];
	});

/**
 * The container a block lives in: `null` for the root, a container's id for a
 * nested block, `undefined` when the id is unknown to the document.
 */
export const emailEditorContainerOf = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<Block>,
	blockId: string,
): EmailEditorContainerId | undefined => {
	if (blocks.some((block) => block.id === blockId)) {
		return null;
	}
	const parent = blocks.find((block) =>
		childrenOf(registry, block)?.some((child) => child.id === blockId),
	);
	return parent?.id;
};

const containerById = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<Block>,
	containerId: string,
): Block | undefined =>
	blocks.find(
		(block) =>
			block.id === containerId && childrenOf(registry, block) !== undefined,
	);

/** The blocks of one container, or `undefined` when it does not exist. */
export const emailEditorContainerBlocks = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<Block>,
	containerId: EmailEditorContainerId,
): ReadonlyArray<Block> | undefined => {
	if (containerId === null) {
		return blocks;
	}
	const container = containerById(registry, blocks, containerId);
	return container === undefined ? undefined : childrenOf(registry, container);
};

/** Replace one container's children, leaving every other block untouched. */
const replaceChildren = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<Block>,
	containerId: string,
	children: ReadonlyArray<Block>,
): ReadonlyArray<Block> =>
	blocks.map((block) =>
		block.id === containerId ? withChildren(registry, block, children) : block,
	);

/** The same block with `blockId` gone from its children, if it has any. */
const withoutChild = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	block: Block,
	blockId: string,
): Block => {
	const children = childrenOf(registry, block);
	return children === undefined
		? block
		: withChildren(
				registry,
				block,
				children.filter((child) => child.id !== blockId),
			);
};

const withBlocks = <Block extends EmailEditorBlockLike>(
	state: EmailEditorState<Block>,
	blocks: ReadonlyArray<Block>,
): EmailEditorState<Block> => ({
	...state,
	document: { ...state.document, blocks },
});

const addBlock = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	state: EmailEditorState<Block>,
	action: Extract<EmailEditorAction<Block>, { type: "add" }>,
	blockId: string,
): EmailEditorState<Block> => {
	const blocks = state.document.blocks;
	const containerId = action.containerId ?? null;
	const definition = registry.definitionFor(action.blockType);
	if (definition === undefined) {
		return state;
	}
	const block: Block = definition.createEmpty(blockId);
	if (containerId === null) {
		return {
			...withBlocks(
				state,
				insertAt(blocks, action.index ?? blocks.length, block),
			),
			selectedBlockId: block.id,
		};
	}
	const container = containerById(registry, blocks, containerId);
	if (
		container === undefined ||
		!registry.accepts(container.type, action.blockType)
	) {
		return state;
	}
	const children = childrenOf(registry, container) ?? [];
	return {
		...withBlocks(
			state,
			replaceChildren(
				registry,
				blocks,
				container.id,
				insertAt(children, action.index ?? children.length, block),
			),
		),
		selectedBlockId: block.id,
	};
};

const updateBlock = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	state: EmailEditorState<Block>,
	updated: Block,
): EmailEditorState<Block> =>
	withBlocks(
		state,
		state.document.blocks.map((block) => {
			if (block.id === updated.id) {
				return updated;
			}
			const children = childrenOf(registry, block);
			if (children === undefined) {
				return block;
			}
			return withChildren(
				registry,
				block,
				children.map((child) => (child.id === updated.id ? updated : child)),
			);
		}),
	);

const removeBlock = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	state: EmailEditorState<Block>,
	blockId: string,
): EmailEditorState<Block> => {
	// Removing a container takes its children with it — that is what deleting a
	// row means, and the toolbar sits on the container, not on the document.
	const blocks = state.document.blocks
		.filter((block) => block.id !== blockId)
		.map((block) => withoutChild(registry, block, blockId));
	return {
		...withBlocks(state, blocks),
		selectedBlockId:
			state.selectedBlockId === blockId ? null : state.selectedBlockId,
	};
};

/** Pull a block out of whatever container holds it. */
const detach = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	blocks: ReadonlyArray<Block>,
	blockId: string,
): {
	readonly blocks: ReadonlyArray<Block>;
	readonly block: Block | undefined;
} => {
	const block = allEmailEditorBlocks(registry, blocks).find(
		(candidate) => candidate.id === blockId,
	);
	if (block === undefined) {
		return { blocks, block: undefined };
	}
	return {
		blocks: blocks
			.filter((candidate) => candidate.id !== blockId)
			.map((candidate) => withoutChild(registry, candidate, blockId)),
		block,
	};
};

const moveBlock = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	state: EmailEditorState<Block>,
	action: Extract<EmailEditorAction<Block>, { type: "move" }>,
): EmailEditorState<Block> => {
	const { blocks, block: moved } = detach(
		registry,
		state.document.blocks,
		action.blockId,
	);
	if (moved === undefined) {
		return state;
	}
	if (action.toContainerId === null) {
		return withBlocks(state, insertAt(blocks, action.toIndex, moved));
	}
	const container = containerById(registry, blocks, action.toContainerId);
	// A drop the container refuses is a no-op rather than a silently flattened
	// document.
	if (
		container === undefined ||
		!registry.accepts(container.type, moved.type)
	) {
		return state;
	}
	const children = childrenOf(registry, container) ?? [];
	return withBlocks(
		state,
		replaceChildren(
			registry,
			blocks,
			container.id,
			insertAt(children, action.toIndex, moved),
		),
	);
};

/** A copy under fresh ids, deep for a container so its children stay unique. */
const copyBlock = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	block: Block,
	generateBlockId: () => string,
): Block => {
	const copy: Block = { ...block, id: generateBlockId() };
	const children = childrenOf(registry, copy);
	return children === undefined
		? copy
		: withChildren(
				registry,
				copy,
				children.map((child) => ({ ...child, id: generateBlockId() })),
			);
};

const duplicateBlock = <Block extends EmailEditorBlockLike>(
	registry: EmailEditorRegistry,
	state: EmailEditorState<Block>,
	blockId: string,
	generateBlockId: () => string,
): EmailEditorState<Block> => {
	const blocks = state.document.blocks;
	const containerId = emailEditorContainerOf(registry, blocks, blockId);
	if (containerId === null) {
		const original = blocks.find((block) => block.id === blockId);
		if (original === undefined) {
			return state;
		}
		const copy = copyBlock(registry, original, generateBlockId);
		return {
			...withBlocks(
				state,
				insertAt(blocks, blocks.indexOf(original) + 1, copy),
			),
			selectedBlockId: copy.id,
		};
	}
	const container =
		containerId === undefined
			? undefined
			: containerById(registry, blocks, containerId);
	const children =
		container === undefined ? undefined : childrenOf(registry, container);
	const original = children?.find((child) => child.id === blockId);
	if (
		container === undefined ||
		children === undefined ||
		original === undefined
	) {
		return state;
	}
	const copy: Block = { ...original, id: generateBlockId() };
	return {
		...withBlocks(
			state,
			replaceChildren(
				registry,
				blocks,
				container.id,
				insertAt(children, children.indexOf(original) + 1, copy),
			),
		),
		selectedBlockId: copy.id,
	};
};

/**
 * Pure reducer over the editor state. The registry answers every question
 * about nesting and the block-id factory is injected, so the reducer knows
 * nothing about which blocks an instance registered and tests stay
 * deterministic.
 */
export const createEmailEditorReducer =
	<Block extends EmailEditorBlockLike = EmailEditorBlockLike>(
		registry: EmailEditorRegistry,
		generateBlockId: () => string,
	) =>
	(
		state: EmailEditorState<Block>,
		action: EmailEditorAction<Block>,
	): EmailEditorState<Block> => {
		switch (action.type) {
			case "add":
				return addBlock(registry, state, action, generateBlockId());
			case "update":
				return updateBlock(registry, state, action.block);
			case "remove":
				return removeBlock(registry, state, action.blockId);
			case "move":
				return moveBlock(registry, state, action);
			case "duplicate":
				return duplicateBlock(registry, state, action.blockId, generateBlockId);
			case "select":
				return { ...state, selectedBlockId: action.blockId };
			case "replace":
				return { document: action.document, selectedBlockId: null };
		}
	};
