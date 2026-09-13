// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/react";
import type { PlateEditor } from "platejs/react";
import { useEditorRef } from "platejs/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { installContentEditorTestDom } from "#/content-editor/lib/test-dom.ts";

beforeEach(installContentEditorTestDom);
afterEach(cleanup);

const FEATURES = createContentFeatures();

let editorRef: PlateEditor | null = null;
function CaptureEditor() {
	editorRef = useEditorRef();
	return null;
}

function EditorUnderTest({ upload }: { readonly upload?: boolean }) {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "" }] },
	]);
	return (
		<ContentEditor.Root
			features={FEATURES}
			value={value}
			onChange={setValue}
			onUploadImage={upload ? async () => ({ url: "" }) : undefined}
		>
			<CaptureEditor />
			<ContentEditor.Layout>
				<ContentEditor.Canvas />
			</ContentEditor.Layout>
		</ContentEditor.Root>
	);
}

/** What typing `/` does, without the beforeinput jsdom cannot fire. */
const openSlash = () =>
	act(() => {
		const editor = editorRef as PlateEditor;
		editor.tf.select({ path: [0, 0], offset: 0 });
		editor.tf.insertNodes({
			type: "slash_input",
			children: [{ text: "" }],
		} as never);
	});

describe("slash menu", () => {
	it("lists the registry's slash items and filters them by label and keyword", async () => {
		render(<EditorUnderTest />);
		openSlash();
		const input = await screen.findByRole("textbox", { name: "Insert" });
		expect(screen.getByText("Divider")).toBeTruthy();
		expect(screen.getByText("Heading 2")).toBeTruthy();
		fireEvent.change(input, { target: { value: "cit" } });
		expect(screen.getByText("Quote")).toBeTruthy();
		expect(screen.queryByText("Divider")).toBeNull();
		fireEvent.change(input, { target: { value: "zzz" } });
		expect(screen.getByText("No block matches.")).toBeTruthy();
	});

	it("applies the highlighted item on Enter and leaves the caret in a fresh paragraph", async () => {
		render(<EditorUnderTest />);
		openSlash();
		const input = await screen.findByRole("textbox", { name: "Insert" });
		fireEvent.change(input, { target: { value: "divider" } });
		fireEvent.keyDown(input, { key: "Enter" });
		await waitFor(() => {
			const editor = editorRef as PlateEditor;
			const types = editor.children.map((node) => node.type);
			expect(types).toContain("hr");
			expect(types[types.length - 1]).toBe("p");
			expect(types).not.toContain("slash_input");
		});
	});
});
