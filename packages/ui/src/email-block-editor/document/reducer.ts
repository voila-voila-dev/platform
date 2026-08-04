import { emailBlockDefinitionForType } from "#/email-block-editor/blocks/block-definitions.tsx";
import {
	type EmailEditorBlock,
	type EmailEditorBlockType,
	type EmailEditorDocument,
	type EmailEditorGridBlock,
	type EmailEditorLeafBlock,
	isEmailEditorGridBlock,
} from "#/email-block-editor/document/types.ts";

/** The editor's full state: the document plus which block is selected. */
export interface EmailEditorState {
	readonly document: EmailEditorDocument;
	readonly selectedBlockId: string | null;
}

/**
 * Which container an action addresses: `null` is the document root, a string
 * is a grid's id. Only leaf blocks may address a grid — the document model
 * forbids a grid inside a grid, and the reducer enforces it at runtime for the
 * drag-and-drop layer, which cannot be typed.
 */
export type EmailEditorContainerId = string | null;

export type EmailEditorAction =
	| {
			readonly type: "add";
			readonly blockType: EmailEditorBlockType;
			readonly containerId?: EmailEditorContainerId;
			/** Insertion position within the container; appends when omitted. */
			readonly index?: number;
	  }
	| { readonly type: "update"; readonly block: EmailEditorBlock }
	| { readonly type: "remove"; readonly blockId: string }
	| {
			readonly type: "move";
			readonly blockId: string;
			readonly toContainerId: EmailEditorContainerId;
			readonly toIndex: number;
	  }
	| { readonly type: "duplicate"; readonly blockId: string }
	| { readonly type: "select"; readonly blockId: string | null }
	| { readonly type: "replace"; readonly document: EmailEditorDocument };

const withBlocks = (
	state: EmailEditorState,
	blocks: ReadonlyArray<EmailEditorBlock>,
): EmailEditorState => ({
	...state,
	document: { ...state.document, blocks },
});

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

/** Every block in the document, grids and their children alike. */
export const allEmailEditorBlocks = (
	blocks: ReadonlyArray<EmailEditorBlock>,
): ReadonlyArray<EmailEditorBlock> =>
	blocks.flatMap((block) =>
		isEmailEditorGridBlock(block) ? [block, ...block.children] : [block],
	);

/**
 * The container a block lives in: `null` for the root, a grid id for a nested
 * block, `undefined` when the id is unknown to the document.
 */
export const emailEditorContainerOf = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	blockId: string,
): EmailEditorContainerId | undefined => {
	if (blocks.some((block) => block.id === blockId)) {
		return null;
	}
	const grid = blocks.find(
		(block) =>
			isEmailEditorGridBlock(block) &&
			block.children.some((child) => child.id === blockId),
	);
	return grid?.id;
};

const gridById = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	gridId: string,
): EmailEditorGridBlock | undefined =>
	blocks.find(
		(block): block is EmailEditorGridBlock =>
			isEmailEditorGridBlock(block) && block.id === gridId,
	);

/** The blocks of one container, or `undefined` when it does not exist. */
export const emailEditorContainerBlocks = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	containerId: EmailEditorContainerId,
): ReadonlyArray<EmailEditorBlock> | undefined =>
	containerId === null ? blocks : gridById(blocks, containerId)?.children;

/** Replace one grid's children, leaving every other block untouched. */
const withGridChildren = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	gridId: string,
	children: ReadonlyArray<EmailEditorLeafBlock>,
): ReadonlyArray<EmailEditorBlock> =>
	blocks.map((block) =>
		isEmailEditorGridBlock(block) && block.id === gridId
			? { ...block, children }
			: block,
	);

const addBlock = (
	state: EmailEditorState,
	action: Extract<EmailEditorAction, { type: "add" }>,
	blockId: string,
): EmailEditorState => {
	const blocks = state.document.blocks;
	const containerId = action.containerId ?? null;
	const definition = emailBlockDefinitionForType(action.blockType);
	if (definition === undefined) {
		return state;
	}
	const block = definition.createEmpty(blockId);
	if (containerId === null) {
		return {
			...withBlocks(
				state,
				insertAt(blocks, action.index ?? blocks.length, block),
			),
			selectedBlockId: block.id,
		};
	}
	const grid = gridById(blocks, containerId);
	// A grid inside a grid is not a document the model can express.
	if (grid === undefined || isEmailEditorGridBlock(block)) {
		return state;
	}
	return {
		...withBlocks(
			state,
			withGridChildren(
				blocks,
				grid.id,
				insertAt(grid.children, action.index ?? grid.children.length, block),
			),
		),
		selectedBlockId: block.id,
	};
};

const updateBlock = (
	state: EmailEditorState,
	updated: EmailEditorBlock,
): EmailEditorState =>
	withBlocks(
		state,
		state.document.blocks.map((block) => {
			if (block.id === updated.id) {
				return updated;
			}
			if (!isEmailEditorGridBlock(block) || isEmailEditorGridBlock(updated)) {
				return block;
			}
			return {
				...block,
				children: block.children.map((child) =>
					child.id === updated.id ? updated : child,
				),
			};
		}),
	);

const removeBlock = (
	state: EmailEditorState,
	blockId: string,
): EmailEditorState => {
	// Removing a grid takes its children with it — that is what deleting a row
	// means, and the toolbar sits on the grid, not on the document.
	const blocks = state.document.blocks
		.filter((block) => block.id !== blockId)
		.map((block) =>
			isEmailEditorGridBlock(block)
				? {
						...block,
						children: block.children.filter((child) => child.id !== blockId),
					}
				: block,
		);
	return {
		...withBlocks(state, blocks),
		selectedBlockId:
			state.selectedBlockId === blockId ? null : state.selectedBlockId,
	};
};

/** Pull a block out of whatever container holds it. */
const detach = (
	blocks: ReadonlyArray<EmailEditorBlock>,
	blockId: string,
): {
	readonly blocks: ReadonlyArray<EmailEditorBlock>;
	readonly block: EmailEditorBlock | undefined;
} => {
	const block = allEmailEditorBlocks(blocks).find(
		(candidate) => candidate.id === blockId,
	);
	if (block === undefined) {
		return { blocks, block: undefined };
	}
	return {
		blocks: blocks
			.filter((candidate) => candidate.id !== blockId)
			.map((candidate) =>
				isEmailEditorGridBlock(candidate)
					? {
							...candidate,
							children: candidate.children.filter(
								(child) => child.id !== blockId,
							),
						}
					: candidate,
			),
		block,
	};
};

const moveBlock = (
	state: EmailEditorState,
	action: Extract<EmailEditorAction, { type: "move" }>,
): EmailEditorState => {
	const { blocks, block: moved } = detach(
		state.document.blocks,
		action.blockId,
	);
	if (moved === undefined) {
		return state;
	}
	if (isEmailEditorGridBlock(moved)) {
		// A grid can only ever live at the root; a drop that would nest it is a
		// no-op rather than a silently flattened document.
		return action.toContainerId === null
			? withBlocks(state, insertAt(blocks, action.toIndex, moved))
			: state;
	}
	if (action.toContainerId === null) {
		return withBlocks(state, insertAt(blocks, action.toIndex, moved));
	}
	const grid = gridById(blocks, action.toContainerId);
	if (grid === undefined) {
		return state;
	}
	return withBlocks(
		state,
		withGridChildren(
			blocks,
			grid.id,
			insertAt(grid.children, action.toIndex, moved),
		),
	);
};

/** A copy under fresh ids, deep for a grid so its children stay unique. */
const copyBlock = (
	block: EmailEditorBlock,
	generateBlockId: () => string,
): EmailEditorBlock =>
	isEmailEditorGridBlock(block)
		? {
				...block,
				id: generateBlockId(),
				children: block.children.map((child) => ({
					...child,
					id: generateBlockId(),
				})),
			}
		: { ...block, id: generateBlockId() };

const duplicateBlock = (
	state: EmailEditorState,
	blockId: string,
	generateBlockId: () => string,
): EmailEditorState => {
	const blocks = state.document.blocks;
	const containerId = emailEditorContainerOf(blocks, blockId);
	if (containerId === null) {
		const original = blocks.find((block) => block.id === blockId);
		if (original === undefined) {
			return state;
		}
		const copy = copyBlock(original, generateBlockId);
		return {
			...withBlocks(
				state,
				insertAt(blocks, blocks.indexOf(original) + 1, copy),
			),
			selectedBlockId: copy.id,
		};
	}
	const grid =
		containerId === undefined ? undefined : gridById(blocks, containerId);
	const original = grid?.children.find((child) => child.id === blockId);
	if (grid === undefined || original === undefined) {
		return state;
	}
	const copy: EmailEditorLeafBlock = { ...original, id: generateBlockId() };
	return {
		...withBlocks(
			state,
			withGridChildren(
				blocks,
				grid.id,
				insertAt(grid.children, grid.children.indexOf(original) + 1, copy),
			),
		),
		selectedBlockId: copy.id,
	};
};

/**
 * Pure reducer over the editor state. The block-id factory is injected so the
 * host controls id generation and tests stay deterministic.
 */
export const createEmailEditorReducer =
	(generateBlockId: () => string) =>
	(state: EmailEditorState, action: EmailEditorAction): EmailEditorState => {
		switch (action.type) {
			case "add":
				return addBlock(state, action, generateBlockId());
			case "update":
				return updateBlock(state, action.block);
			case "remove":
				return removeBlock(state, action.blockId);
			case "move":
				return moveBlock(state, action);
			case "duplicate":
				return duplicateBlock(state, action.blockId, generateBlockId);
			case "select":
				return { ...state, selectedBlockId: action.blockId };
			case "replace":
				return { document: action.document, selectedBlockId: null };
		}
	};
