// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import type { PlateEditor } from "platejs/react";
import { useEditorRef } from "platejs/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ContentEditorField } from "#/content-editor/components/content-editor-field.tsx";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import {
	createContentFeatures,
	createInlineContentFeatures,
} from "#/content-editor/features/create-content-features.ts";
import { installContentEditorTestDom } from "#/content-editor/lib/test-dom.ts";

beforeEach(installContentEditorTestDom);
afterEach(cleanup);

let editorRef: PlateEditor | null = null;
function CaptureEditor() {
	editorRef = useEditorRef();
	return null;
}

function Field({
	toolbar,
	mode,
	initial,
}: {
	readonly toolbar?: boolean;
	readonly mode?: "block" | "inline" | "single-line";
	readonly initial: ContentValue;
}) {
	const [value, setValue] = useState<ContentValue | null>(initial);
	return (
		<ContentEditorField
			features={
				mode === "block" || mode === undefined
					? createContentFeatures()
					: createInlineContentFeatures()
			}
			mode={mode}
			value={value}
			onChange={setValue}
			toolbar={toolbar}
			count
		/>
	);
}

const line = (text: string): ContentValue[number] => ({
	type: "p",
	children: [{ text }],
});

describe("ContentEditorField", () => {
	it("composes the toolbar, the canvas and the count", () => {
		render(<Field initial={[line("Bonjour")]} />);
		expect(screen.getByRole("toolbar")).toBeTruthy();
		expect(screen.getByRole("textbox").textContent).toBe("Bonjour");
		expect(screen.getByText(/7 characters/)).toBeTruthy();
	});

	it("drops the toolbar on request and keeps the document", () => {
		render(<Field initial={[line("Bonjour")]} toolbar={false} />);
		expect(screen.queryByRole("toolbar")).toBeNull();
		expect(screen.getByRole("textbox").textContent).toBe("Bonjour");
	});
});

describe("single-line mode", () => {
	function SingleLine({ initial }: { readonly initial: ContentValue }) {
		const [value, setValue] = useState<ContentValue | null>(initial);
		return (
			<ContentEditor.Root
				features={createInlineContentFeatures()}
				mode="single-line"
				value={value}
				onChange={setValue}
			>
				<CaptureEditor />
				<ContentEditor.Canvas />
			</ContentEditor.Root>
		);
	}

	it("folds a document of several blocks into one paragraph and swallows Enter", async () => {
		render(<SingleLine initial={[line("Un"), line("Deux")]} />);
		const editor = () => editorRef as PlateEditor;
		await waitFor(() => {
			expect(editor().children).toHaveLength(1);
		});
		expect(editor().children[0]?.type).toBe("p");
		act(() => {
			editor().tf.select({ path: [0, 0], offset: 2 });
			editor().tf.insertBreak();
		});
		expect(editor().children).toHaveLength(1);
		expect(screen.getByRole("textbox").getAttribute("aria-multiline")).toBe(
			"false",
		);
	});
});
