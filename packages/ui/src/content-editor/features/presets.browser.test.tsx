import { cleanup, render } from "@testing-library/react";
import { NodeApi } from "platejs";
import { useEditorRef } from "platejs/react";
import { useEffect, useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentDescendant,
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import {
	createCorrespondenceFeatures,
	createEmailFeatures,
} from "#/content-editor/features/create-content-features.ts";
import type {
	ContentEditorApi,
	ContentFeature,
} from "#/content-editor/features/feature-definition.tsx";
import { createContentRegistry } from "#/content-editor/features/registry.ts";

afterEach(cleanup);

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

const EMPTY: ContentValue = [{ type: "p", children: [{ text: "" }] }];

function EditorUnderTest({
	features,
	initial = EMPTY,
	onEditor,
}: {
	readonly features: ReadonlyArray<ContentFeature>;
	readonly initial?: ContentValue;
	readonly onEditor: (editor: ContentEditorApi) => void;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditor.Root features={features} value={value} onChange={setValue}>
			<ContentEditor.Canvas />
			<ExposeEditor onEditor={onEditor} />
		</ContentEditor.Root>
	);
}

async function mount(
	features: ReadonlyArray<ContentFeature>,
	initial?: ContentValue,
): Promise<ContentEditorApi> {
	let mounted: ContentEditorApi | undefined;
	render(
		<EditorUnderTest
			features={features}
			initial={initial}
			onEditor={(editor) => {
				mounted = editor;
			}}
		/>,
	);
	await vi.waitFor(() => expect(mounted).toBeDefined());
	const editor = mounted as ContentEditorApi;
	await userEvent.click(editable());
	editor.tf.select({ path: [0, 0], offset: 0 });
	return editor;
}

const editable = () =>
	document.querySelector("[contenteditable=true]") as HTMLElement;

/**
 * A paste as Chromium delivers it to slate-react: a `beforeinput` of type
 * `insertFromPaste` carrying the clipboard, the event Chromium fires after
 * `paste` and the one slate-react reads the data from.
 */
function paste(data: Readonly<Record<string, string>>) {
	const transfer = new DataTransfer();
	for (const [format, content] of Object.entries(data)) {
		transfer.setData(format, content);
	}
	editable().dispatchEvent(
		new InputEvent("beforeinput", {
			inputType: "insertFromPaste",
			dataTransfer: transfer,
			bubbles: true,
			cancelable: true,
		}),
	);
}

/** Slate's own clipboard format, as another content editor would copy it. */
const slateFragment = (nodes: ReadonlyArray<ContentNodeLike>) =>
	window.btoa(encodeURIComponent(JSON.stringify(nodes)));

function typesIn(nodes: ReadonlyArray<ContentDescendant>): Set<string> {
	const found = new Set<string>();
	const walk = (node: ContentDescendant) => {
		if ("text" in node && typeof node.text === "string") {
			for (const key of Object.keys(node)) {
				if (key !== "text") {
					found.add(`mark:${key}`);
				}
			}
			return;
		}
		const element = node as ContentNodeLike;
		found.add(element.type);
		element.children.forEach(walk);
	};
	nodes.forEach(walk);
	return found;
}

const FOREIGN_HTML = `
<h3>Planning</h3>
<table>
	<thead><tr><th>Day</th><th>Coach</th></tr></thead>
	<tbody>
		<tr><td><s>Monday</s></td><td><code>Anna</code></td></tr>
		<tr><td>Tuesday</td><td><div><section><p>Nested <span>deep</span></p></section></div></td></tr>
	</tbody>
</table>
<div><section><blockquote><p>Quoted</p></blockquote><iframe src="https://example.com"></iframe></section></div>
<p>End</p>`;

/** A document editor's copy: a callout, a real table, an embed, and a strikethrough. */
const FOREIGN_FRAGMENT: ReadonlyArray<ContentNodeLike> = [
	{
		type: "callout",
		children: [{ type: "p", children: [{ text: "Heads up" }] }],
	},
	{
		type: "table",
		children: [
			{
				type: "tr",
				children: [
					{
						type: "td",
						colSpan: 2,
						children: [
							{
								type: "p",
								children: [{ text: "Cell", strikethrough: true }],
							},
						],
					},
				],
			},
		],
	},
	{ type: "youtube", url: "https://youtu.be/x", children: [{ text: "" }] },
	{
		type: "h3",
		children: [
			{ text: "Title " },
			{ type: "mention", value: "anna", children: [{ text: "@anna" }] },
		],
	},
];

const presets = [
	["correspondence", createCorrespondenceFeatures()],
	["email", createEmailFeatures()],
] as const;

describe.each(presets)("the %s preset", (_name, features) => {
	const registry = createContentRegistry(features);
	const allowed = new Set([
		...registry.reader.nodeTypes,
		...registry.reader.leaves.map((leaf) => `mark:${leaf.key}`),
	]);

	it("keeps only its own nodes and marks from pasted HTML, and all of its text", async () => {
		const editor = await mount(features);
		paste({ "text/html": FOREIGN_HTML, "text/plain": "Planning" });
		await expect
			.poll(() => NodeApi.string({ children: editor.children } as never))
			.toContain("End");
		const text = NodeApi.string({ children: editor.children } as never);
		for (const word of ["Planning", "Monday", "Anna", "deep", "Quoted"]) {
			expect(text).toContain(word);
		}
		// Each cell is a line of its own, never run into its neighbours.
		const lines = [...editor.api.nodes({ at: [], match: { type: "p" } })].map(
			([node]) => NodeApi.string(node),
		);
		expect(lines).toEqual(expect.arrayContaining(["Monday", "Anna"]));
		const present = typesIn(editor.children as unknown as ContentValue);
		expect([...present].filter((type) => !allowed.has(type))).toEqual([]);
	});

	it("keeps only its own nodes and marks from another editor's copy", async () => {
		const editor = await mount(features);
		paste({
			"application/x-slate-fragment": slateFragment(FOREIGN_FRAGMENT),
			"text/plain": "Heads up",
		});
		await expect
			.poll(() => NodeApi.string({ children: editor.children } as never))
			.toContain("@anna");
		const text = NodeApi.string({ children: editor.children } as never);
		for (const word of ["Heads up", "Cell", "Title"]) {
			expect(text).toContain(word);
		}
		const present = typesIn(editor.children as unknown as ContentValue);
		expect([...present].filter((type) => !allowed.has(type))).toEqual([]);
		expect(present.has("youtube")).toBe(false);
	});
});

describe("a stored value", () => {
	it("is normalized as it loads: foreign nodes unwrapped, badge items numbered", async () => {
		const editor = await mount(createEmailFeatures(), [
			...FOREIGN_FRAGMENT,
			...["One", "Two", "Three"].map((step) => ({
				type: "p",
				listStyleType: "badge",
				indent: 1,
				children: [{ text: step }],
			})),
		]);
		const present = typesIn(editor.children as unknown as ContentValue);
		expect(present.has("callout")).toBe(false);
		expect(present.has("youtube")).toBe(false);
		expect(present.has("h3")).toBe(false);
		await expect
			.poll(() =>
				[
					...document.querySelectorAll(
						"[data-list-style=badge] span[aria-hidden]",
					),
				].map((badge) => badge.textContent),
			)
			.toEqual(["1", "2", "3"]);
	});
});

describe("the presets' sets", () => {
	it("gives the correspondence preset text, a list, a quote, an image and a variable", () => {
		const { reader } = createContentRegistry(createCorrespondenceFeatures());
		expect(reader.nodeTypes).toEqual([
			"p",
			"a",
			"blockquote",
			"image",
			"variable",
		]);
		expect(reader.leaves.map((leaf) => leaf.key)).toEqual([
			"bold",
			"italic",
			"underline",
		]);
	});

	it("gives the email preset every email block", () => {
		const { reader } = createContentRegistry(createEmailFeatures());
		expect(reader.nodeTypes).toEqual([
			"p",
			"h1",
			"h2",
			"a",
			"highlight",
			"fine-print",
			"button",
			"stat",
			"image",
			"hr",
			"article",
			"product",
			"offer",
			"rating",
			"table",
			"tr",
			"td",
			"th",
			"columns",
			"column",
			"variable",
		]);
	});
});
