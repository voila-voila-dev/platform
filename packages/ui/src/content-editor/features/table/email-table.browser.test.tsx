import { cleanup, render } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import { ContentEditor } from "#/content-editor/components/namespace.ts";
import type {
	ContentNodeLike,
	ContentValue,
} from "#/content-editor/features/content-value.ts";
import { createContentFeatures } from "#/content-editor/features/create-content-features.ts";
import { emailTableFeature } from "#/content-editor/features/table/feature.tsx";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";

afterEach(cleanup);

/** A whole authoring pass; the default 15 s is tight with the suite in parallel. */
const LONG_INTERACTION = 40_000;

const FEATURES = [
	...createContentFeatures().filter((feature) => feature.key !== "table"),
	emailTableFeature,
];

let latest: ContentValue = [];

function Composer() {
	const [value, setValue] = useState<ContentValue | null>([
		{ type: "p", children: [{ text: "" }] },
	]);
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
		</ContentEditor.Root>
	);
}

const table = () =>
	latest.find((node) => node.type === "table") as ContentNodeLike | undefined;
const row = (index: number) => table()?.children[index] as ContentNodeLike;
const cell = (rowIndex: number, column: number) =>
	row(rowIndex).children[column] as ContentNodeLike;
/** A body cell of the table, counted across the body rows. */
const bodyCell = (index: number) => page.getByRole("cell").nth(index);

describe("email table", () => {
	it(
		"is inserted from / with titled columns, and its cells take one line of plain text",
		async () => {
			render(<Composer />);
			await page.getByRole("textbox", { name: "Content editor" }).click();
			await userEvent.keyboard("/table");
			await expect
				.element(page.getByRole("option", { name: "Table" }))
				.toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect.poll(table).toMatchObject({
				columns: [{ align: "left" }, { align: "right" }],
				headerRow: true,
			});
			expect(
				row(0).children.map((child) => (child as ContentNodeLike).type),
			).toEqual(["th", "th"]);
			expect(
				row(1).children.map((child) => (child as ContentNodeLike).type),
			).toEqual(["td", "td"]);

			await userEvent.keyboard("Item");
			await bodyCell(0).click();
			await expect
				.poll(() =>
					document.getSelection()?.anchorNode?.parentElement?.closest("td"),
				)
				.toBeTruthy();
			await userEvent.keyboard("Jer{Enter}{Shift>}{Enter}{/Shift}sey");
			await userEvent.keyboard("{Control>}b{/Control}{Meta>}b{/Meta} kit");
			await expect
				.poll(() => cell(1, 0).children)
				.toEqual([
					expect.objectContaining({
						type: "p",
						children: [{ text: "Jersey kit" }],
					}),
				]);

			await page.getByRole("button", { name: "Align column right" }).click();
			await expect
				.poll(() => table()?.columns)
				.toEqual([{ align: "right" }, { align: "right" }]);

			await page.getByRole("switch", { name: "Header row" }).click();
			await expect.poll(() => table()?.headerRow).toBe(false);
			await expect
				.poll(() =>
					row(0).children.map((child) => (child as ContentNodeLike).type),
				)
				.toEqual(["td", "td"]);
			await page.getByRole("switch", { name: "Header row" }).click();
			await expect
				.poll(() => (row(0).children[0] as ContentNodeLike).type)
				.toBe("th");

			const html = contentToHtml(latest, { features: FEATURES });
			expect(html).toContain('<thead><tr><th style="text-align:right;');
			expect(html).toContain(">Item</th>");
			expect(html).toContain(">Jersey kit</td>");
		},
		LONG_INTERACTION,
	);

	it(
		"moves the alignments with an inserted column",
		async () => {
			render(<Composer />);
			await page.getByRole("textbox", { name: "Content editor" }).click();
			await userEvent.keyboard("/table");
			await expect
				.element(page.getByRole("option", { name: "Table" }))
				.toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect.poll(table).toBeDefined();
			await bodyCell(1).click();
			await page.getByRole("button", { name: "Add column left" }).click();
			await expect
				.poll(() => table()?.columns)
				.toEqual([{ align: "left" }, { align: "left" }, { align: "right" }]);
			expect(row(0).children).toHaveLength(3);

			await page.getByRole("combobox", { name: "Column 3" }).click();
			await page.getByRole("option", { name: "Aligned left" }).click();
			await expect
				.poll(() => table()?.columns)
				.toEqual([{ align: "left" }, { align: "left" }, { align: "left" }]);
		},
		LONG_INTERACTION,
	);
});
