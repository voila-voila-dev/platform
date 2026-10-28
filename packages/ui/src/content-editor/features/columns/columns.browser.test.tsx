import { cleanup, render } from "@testing-library/react";
import { NodeApi } from "platejs";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import { columnsFeature } from "#/content-editor/features/columns/feature.tsx";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";

afterEach(cleanup);

const FEATURES = [...createContentFeatures(), columnsFeature];

function ExposeEditor({
	onEditor,
}: {
	readonly onEditor: (editor: ContentEditorApi) => void;
}) {
	const editor = useEditorRef();
	useEffect(() => {
		onEditor(editor);
	}, [editor, onEditor]);
	return null;
}

function EditorUnderTest({
	initial,
	onEditor,
}: {
	readonly initial: ContentValue;
	readonly onEditor: (editor: ContentEditorApi) => void;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root features={FEATURES} value={value} onChange={setValue}>
			<ContentEditor.Layout>
				<ContentEditor.Toolbar />
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
			<ContentEditor.Inspector />
			<ExposeEditor onEditor={onEditor} />
		</ContentEditor.Root>
	);
}

const p = (text: string): ContentNodeLike => ({
	type: "p",
	children: [{ text }],
});

const column = (...children: ReadonlyArray<ContentNodeLike>) => ({
	type: "column",
	children,
});

const row = (
	desktopColumns: number,
	...columns: ReadonlyArray<ContentNodeLike>
): ContentNodeLike => ({
	type: "columns",
	desktopColumns,
	mobileColumns: 1,
	children: columns,
});

async function mount(initial: ContentValue): Promise<ContentEditorApi> {
	let mounted: ContentEditorApi | undefined;
	render(
		<EditorUnderTest
			initial={initial}
			onEditor={(editor) => {
				mounted = editor;
			}}
		/>,
	);
	await vi.waitFor(() => expect(mounted).toBeDefined());
	return mounted as ContentEditorApi;
}

/** The text of each column of the row at `index`. */
const columnTexts = (editor: ContentEditorApi, index = 0) =>
	((editor.children[index] as ContentNodeLike).children ?? []).map((child) =>
		NodeApi.string(child as never),
	);

const columnAt = (editor: ContentEditorApi, index: number) =>
	((editor.children[0] as ContentNodeLike).children ?? [])[
		index
	] as ContentNodeLike;

async function caretAt(editor: ContentEditorApi, text: string, end = false) {
	await page
		.elementLocator(
			document.querySelector(
				"[data-slot=content-editor-canvas]",
			) as HTMLElement,
		)
		.getByText(text)
		.click();
	const entry = editor.api.node({
		at: [],
		match: (node) => "text" in node && (node as { text: string }).text === text,
	});
	if (entry === undefined) {
		throw new Error(`no leaf "${text}"`);
	}
	editor.tf.select(end ? editor.api.end(entry[1]) : editor.api.start(entry[1]));
	await expect
		.poll(() => editor.selection?.anchor.offset)
		.toBe(end ? text.length : 0);
}

describe("columns", () => {
	it("inserts two columns from the slash menu, the caret in the first, and types in each", async () => {
		const editor = await mount([p("")]);
		await page
			.elementLocator(
				document.querySelector(
					"[data-slot=content-editor-canvas]",
				) as HTMLElement,
			)
			.click();
		await userEvent.keyboard("/columns");
		await expect
			.element(page.getByRole("option", { name: "Columns" }))
			.toBeVisible();
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() =>
				editor.children.map((node) => [
					node.type,
					(node as ContentNodeLike).children?.length,
				]),
			)
			.toEqual([
				["columns", 2],
				["p", 1],
			]);
		await expect
			.poll(() => editor.selection?.anchor.path)
			.toEqual([0, 0, 0, 0]);
		await userEvent.keyboard("Left");
		await expect.poll(() => columnTexts(editor)).toEqual(["Left", ""]);
		await userEvent.keyboard("{ArrowRight}");
		await expect
			.poll(() => editor.selection?.anchor.path)
			.toEqual([0, 1, 0, 0]);
		await userEvent.keyboard("Right");
		await expect.poll(() => columnTexts(editor)).toEqual(["Left", "Right"]);
		await userEvent.keyboard("{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}");
		await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
		await expect
			.poll(() => editor.selection?.anchor.path)
			.toEqual([0, 0, 0, 0]);
	});

	it("keeps each column's text in it on Backspace at its start and Delete at its end", async () => {
		const editor = await mount([row(2, column(p("One")), column(p("Two")))]);
		await caretAt(editor, "Two");
		await userEvent.keyboard("{Backspace}");
		await expect.poll(() => columnTexts(editor)).toEqual(["One", "Two"]);
		await caretAt(editor, "One", true);
		await userEvent.keyboard("{Delete}");
		await expect.poll(() => columnTexts(editor)).toEqual(["One", "Two"]);
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => columnAt(editor, 0).children?.length).toBe(2);
		await userEvent.keyboard("{Backspace}");
		await expect.poll(() => columnTexts(editor)).toEqual(["One", "Two"]);
		await expect
			.poll(() => editor.selection?.anchor.path)
			.toEqual([0, 0, 0, 0]);
		await expect.poll(() => editor.selection?.anchor.offset).toBe(3);
	});

	it("adds, reorders and removes columns from the inspector", async () => {
		const editor = await mount([row(2, column(p("One")), column(p("Two")))]);
		await caretAt(editor, "One");
		await page.getByRole("button", { name: "Add a column" }).click();
		await expect.poll(() => columnTexts(editor)).toEqual(["One", "Two", ""]);
		await expect
			.poll(() => (editor.children[0] as ContentNodeLike).desktopColumns)
			.toBe(3);
		await page.getByRole("button", { name: "Move column 1 right" }).click();
		await expect.poll(() => columnTexts(editor)).toEqual(["Two", "One", ""]);
		await page.getByRole("button", { name: "Move column 2 left" }).click();
		await expect.poll(() => columnTexts(editor)).toEqual(["One", "Two", ""]);
		await page.getByRole("button", { name: "Remove column 2" }).click();
		await expect.poll(() => columnTexts(editor)).toEqual(["One", ""]);
		await expect
			.poll(() => (editor.children[0] as ContentNodeLike).desktopColumns)
			.toBe(2);
	});

	it("sets the counts from the inspector, merging what a dropped column held", async () => {
		const editor = await mount([
			row(3, column(p("One")), column(p("Two")), column(p("Three"))),
		]);
		await caretAt(editor, "One");
		await page.getByRole("combobox", { name: "Columns (desktop)" }).click();
		await page.getByRole("option", { name: "4" }).click();
		await expect
			.poll(() => columnTexts(editor))
			.toEqual(["One", "Two", "Three", ""]);
		await page.getByRole("combobox", { name: "Columns (desktop)" }).click();
		await page.getByRole("option", { name: "2" }).click();
		await expect.poll(() => columnTexts(editor)).toEqual(["One", "TwoThree"]);
		expect(columnAt(editor, 1).children).toHaveLength(2);
		await page.getByRole("combobox", { name: "Columns (mobile)" }).click();
		await page.getByRole("option", { name: "2" }).click();
		await expect
			.poll(() => (editor.children[0] as ContentNodeLike).mobileColumns)
			.toBe(2);
	});

	it("unwraps a row of columns copied and pasted into a column", async () => {
		const editor = await mount([
			row(2, column(p("One")), column(p("Two"))),
			row(2, column(p("Left")), column(p("Right"))),
		]);
		await caretAt(editor, "Left");
		editor.tf.select({
			anchor: editor.api.start([1]) as never,
			focus: editor.api.end([1]) as never,
		});
		await expect.poll(() => editor.selection?.focus.path).toEqual([1, 1, 0, 0]);
		await userEvent.copy();
		await caretAt(editor, "One", true);
		await userEvent.paste();
		await expect
			.poll(() => NodeApi.string(editor.children[0] as never))
			.toContain("Right");
		const types = (node: ContentNodeLike): ReadonlyArray<string> => [
			String(node.type),
			...(node.children ?? []).flatMap((child) =>
				"text" in child ? [] : types(child as ContentNodeLike),
			),
		];
		const pastedInto = editor.children[0] as ContentNodeLike;
		expect(pastedInto.children).toHaveLength(2);
		for (const kept of pastedInto.children ?? []) {
			const inside = types(kept as ContentNodeLike).slice(1);
			expect(inside).not.toContain("columns");
			expect(inside).not.toContain("column");
		}
		expect(columnTexts(editor)[1]).toBe("Two");
	});

	it("inserts from the toolbar after the block, never splitting it", async () => {
		const editor = await mount([p("Intro text")]);
		editor.tf.select({ path: [0, 0], offset: 5 });
		await page.getByRole("button", { name: "Insert" }).click();
		await page.getByRole("menuitem", { name: "Columns" }).click();
		await expect
			.poll(() => editor.children.map((node) => node.type))
			.toEqual(["p", "columns", "p"]);
		expect(NodeApi.string(editor.children[0] as never)).toBe("Intro text");
		await expect
			.poll(() => editor.selection?.anchor.path)
			.toEqual([1, 0, 0, 0]);
	});

	it("keeps the blocks around a row out of it on Backspace and Delete", async () => {
		const editor = await mount([
			p("Before"),
			row(2, column(p("One")), column(p("Two"))),
			p("After"),
			p(""),
		]);
		await caretAt(editor, "Before", true);
		await userEvent.keyboard("{Delete}");
		await caretAt(editor, "After");
		await userEvent.keyboard("{Backspace}");
		await expect
			.poll(() => editor.children.map((node) => NodeApi.string(node as never)))
			.toEqual(["Before", "OneTwo", "After", ""]);
		editor.tf.removeNodes({ at: [2] });
		editor.tf.select({ path: [2, 0], offset: 0 });
		await expect.poll(() => editor.selection?.anchor.path).toEqual([2, 0]);
		await userEvent.keyboard("{Backspace}");
		await expect
			.poll(() => editor.children.map((node) => node.type))
			.toEqual(["p", "columns"]);
		await expect
			.poll(() => editor.selection?.anchor.path)
			.toEqual([1, 1, 0, 0]);
	});

	it("stacks into the mobile count when the canvas is narrow", async () => {
		await mount([
			row(3, column(p("One")), column(p("Two")), column(p("Three"))),
		]);
		const grid = () =>
			document.querySelector(
				"[data-slot=content-editor-columns]",
			) as HTMLElement;
		const tracks = () =>
			getComputedStyle(grid()).gridTemplateColumns.split(" ").length;
		const container = grid().parentElement as HTMLElement;
		container.style.width = "800px";
		await expect.poll(tracks).toBe(3);
		container.style.width = "360px";
		await expect.poll(tracks).toBe(1);
	});
});
