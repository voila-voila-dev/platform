// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmailBlocks } from "#/email-block-editor/blocks/create-email-blocks.ts";
import type {
	EmailEditorBlockLike,
	EmailEditorDocument,
	EmailEditorHeadingBlock,
} from "#/email-block-editor/document/types.ts";
import { EmailEditor } from "#/email-block-editor/parts/namespace.ts";

// jsdom has no matchMedia. The editor asks two questions through it — is the
// layout compact, is the pointer coarse — and these tests are about the wide,
// mouse-driven arrangement, so both answer no.
beforeEach(() => {
	window.matchMedia = ((query: string) =>
		({
			matches: false,
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {},
		}) as unknown as MediaQueryList) as typeof window.matchMedia;
	// The selected block's toolbar reads the caret's active marks through
	// `document.queryCommandState`, which jsdom does not implement.
	globalThis.document.queryCommandState = () => false;
});

afterEach(cleanup);

const BLOCKS = createEmailBlocks({ currency: "EUR" });

const documentOf = (
	...blocks: ReadonlyArray<EmailEditorBlockLike>
): EmailEditorDocument<EmailEditorBlockLike> => ({ version: 1, blocks });

const heading = (id: string, text: string): EmailEditorHeadingBlock => ({
	id,
	type: "heading",
	text,
	level: 1,
});

/** The editor as a host mounts it: the document is the host's state, so an
 * edit only shows up once the change comes back down. */
function EditorUnderTest({
	initial,
	selectedBlockId,
	children,
}: {
	initial: EmailEditorDocument<EmailEditorBlockLike>;
	selectedBlockId?: string | null;
	children?: React.ReactNode;
}) {
	const [document, setDocument] = useState(initial);
	return (
		<EmailEditor.Root
			blocks={BLOCKS}
			document={document}
			onDocumentChange={setDocument}
			selectedBlockId={selectedBlockId}
			onSelectedBlockIdChange={
				selectedBlockId === undefined ? undefined : () => {}
			}
			generateBlockId={() => "new-block"}
		>
			{children ?? (
				<EmailEditor.Layout>
					<EmailEditor.Toolbar />
					<EmailEditor.Canvas />
					<EmailEditor.Sidebar />
				</EmailEditor.Layout>
			)}
		</EmailEditor.Root>
	);
}

describe("EmailEditor", () => {
	it("renders each block of the document through its definition", () => {
		const { getAllByLabelText } = render(
			<EditorUnderTest
				initial={documentOf(heading("a", "First"), heading("b", "Second"))}
			/>,
		);

		expect(
			getAllByLabelText("Heading").map(
				(input) => (input as HTMLInputElement).value,
			),
		).toEqual(["First", "Second"]);
	});

	it("edits a block in place and hands the whole next document back", () => {
		const { getAllByLabelText } = render(
			<EditorUnderTest initial={documentOf(heading("a", "First"))} />,
		);

		fireEvent.change(getAllByLabelText("Heading")[0], {
			target: { value: "Edited" },
		});

		expect((getAllByLabelText("Heading")[0] as HTMLInputElement).value).toBe(
			"Edited",
		);
	});

	it("shows the selected block's settings in the sidebar", () => {
		const { getByText, getByLabelText } = render(
			<EditorUnderTest
				initial={documentOf(heading("a", "First"))}
				selectedBlockId="a"
			/>,
		);

		expect(getByText("Block settings")).toBeDefined();
		expect(getByLabelText("Text")).toBeDefined();
	});

	it("says so rather than crashing on a stored block it has no definition for", () => {
		const { getByText } = render(
			<EditorUnderTest initial={documentOf({ id: "x", type: "confetti" })} />,
		);

		expect(getByText('Unknown block ("confetti")')).toBeDefined();
	});

	it("prompts for a selection when there is none", () => {
		const { getByText } = render(
			<EditorUnderTest initial={documentOf(heading("a", "First"))} />,
		);

		expect(getByText("Select a block to edit its settings.")).toBeDefined();
	});

	it("warns when a layout has no canvas in it", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

		render(
			<EditorUnderTest initial={documentOf(heading("a", "First"))}>
				<EmailEditor.Layout>
					<EmailEditor.Toolbar />
				</EmailEditor.Layout>
			</EditorUnderTest>,
		);

		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining("no <EmailEditor.Canvas />"),
		);
		warn.mockRestore();
	});

	it("takes its copy from `labels`", () => {
		const { getByText } = render(
			<EmailEditor.Root
				blocks={BLOCKS}
				document={documentOf()}
				onDocumentChange={() => {}}
				labels={{ chrome: { emptyDocument: "Votre e-mail est vide." } }}
			>
				<EmailEditor.Layout>
					<EmailEditor.Canvas />
				</EmailEditor.Layout>
			</EmailEditor.Root>,
		);

		expect(getByText("Votre e-mail est vide.")).toBeDefined();
	});
});
