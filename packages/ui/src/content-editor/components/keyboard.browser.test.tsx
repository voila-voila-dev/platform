import { cleanup, render } from "@testing-library/react";
import { type Location, NodeApi } from "platejs";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import type { ContentEditorApi } from "#/content-editor/features/feature-definition.tsx";

afterEach(cleanup);

const FEATURES = createContentFeatures();

const PIXEL =
	"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

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
			<ContentEditor.FloatingToolbar />
			<ExposeEditor onEditor={onEditor} />
		</ContentEditor.Root>
	);
}

const frame = () =>
	new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Mounts the editor, focuses it with a real click and puts the caret where
 * the test needs it. Keys then go through Chromium, so what the browser does
 * on its own is part of what is tested.
 */
async function edit(
	initial: ContentValue,
	at: (editor: ContentEditorApi) => Location | undefined,
): Promise<ContentEditorApi> {
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
	const canvas = document.querySelector<HTMLElement>(
		"[data-slot=content-editor-canvas]",
	);
	await userEvent.click(canvas as HTMLElement);
	const caret = at(editor);
	if (caret === undefined) {
		throw new Error("The caret has nowhere to go in this document.");
	}
	editor.tf.select(caret);
	await frame();
	await frame();
	return editor;
}

/** The document without ids, each block reduced to its props and its text. */
function blocks(editor: ContentEditorApi) {
	return editor.children.map((node) => {
		const { id: _id, children: _children, ...props } = node;
		return { ...props, text: NodeApi.string(node) };
	});
}

/** Slate reads the DOM selection on a throttle; wait for it before the next key. */
async function caretAt(editor: ContentEditorApi, path: ReadonlyArray<number>) {
	await expect
		.poll(() => editor.selection?.focus.path.slice(0, path.length))
		.toEqual(path);
}

const p = (text: string) => ({ type: "p", children: [{ text }] });
const item = (text: string, indent = 1) => ({
	type: "p",
	listStyleType: "disc",
	indent,
	children: [{ text }],
});
const divider = { type: "hr", children: [{ text: "" }] };
const image = { type: "image", url: PIXEL, children: [{ text: "" }] };

describe("Shift+Enter", () => {
	it("breaks the line inside the block", async () => {
		const editor = await edit([p("Bonjour")], (e) => e.api.end([0]));
		await userEvent.keyboard("{Shift>}{Enter}{/Shift}Marie");
		await expect
			.poll(() => blocks(editor))
			.toEqual([{ type: "p", text: "Bonjour\nMarie" }]);
	});
});

describe("links", () => {
	it("opens the link form on ⌘K, next to the selected text", async () => {
		const editor = await edit([p("Lire la doc ici")], () => ({
			anchor: { path: [0, 0], offset: 8 },
			focus: { path: [0, 0], offset: 11 },
		}));
		await userEvent.keyboard("{ControlOrMeta>}k{/ControlOrMeta}");
		const input = await vi.waitFor(() => {
			const found = document.querySelector<HTMLInputElement>(
				"[data-slot=content-editor-link-popover] input",
			);
			expect(found).not.toBeNull();
			return found as HTMLInputElement;
		});
		expect(
			document.querySelector(
				"[data-slot=content-editor-floating-toolbar] [aria-expanded=true]",
			),
		).not.toBeNull();
		await vi.waitFor(() => expect(document.activeElement).toBe(input));
		await userEvent.keyboard("https://voila.dev{Enter}");
		await expect
			.poll(() => editor.children[0]?.children)
			.toMatchObject([
				{ text: "Lire la " },
				{ type: "a", url: "https://voila.dev", children: [{ text: "doc" }] },
				{ text: " ici" },
			]);
	});

	it("opens the form of the link under the caret on ⌘K, to change its address", async () => {
		const editor = await edit(
			[
				{
					type: "p",
					children: [
						{ text: "Voir " },
						{ type: "a", url: "https://old.dev", children: [{ text: "ici" }] },
						{ text: "" },
					],
				},
			] as ContentValue,
			() => ({ path: [0, 1, 0], offset: 1 }),
		);
		await userEvent.keyboard("{ControlOrMeta>}k{/ControlOrMeta}");
		const input = await vi.waitFor(() => {
			const found = document.querySelector<HTMLInputElement>(
				"[data-slot=content-editor-link-popover] input",
			);
			expect(found?.value).toBe("https://old.dev");
			return found as HTMLInputElement;
		});
		await userEvent.fill(input, "https://new.dev");
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(
				() =>
					(editor.children[0]?.children[1] as { url?: string } | undefined)
						?.url,
			)
			.toBe("https://new.dev");
	});

	it("links the selected text when a URL is pasted over it", async () => {
		const editor = await edit([p("Lire la doc ici")], () => ({
			anchor: { path: [0, 0], offset: 8 },
			focus: { path: [0, 0], offset: 11 },
		}));
		await navigator.clipboard.writeText("https://voila.dev");
		await userEvent.paste();
		await expect
			.poll(() => editor.children[0]?.children)
			.toMatchObject([
				{ text: "Lire la " },
				{ type: "a", url: "https://voila.dev", children: [{ text: "doc" }] },
				{ text: " ici" },
			]);
	});
});

describe("lists", () => {
	it("leaves the list on Enter in an empty item", async () => {
		const editor = await edit([item("Un")], (e) => e.api.end([0]));
		await userEvent.keyboard("{Enter}");
		await caretAt(editor, [1]);
		await userEvent.keyboard("{Enter}");
		await expect
			.poll(() => blocks(editor))
			.toEqual([
				{ type: "p", listStyleType: "disc", indent: 1, text: "Un" },
				{ type: "p", text: "" },
			]);
	});

	it("outdents an item on Backspace at its start", async () => {
		const editor = await edit([item("Un"), item("Deux", 2)], (e) =>
			e.api.start([1]),
		);
		await userEvent.keyboard("{Backspace}");
		await expect
			.poll(() => blocks(editor)[1])
			.toEqual({ type: "p", listStyleType: "disc", indent: 1, text: "Deux" });
		await userEvent.keyboard("{Backspace}");
		await expect
			.poll(() => blocks(editor)[1])
			.toEqual({ type: "p", text: "Deux" });
	});
});

describe("Markdown shortcuts", () => {
	it.each([
		["- ", { type: "p", listStyleType: "disc", indent: 1, text: "" }],
		["* ", { type: "p", listStyleType: "disc", indent: 1, text: "" }],
		["1. ", { type: "p", listStyleType: "decimal", indent: 1, text: "" }],
		["> ", { type: "blockquote", text: "" }],
		["## ", { type: "h2", text: "" }],
		["### ", { type: "h3", text: "" }],
		// The page owns the h1, so `# ` stays text in the body editor.
		["# ", { type: "p", text: "# " }],
	])("turns %j into a block", async (typed, expected) => {
		const editor = await edit([p("")], (e) => e.api.end([0]));
		await userEvent.keyboard(typed);
		await expect.poll(() => blocks(editor)[0]).toMatchObject(expected);
	});

	it("turns --- into a divider, with no stray dashes inside it", async () => {
		const editor = await edit([p("")], (e) => e.api.end([0]));
		await userEvent.keyboard("---");
		await expect
			.poll(() => blocks(editor))
			.toEqual([
				{ type: "hr", text: "" },
				{ type: "p", text: "" },
			]);
		await caretAt(editor, [1]);
	});

	it("turns **text** into bold", async () => {
		const editor = await edit([p("")], (e) => e.api.end([0]));
		await userEvent.keyboard("**gras**");
		await expect
			.poll(() => editor.children[0]?.children)
			.toEqual([{ text: "gras", bold: true }]);
	});
});

describe("void elements", () => {
	const selectedVoid = () =>
		document.querySelector("[data-slot=content-editor-canvas] [data-selected]");

	it.each([
		["a divider", divider],
		["an image", image],
	])("selects %s with the arrows and moves out of it", async (_, node) => {
		const editor = await edit(
			[p("Avant"), node, p("Après")] as ContentValue,
			(e) => e.api.end([0]),
		);
		await userEvent.keyboard("{ArrowDown}");
		await caretAt(editor, [1]);
		await vi.waitFor(() => expect(selectedVoid()).not.toBeNull());
		await userEvent.keyboard("{ArrowDown}");
		await caretAt(editor, [2]);
		await vi.waitFor(() => expect(selectedVoid()).toBeNull());
		await userEvent.keyboard("{ArrowUp}");
		await caretAt(editor, [1]);
		await userEvent.keyboard("{ArrowUp}");
		await caretAt(editor, [0]);
	});

	it("deletes a selected void on Backspace, and ⌘Z brings it back", async () => {
		const editor = await edit(
			[p("Avant"), divider, p("Après")] as ContentValue,
			(e) => e.api.start([2]),
		);
		await userEvent.keyboard("{ArrowUp}");
		await caretAt(editor, [1]);
		await userEvent.keyboard("{Backspace}");
		await expect
			.poll(() => blocks(editor).map((block) => block.type))
			.toEqual(["p", "p"]);
		await userEvent.keyboard("{ControlOrMeta>}z{/ControlOrMeta}");
		await expect
			.poll(() => blocks(editor).map((block) => block.type))
			.toEqual(["p", "hr", "p"]);
	});

	it("leaves a void at the end of the document into a new paragraph", async () => {
		const editor = await edit([p("Avant"), image] as ContentValue, (e) =>
			e.api.end([0]),
		);
		await userEvent.keyboard("{ArrowDown}");
		await caretAt(editor, [1]);
		await userEvent.keyboard("{ArrowDown}");
		await caretAt(editor, [2]);
		await userEvent.keyboard("Suite");
		await expect
			.poll(() => blocks(editor)[2])
			.toEqual({ type: "p", text: "Suite" });
	});

	it("leaves a void at the start of the document into a new paragraph", async () => {
		const editor = await edit([image, p("Après")] as ContentValue, (e) =>
			e.api.start([1]),
		);
		await userEvent.keyboard("{ArrowUp}");
		await caretAt(editor, [0]);
		await vi.waitFor(() => expect(selectedVoid()).not.toBeNull());
		await userEvent.keyboard("{ArrowUp}");
		await expect
			.poll(() => blocks(editor).map((block) => block.type))
			.toEqual(["p", "image", "p"]);
		await caretAt(editor, [0]);
	});

	it("starts a paragraph below a void on Enter", async () => {
		const editor = await edit(
			[p("Avant"), divider, p("Après")] as ContentValue,
			(e) => e.api.end([0]),
		);
		await userEvent.keyboard("{ArrowDown}");
		await caretAt(editor, [1]);
		await userEvent.keyboard("{Enter}");
		await caretAt(editor, [2]);
		await userEvent.keyboard("Milieu");
		await expect
			.poll(() => blocks(editor).map((block) => block.text))
			.toEqual(["Avant", "", "Milieu", "Après"]);
	});
});
