// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { ListBlockView } from "#/email-block-editor/blocks/list-block-view.tsx";
import type { EmailEditorListBlock } from "#/email-block-editor/document/types.ts";

afterEach(cleanup);

const listOf = (...texts: ReadonlyArray<string>): EmailEditorListBlock => ({
	id: "l",
	type: "list",
	marker: "bullet",
	items: texts.map((text) => ({ spans: [{ text }] })),
});

/** The block as the canvas mounts it: the parent owns the document, so an
 * inserted item only shows up once the change comes back down. */
function ListUnderTest({ initial }: { initial: EmailEditorListBlock }) {
	const [block, setBlock] = useState(initial);
	return <ListBlockView block={block} selected onChange={setBlock} />;
}

describe("ListBlockView", () => {
	it("starts the next item on Enter and puts the caret in it", () => {
		const { getByLabelText, getAllByRole } = render(
			<ListUnderTest initial={listOf("First")} />,
		);

		fireEvent.keyDown(getByLabelText("Item 1"), { key: "Enter" });

		const items = getAllByRole("textbox");
		expect(items).toHaveLength(2);
		expect(items[1]?.textContent).toBe("");
		expect(document.activeElement).toBe(items[1]);
	});

	it("inserts the new item right after the one being edited", () => {
		const { getByLabelText, getAllByRole } = render(
			<ListUnderTest initial={listOf("One", "Two")} />,
		);

		fireEvent.keyDown(getByLabelText("Item 1"), { key: "Enter" });

		expect(getAllByRole("textbox").map((item) => item.textContent)).toEqual([
			"One",
			"",
			"Two",
		]);
	});

	it("leaves Shift+Enter to the browser, as a line break inside the item", () => {
		const { getByLabelText, getAllByRole } = render(
			<ListUnderTest initial={listOf("First")} />,
		);

		fireEvent.keyDown(getByLabelText("Item 1"), {
			key: "Enter",
			shiftKey: true,
		});

		expect(getAllByRole("textbox")).toHaveLength(1);
	});
});
