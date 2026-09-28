import { cleanup, render } from "@testing-library/react";
import { type Location, NodeApi, type Path } from "platejs";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";
import { highlightFeature } from "#/content-editor/features/highlight/feature.tsx";
import { ratingFeature } from "#/content-editor/features/rating/feature.tsx";
import { RATING_DEFAULTS } from "#/content-editor/features/rating/reader.tsx";

afterEach(cleanup);

const FEATURES = [
	...createContentFeatures({ headings: ["h1", "h2"] }),
	highlightFeature,
	ratingFeature,
];

let latest: ContentValue = [];

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
	latest = value ?? [];
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			appearance="email"
		>
			<ContentEditor.Canvas />
			<ContentEditor.Inspector />
			<ExposeEditor onEditor={onEditor} />
		</ContentEditor.Root>
	);
}

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
	const editor = mounted as ContentEditorApi;
	await userEvent.click(
		document.querySelector<HTMLElement>(
			"[data-slot=content-editor-canvas]",
		) as HTMLElement,
	);
	return editor;
}

async function select(editor: ContentEditorApi, at: Location): Promise<void> {
	editor.tf.select(at);
	editor.tf.focus();
	await expect
		.poll(() => editor.selection)
		.toMatchObject(editor.api.range(at) ?? {});
}

const caretIn = (editor: ContentEditorApi, path: Path, offset: number) =>
	select(editor, { path, offset });

function elementIds(value: ContentValue): ReadonlyArray<unknown> {
	const ids: Array<unknown> = [];
	for (const [node] of NodeApi.nodes({ children: value } as never)) {
		const element = node as ContentNodeLike;
		if (typeof element.type === "string") {
			ids.push(element.id);
		}
	}
	return ids;
}

const duplicates = (ids: ReadonlyArray<unknown>) =>
	ids.filter((id, index) => ids.indexOf(id) !== index);

const text = (node: ContentNodeLike | undefined) =>
	node === undefined ? "" : NodeApi.string(node as never);

describe("node ids", () => {
	it("gives a fresh id to the block a split or a paste creates", async () => {
		const editor = await mount([
			{ id: "intro", type: "p", children: [{ text: "Hello world" }] },
			{ id: "title", type: "h2", children: [{ text: "Big title" }] },
			{ id: "outro", type: "p", children: [{ text: "Bye" }] },
		]);

		await caretIn(editor, [0, 0], 5);
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() => latest.map(text))
			.toEqual(["Hello", " world", "Big title", "Bye"]);

		await caretIn(editor, [2, 0], 3);
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() => latest.map((node) => (node as ContentNodeLike).type))
			.toEqual(["p", "p", "h2", "p", "p"]);

		await select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [1, 0], offset: 6 },
		});
		await userEvent.copy();
		await select(editor, editor.api.end([4]) as Location);
		await userEvent.paste();
		await expect.poll(() => latest.length).toBeGreaterThan(5);

		expect(elementIds(latest).every((id) => typeof id === "string")).toBe(true);
		expect(duplicates(elementIds(latest))).toEqual([]);
	});

	it("gives a fresh id to the second half of a split rating or highlight", async () => {
		const editor = await mount([
			{
				id: "score",
				type: "rating",
				...RATING_DEFAULTS,
				children: [{ text: "How was the class?" }],
			},
			{
				id: "promo",
				type: "highlight",
				align: "center",
				children: [{ text: "Ten percent off" }],
			},
		]);
		await caretIn(editor, [0, 0], 7);
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => latest.length).toBe(3);
		await caretIn(editor, [2, 0], 11);
		await userEvent.keyboard("{Enter}");
		await expect.poll(() => latest.length).toBe(4);
		expect(elementIds(latest).every((id) => typeof id === "string")).toBe(true);
		expect(duplicates(elementIds(latest))).toEqual([]);
	});

	it("edits the settings of the block the caret is in after a split and a paste", async () => {
		const editor = await mount([
			{
				id: "promo",
				type: "highlight",
				align: "center",
				children: [{ text: "Ten percent off" }],
			},
			{ id: "after", type: "p", children: [{ text: "" }] },
		]);
		await caretIn(editor, [0, 0], 11);
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() =>
				latest.map((node) => [
					(node as ContentNodeLike).type,
					text(node as ContentNodeLike),
				]),
			)
			.toEqual([
				["highlight", "Ten percent"],
				["p", " off"],
				["p", ""],
			]);

		await select(editor, {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [1, 0], offset: 0 },
		});
		await userEvent.copy();
		await select(editor, editor.api.end([2]) as Location);
		await userEvent.paste();
		await expect
			.poll(() => latest.map((node) => (node as ContentNodeLike).type))
			.toContain("highlight");
		await expect
			.poll(
				() =>
					latest.filter(
						(node) => (node as ContentNodeLike).type === "highlight",
					).length,
			)
			.toBe(2);
		expect(duplicates(elementIds(latest))).toEqual([]);

		const pasted = latest.map((node) => node.type).lastIndexOf("highlight");
		await caretIn(editor, [pasted, 0], 3);
		await page.getByRole("combobox", { name: "Alignment" }).click();
		await page.getByRole("option", { name: "Left" }).click();
		await expect
			.poll(() =>
				latest
					.filter((node) => (node as ContentNodeLike).type === "highlight")
					.map((node) => (node as ContentNodeLike).align),
			)
			.toEqual(["center", "left"]);
	});

	it("renews the repeated ids of a stored document, so the inspector edits the block the caret is in", async () => {
		const editor = await mount([
			{
				id: "promo",
				type: "highlight",
				align: "center",
				children: [{ text: "First" }],
			},
			{
				id: "promo",
				type: "highlight",
				align: "center",
				children: [{ text: "Second" }],
			},
		]);
		await caretIn(editor, [1, 0], 3);
		await page.getByRole("combobox", { name: "Alignment" }).click();
		await page.getByRole("option", { name: "Left" }).click();
		await expect
			.poll(() => latest.map((node) => (node as ContentNodeLike).align))
			.toEqual(["center", "left"]);
		expect(duplicates(elementIds(latest))).toEqual([]);
	});

	it("keeps the ids it gives a document without them to itself until the author edits", async () => {
		const onChange = vi.fn();
		render(
			<ContentEditor.Root
				features={FEATURES}
				value={[{ type: "p", children: [{ text: "Hello" }] }]}
				onChange={onChange}
			>
				<ContentEditor.Canvas />
			</ContentEditor.Root>,
		);
		await page.getByText("Hello").click();
		await userEvent.keyboard("{End}");
		await expect
			.poll(() => window.getSelection()?.anchorOffset)
			.toBe("Hello".length);
		expect(onChange).not.toHaveBeenCalled();

		await userEvent.keyboard("!");
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.calls[0]?.[0]).toMatchObject([
			{ type: "p", id: expect.any(String), children: [{ text: "Hello!" }] },
		]);
	});
});
