import { beforeEach, describe, expect, it } from "vitest";
import { createEmailBlocks } from "#/email-block-editor/blocks/create-email-blocks.ts";
import { createEmailBlockRegistry } from "#/email-block-editor/blocks/registry.ts";
import {
	createEmailEditorReducer,
	type EmailEditorState,
} from "#/email-block-editor/document/reducer.ts";
import {
	type EmailEditorBlockLike,
	type EmailEditorBuiltInBlock,
	type EmailEditorDocument,
	type EmailEditorGridBlock,
	type EmailEditorParagraphBlock,
	emptyEmailEditorDocument,
} from "#/email-block-editor/document/types.ts";

const registry = createEmailBlockRegistry(
	createEmailBlocks({ currency: "EUR" }),
);

/** A freshly created block of a type, the way the editor makes one: through
 * that type's own definition. */
const createBlock = (type: string, id: string) =>
	registry.definitionFor(type)?.createEmpty(id);

let nextId = 0;
const reduce = createEmailEditorReducer<EmailEditorBuiltInBlock>(
	registry,
	() => `id-${++nextId}`,
);

const stateOf = (
	document: EmailEditorDocument<EmailEditorBuiltInBlock>,
): EmailEditorState<EmailEditorBuiltInBlock> => ({
	document,
	selectedBlockId: null,
});

const documentWithBlocks =
	(): EmailEditorDocument<EmailEditorBuiltInBlock> => ({
		version: 1,
		blocks: [
			{ id: "a", type: "heading", text: "Hello", level: 1 },
			{ id: "b", type: "paragraph", spans: [{ text: "Some text" }] },
			{
				id: "c",
				type: "button",
				label: "View",
				href: "https://acme.dev",
				align: "center",
				variant: "primary",
			},
		],
	});

beforeEach(() => {
	nextId = 0;
});

describe("createEmailEditorReducer", () => {
	it("adds a block at the end by default and selects it", () => {
		const state = reduce(stateOf(emptyEmailEditorDocument()), {
			type: "add",
			blockType: "heading",
		});

		expect(state.document.blocks).toEqual([
			{ id: "id-1", type: "heading", text: "", level: 1 },
		]);
		expect(state.selectedBlockId).toBe("id-1");
	});

	it("adds a block at a given index, clamped to the block count", () => {
		const inserted = reduce(stateOf(documentWithBlocks()), {
			type: "add",
			blockType: "divider",
			index: 1,
		});
		expect(inserted.document.blocks.map((block) => block.id)).toEqual([
			"a",
			"id-1",
			"b",
			"c",
		]);

		const appended = reduce(stateOf(documentWithBlocks()), {
			type: "add",
			blockType: "divider",
			index: 99,
		});
		expect(appended.document.blocks.map((block) => block.id)).toEqual([
			"a",
			"b",
			"c",
			"id-2",
		]);
	});

	it("creates every block type from its own definition", () => {
		expect(createBlock("paragraph", "x")).toEqual({
			id: "x",
			type: "paragraph",
			spans: [],
		});
		expect(createBlock("button", "x")).toEqual({
			id: "x",
			type: "button",
			label: "",
			href: "",
			align: "center",
			variant: "primary",
		});
		expect(createBlock("image", "x")).toEqual({
			id: "x",
			type: "image",
			src: "",
			alt: "",
			href: "",
			width: "full",
			overlay: "none",
			rounded: true,
		});
		expect(createBlock("divider", "x")).toEqual({
			id: "x",
			type: "divider",
		});
	});

	it("updates a block in place by id", () => {
		const state = reduce(stateOf(documentWithBlocks()), {
			type: "update",
			block: { id: "b", type: "paragraph", spans: [{ text: "Fixed" }] },
		});

		expect(state.document.blocks[1]).toEqual({
			id: "b",
			type: "paragraph",
			spans: [{ text: "Fixed" }],
		});
		expect(state.document.blocks[0]).toEqual({
			id: "a",
			type: "heading",
			text: "Hello",
			level: 1,
		});
	});

	it("removes a block and clears its selection", () => {
		const selected: EmailEditorState<EmailEditorBuiltInBlock> = {
			document: documentWithBlocks(),
			selectedBlockId: "b",
		};

		const state = reduce(selected, { type: "remove", blockId: "b" });

		expect(state.document.blocks.map((block) => block.id)).toEqual(["a", "c"]);
		expect(state.selectedBlockId).toBeNull();
	});

	it("keeps the selection when removing another block", () => {
		const selected: EmailEditorState<EmailEditorBuiltInBlock> = {
			document: documentWithBlocks(),
			selectedBlockId: "a",
		};

		const state = reduce(selected, { type: "remove", blockId: "b" });

		expect(state.selectedBlockId).toBe("a");
	});

	it("moves a block to a new index", () => {
		const state = reduce(stateOf(documentWithBlocks()), {
			type: "move",
			blockId: "c",
			toContainerId: null,
			toIndex: 0,
		});

		expect(state.document.blocks.map((block) => block.id)).toEqual([
			"c",
			"a",
			"b",
		]);
	});

	it("clamps a move past the end and ignores unknown block ids", () => {
		const clamped = reduce(stateOf(documentWithBlocks()), {
			type: "move",
			blockId: "a",
			toContainerId: null,
			toIndex: 99,
		});
		expect(clamped.document.blocks.map((block) => block.id)).toEqual([
			"b",
			"c",
			"a",
		]);

		const untouched = stateOf(documentWithBlocks());
		expect(
			reduce(untouched, {
				type: "move",
				blockId: "ghost",
				toContainerId: null,
				toIndex: 0,
			}),
		).toBe(untouched);
	});

	it("duplicates a block right after the original with a fresh id and selects the copy", () => {
		const state = reduce(stateOf(documentWithBlocks()), {
			type: "duplicate",
			blockId: "b",
		});

		expect(state.document.blocks.map((block) => block.id)).toEqual([
			"a",
			"b",
			"id-1",
			"c",
		]);
		expect(state.document.blocks[2]).toEqual({
			id: "id-1",
			type: "paragraph",
			spans: [{ text: "Some text" }],
		});
		expect(state.selectedBlockId).toBe("id-1");
	});

	it("selects and deselects a block", () => {
		const selected = reduce(stateOf(documentWithBlocks()), {
			type: "select",
			blockId: "c",
		});
		expect(selected.selectedBlockId).toBe("c");

		const deselected = reduce(selected, { type: "select", blockId: null });
		expect(deselected.selectedBlockId).toBeNull();
	});

	it("replaces the whole document and resets the selection", () => {
		const selected: EmailEditorState<EmailEditorBuiltInBlock> = {
			document: documentWithBlocks(),
			selectedBlockId: "a",
		};

		const state = reduce(selected, {
			type: "replace",
			document: emptyEmailEditorDocument(),
		});

		expect(state.document.blocks).toEqual([]);
		expect(state.selectedBlockId).toBeNull();
	});
});

/**
 * The grid is the only nesting the model allows, and every container-crossing
 * operation goes through the reducer — so the matrix (into, out of, between,
 * within, and deleting a whole row) is covered here rather than left to the
 * drag-and-drop layer.
 */
describe("createEmailEditorReducer with grids", () => {
	const leaf = (id: string): EmailEditorParagraphBlock => ({
		id,
		type: "paragraph",
		spans: [{ text: id }],
	});

	const grid = (
		id: string,
		children: ReadonlyArray<EmailEditorParagraphBlock>,
	): EmailEditorGridBlock<EmailEditorParagraphBlock> => ({
		id,
		type: "grid",
		desktopColumns: 2,
		mobileColumns: 1,
		children,
	});

	const documentWithGrids =
		(): EmailEditorDocument<EmailEditorBuiltInBlock> => ({
			version: 1,
			blocks: [
				leaf("root-1"),
				grid("grid-1", [leaf("g1-a"), leaf("g1-b")]),
				grid("grid-2", [leaf("g2-a")]),
			],
		});

	/** `["root-1", "grid-1(g1-a,g1-b)", …]` — the whole tree in one line. */
	const shapeOf = (
		document: EmailEditorDocument<EmailEditorBlockLike>,
	): ReadonlyArray<string> =>
		document.blocks.map((block) => {
			const children = registry
				.definitionFor(block.type)
				?.container?.children(block);
			return children === undefined
				? block.id
				: `${block.id}(${children.map((child: EmailEditorBlockLike) => child.id).join(",")})`;
		});

	it("creates a grid with two desktop columns, one mobile column and no children", () => {
		expect(createBlock("grid", "x")).toEqual({
			id: "x",
			type: "grid",
			desktopColumns: 2,
			mobileColumns: 1,
			children: [],
		});
	});

	it("adds a block into a grid and selects it", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "add",
			blockType: "heading",
			containerId: "grid-1",
			index: 1,
		});

		expect(shapeOf(state.document)).toEqual([
			"root-1",
			"grid-1(g1-a,id-1,g1-b)",
			"grid-2(g2-a)",
		]);
		expect(state.selectedBlockId).toBe("id-1");
	});

	it("refuses to add a grid inside a grid", () => {
		const state = stateOf(documentWithGrids());

		expect(
			reduce(state, {
				type: "add",
				blockType: "grid",
				containerId: "grid-1",
			}),
		).toBe(state);
	});

	it("updates a block nested in a grid", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "update",
			block: { id: "g1-b", type: "paragraph", spans: [{ text: "Fixed" }] },
		});

		const updated = state.document.blocks[1];
		expect(
			registry.definitionFor(updated.type)?.container?.children(updated)[1],
		).toEqual({
			id: "g1-b",
			type: "paragraph",
			spans: [{ text: "Fixed" }],
		});
	});

	it("moves a block from the root into a grid", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "move",
			blockId: "root-1",
			toContainerId: "grid-1",
			toIndex: 0,
		});

		expect(shapeOf(state.document)).toEqual([
			"grid-1(root-1,g1-a,g1-b)",
			"grid-2(g2-a)",
		]);
	});

	it("moves a block out of a grid back to the root", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "move",
			blockId: "g1-a",
			toContainerId: null,
			toIndex: 0,
		});

		expect(shapeOf(state.document)).toEqual([
			"g1-a",
			"root-1",
			"grid-1(g1-b)",
			"grid-2(g2-a)",
		]);
	});

	it("moves a block between two grids", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "move",
			blockId: "g1-b",
			toContainerId: "grid-2",
			toIndex: 0,
		});

		expect(shapeOf(state.document)).toEqual([
			"root-1",
			"grid-1(g1-a)",
			"grid-2(g1-b,g2-a)",
		]);
	});

	it("reorders within a grid", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "move",
			blockId: "g1-b",
			toContainerId: "grid-1",
			toIndex: 0,
		});

		expect(shapeOf(state.document)).toEqual([
			"root-1",
			"grid-1(g1-b,g1-a)",
			"grid-2(g2-a)",
		]);
	});

	it("leaves the document alone when a grid is dropped into a grid", () => {
		const state = stateOf(documentWithGrids());

		expect(
			reduce(state, {
				type: "move",
				blockId: "grid-2",
				toContainerId: "grid-1",
				toIndex: 0,
			}),
		).toBe(state);
	});

	it("deletes a grid with its children", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "remove",
			blockId: "grid-1",
		});

		expect(shapeOf(state.document)).toEqual(["root-1", "grid-2(g2-a)"]);
	});

	it("deletes a single child without touching its siblings", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "remove",
			blockId: "g1-a",
		});

		expect(shapeOf(state.document)).toEqual([
			"root-1",
			"grid-1(g1-b)",
			"grid-2(g2-a)",
		]);
	});

	it("duplicates a grid deeply, giving every copied child a fresh id", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "duplicate",
			blockId: "grid-1",
		});

		expect(shapeOf(state.document)).toEqual([
			"root-1",
			"grid-1(g1-a,g1-b)",
			"id-1(id-2,id-3)",
			"grid-2(g2-a)",
		]);
		expect(state.selectedBlockId).toBe("id-1");
	});

	it("duplicates a block inside its own grid", () => {
		const state = reduce(stateOf(documentWithGrids()), {
			type: "duplicate",
			blockId: "g1-a",
		});

		expect(shapeOf(state.document)).toEqual([
			"root-1",
			"grid-1(g1-a,id-1,g1-b)",
			"grid-2(g2-a)",
		]);
		expect(state.selectedBlockId).toBe("id-1");
	});
});

/**
 * The container abstraction, exercised by something that is not the grid.
 *
 * The reducer used to test `type === "grid"` in nine places; it now asks the
 * registry. A test registry with a second container — different type, different
 * children field, its own `accepts` — is what makes that a real abstraction
 * rather than a rename: every case below would pass just as well against
 * hard-coded grid logic if the grid were the only container in the suite.
 */
describe("createEmailEditorReducer with a consumer's own container", () => {
	interface SectionBlock extends EmailEditorBlockLike {
		readonly type: "section";
		readonly title: string;
		/** Deliberately not called `children`. */
		readonly rows: ReadonlyArray<EmailEditorBlockLike>;
	}

	const sectionDefinition = {
		type: "section" as const,
		label: "Section",
		icon: (() => null) as never,
		createEmpty: (id: string): SectionBlock => ({
			id,
			type: "section",
			title: "",
			rows: [],
		}),
		View: (() => null) as never,
		Settings: null,
		container: {
			children: (block: SectionBlock) => block.rows,
			withChildren: (
				block: SectionBlock,
				rows: ReadonlyArray<EmailEditorBlockLike>,
			): SectionBlock => ({ ...block, rows }),
			/** Paragraphs only: a container states its own rule. */
			accepts: (type: string) => type === "paragraph",
		},
	};

	const sectionRegistry = createEmailBlockRegistry([
		...createEmailBlocks({ currency: "EUR" }),
		sectionDefinition,
	]);
	let sectionNextId = 0;
	type SectionDocumentBlock = EmailEditorBuiltInBlock | SectionBlock;
	const reduceSections = createEmailEditorReducer<SectionDocumentBlock>(
		sectionRegistry,
		() => `id-${++sectionNextId}`,
	);

	const paragraph = (id: string): EmailEditorParagraphBlock => ({
		id,
		type: "paragraph",
		spans: [{ text: id }],
	});
	const section = (
		id: string,
		rows: ReadonlyArray<EmailEditorBlockLike>,
	): SectionBlock => ({ id, type: "section", title: "", rows });

	const documentWithSection =
		(): EmailEditorDocument<SectionDocumentBlock> => ({
			version: 1,
			blocks: [paragraph("root-1"), section("section-1", [paragraph("s-a")])],
		});

	const sectionStateOf = (
		document: EmailEditorDocument<SectionDocumentBlock>,
	): EmailEditorState<SectionDocumentBlock> => ({
		document,
		selectedBlockId: null,
	});

	const rowsOf = (
		state: EmailEditorState<SectionDocumentBlock>,
		sectionId: string,
	): ReadonlyArray<string> => {
		const found = state.document.blocks.find(
			(block): block is SectionBlock =>
				block.id === sectionId && block.type === "section",
		);
		return (found?.rows ?? []).map((row) => row.id);
	};

	beforeEach(() => {
		sectionNextId = 0;
	});

	it("adds an accepted block into the container", () => {
		const state = reduceSections(sectionStateOf(documentWithSection()), {
			type: "add",
			blockType: "paragraph",
			containerId: "section-1",
		});
		expect(rowsOf(state, "section-1")).toEqual(["s-a", "id-1"]);
		expect(state.selectedBlockId).toBe("id-1");
	});

	it("refuses a block the container does not accept", () => {
		const before = sectionStateOf(documentWithSection());
		const state = reduceSections(before, {
			type: "add",
			blockType: "heading",
			containerId: "section-1",
		});
		expect(state).toBe(before);
	});

	it("moves a block into the container and back out to the root", () => {
		const inside = reduceSections(sectionStateOf(documentWithSection()), {
			type: "move",
			blockId: "root-1",
			toContainerId: "section-1",
			toIndex: 0,
		});
		expect(rowsOf(inside, "section-1")).toEqual(["root-1", "s-a"]);
		expect(inside.document.blocks.map((block) => block.id)).toEqual([
			"section-1",
		]);

		const back = reduceSections(inside, {
			type: "move",
			blockId: "root-1",
			toContainerId: null,
			toIndex: 0,
		});
		expect(rowsOf(back, "section-1")).toEqual(["s-a"]);
		expect(back.document.blocks.map((block) => block.id)).toEqual([
			"root-1",
			"section-1",
		]);
	});

	it("refuses to move a container into another container", () => {
		const before = reduceSections(sectionStateOf(documentWithSection()), {
			type: "add",
			blockType: "section",
		});
		const state = reduceSections(before, {
			type: "move",
			blockId: "id-1",
			toContainerId: "section-1",
			toIndex: 0,
		});
		expect(state).toBe(before);
	});

	it("updates a nested block in place", () => {
		const state = reduceSections(sectionStateOf(documentWithSection()), {
			type: "update",
			block: { id: "s-a", type: "paragraph", spans: [{ text: "edited" }] },
		});
		const rows =
			state.document.blocks.find(
				(block): block is SectionBlock => block.type === "section",
			)?.rows ?? [];
		expect(rows[0]).toEqual({
			id: "s-a",
			type: "paragraph",
			spans: [{ text: "edited" }],
		});
	});

	it("duplicates the container with fresh ids for its rows", () => {
		const state = reduceSections(sectionStateOf(documentWithSection()), {
			type: "duplicate",
			blockId: "section-1",
		});
		expect(state.document.blocks.map((block) => block.id)).toEqual([
			"root-1",
			"section-1",
			"id-1",
		]);
		expect(rowsOf(state, "id-1")).toEqual(["id-2"]);
	});

	it("removes the container with everything in it", () => {
		const state = reduceSections(sectionStateOf(documentWithSection()), {
			type: "remove",
			blockId: "section-1",
		});
		expect(state.document.blocks.map((block) => block.id)).toEqual(["root-1"]);
	});
});
