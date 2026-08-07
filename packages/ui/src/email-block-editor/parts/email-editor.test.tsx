// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createEmailBlocks } from "#/email-block-editor/blocks/create-email-blocks.ts";
import { PreviewToggle } from "#/email-block-editor/components/preview-toggle.tsx";
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

	it("stacks the settings cards in one column instead of on top of each other", () => {
		// The parts used to place themselves into the grid with column and row
		// classes, and two of them claimed the same cell: the block settings card
		// rendered exactly on top of the document settings card, hiding it.
		const { getByText } = render(
			<EditorUnderTest initial={documentOf(heading("a", "First"))}>
				<EmailEditor.Layout>
					<EmailEditor.Toolbar />
					<EmailEditor.DocumentSettings>
						<label htmlFor="subject">Subject</label>
					</EmailEditor.DocumentSettings>
					<EmailEditor.Canvas />
					<EmailEditor.Sidebar />
				</EmailEditor.Layout>
			</EditorUnderTest>,
		);

		const card =
			'[class~="rounded-lg"][class~="border"][class~="bg-background"]';
		const documentCard = getByText("Subject").closest(card);
		const blockCard = getByText("Block settings").closest(card);
		expect(documentCard).not.toBeNull();
		expect(blockCard).not.toBeNull();
		expect(documentCard).not.toBe(blockCard);
		expect(documentCard?.contains(blockCard as Node)).toBe(false);
		// Both in the settings column, the document's fields first — not two
		// elements placed into the same cell.
		const column = documentCard?.parentElement;
		expect(column?.contains(blockCard as Node)).toBe(true);
		expect(
			(documentCard as Node).compareDocumentPosition(blockCard as Node) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	it("keeps a click on the selected block's toolbar away from the host", () => {
		// A host deselects when the page around the editor is clicked. The block
		// toolbar only exists while a block is selected, so a click that reached
		// the host unmounted the toolbar mid-interaction: the add-block menu
		// opened on mousedown and vanished on release, leaving the button dead
		// unless you held the press and let go over the item you wanted.
		const deselect = vi.fn();
		const { getByLabelText } = render(
			// biome-ignore lint/a11y/noStaticElementInteractions: stands in for the host page.
			// biome-ignore lint/a11y/useKeyWithClickEvents: same as above.
			<div onClick={deselect}>
				<EditorUnderTest
					initial={documentOf(heading("a", "First"))}
					selectedBlockId="a"
				/>
			</div>,
		);

		fireEvent.click(getByLabelText("Add a block"));

		expect(deselect).not.toHaveBeenCalled();
	});

	// The toolbar's two pieces are exported so a host can put either somewhere
	// else — a settings column, a page header — without rebuilding it.
	it("lets a host place the preview toggle outside the toolbar", () => {
		const { getByRole, queryByLabelText } = render(
			<EditorUnderTest initial={documentOf()}>
				<EmailEditor.Layout>
					<EmailEditor.Canvas />
					<EmailEditor.Sidebar>
						<PreviewToggle />
					</EmailEditor.Sidebar>
				</EmailEditor.Layout>
			</EditorUnderTest>,
		);

		expect(getByRole("radio", { name: "Mobile" })).toBeDefined();
		// No toolbar in this arrangement, so no add-block menu came with it.
		expect(queryByLabelText("Add a block")).toBeNull();
	});

	// A column is exactly where the toggle needs to fill its width rather than
	// sit at the width of the word "Desktop".
	it("stretches the preview toggle when asked", () => {
		const { getByRole } = render(
			<EditorUnderTest initial={documentOf()}>
				<EmailEditor.Layout>
					<EmailEditor.Canvas />
					<EmailEditor.Sidebar>
						<PreviewToggle stretch />
					</EmailEditor.Sidebar>
				</EmailEditor.Layout>
			</EditorUnderTest>,
		);

		expect(
			getByRole("radiogroup", { name: "Preview" }).classList.contains("w-full"),
		).toBe(true);
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
