// @vitest-environment jsdom
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { installContentEditorTestDom } from "#/content-editor/lib/test-dom.ts";

beforeEach(installContentEditorTestDom);
afterEach(cleanup);

const FEATURES = createContentFeatures();

const paragraph = (text: string): ContentValue[number] => ({
	type: "p",
	children: [{ text }],
});

function EditorUnderTest({
	initial,
	onValue,
}: {
	readonly initial: ContentValue | null;
	readonly onValue?: (value: ContentValue) => void;
}) {
	const [value, setValue] = useState(initial);
	return (
		<>
			<ContentEditor.Root
				features={FEATURES}
				value={value}
				onChange={(next) => {
					setValue(next);
					onValue?.(next);
				}}
				labels={{ chrome: { placeholder: "Écrivez ici…" } }}
			>
				<ContentEditor.Layout>
					<ContentEditor.Canvas />
					<ContentEditor.CharacterCount />
				</ContentEditor.Layout>
			</ContentEditor.Root>
			<button type="button" onClick={() => setValue([paragraph("Remplacé")])}>
				replace
			</button>
		</>
	);
}

describe("ContentEditor", () => {
	it("mounts the document with the host's labels and counts it", () => {
		render(<EditorUnderTest initial={[paragraph("Bonjour le monde")]} />);
		const canvas = screen.getByRole("textbox");
		expect(canvas.dataset.slot).toBe("content-editor-canvas");
		expect(canvas.textContent).toBe("Bonjour le monde");
		expect(screen.getByText(/16 characters/)).toBeTruthy();
		expect(screen.getByText(/3 words/)).toBeTruthy();
	});

	it("shows the placeholder on an empty document", async () => {
		render(<EditorUnderTest initial={null} />);
		await waitFor(() => {
			expect(
				document.querySelector("[data-slate-placeholder]")?.textContent,
			).toBe("Écrivez ici…");
		});
	});

	it("takes a document the host hands down later and reports it once, as any edit", async () => {
		const onValue = vi.fn();
		render(
			<EditorUnderTest initial={[paragraph("Avant")]} onValue={onValue} />,
		);
		act(() => {
			screen.getByText("replace").click();
		});
		await waitFor(() => {
			expect(screen.getByRole("textbox").textContent).toBe("Remplacé");
		});
		expect(onValue).toHaveBeenCalledTimes(1);
		expect(onValue).toHaveBeenCalledWith([paragraph("Remplacé")]);
	});

	it("warns when a layout has no canvas", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
		render(
			<ContentEditor.Root features={FEATURES} value={null} onChange={() => {}}>
				<ContentEditor.Layout>
					<span>nothing</span>
				</ContentEditor.Layout>
			</ContentEditor.Root>,
		);
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining("no <ContentEditor.Canvas />"),
		);
		warn.mockRestore();
	});
});
