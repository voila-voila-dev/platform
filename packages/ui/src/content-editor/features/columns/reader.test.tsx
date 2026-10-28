// @vitest-environment jsdom
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContentRenderer } from "#/content-editor/components/content-renderer.tsx";
import {
	columnsReader,
	freshColumns,
} from "#/content-editor/features/columns/reader.tsx";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import { contentToHtml } from "#/content-editor/reader/content-to-html.ts";
import { createContentReaders } from "#/content-editor/reader/readers.ts";

const features = [...createContentReaders(), columnsReader];

const value: ContentValue = [
	{
		type: "columns",
		desktopColumns: 2,
		mobileColumns: 1,
		children: [
			{ type: "column", children: [{ type: "p", children: [{ text: "A" }] }] },
			{ type: "column", children: [{ type: "p", children: [{ text: "B" }] }] },
		],
	},
];

describe("columns reader", () => {
	it("writes the desktop grid inline and the counts as data attributes", () => {
		expect(contentToHtml(value, { features })).toBe(
			'<div data-columns="2" data-mobile-columns="1" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;align-items:start">' +
				'<div style="min-width:0"><p>A</p></div> ' +
				'<div style="min-width:0"><p>B</p></div>' +
				"</div>",
		);
	});

	it("renders each column in the grid", () => {
		const { container } = render(
			<ContentRenderer value={value} features={features} />,
		);
		const grid = container.querySelector(".grid") as HTMLElement;
		expect(grid.children).toHaveLength(2);
		expect(grid.style.getPropertyValue("--columns-desktop")).toBe("2");
		expect(grid.textContent).toBe("AB");
	});

	it("mints a row with as many empty columns as it says", () => {
		const row = freshColumns({ desktopColumns: 3 });
		expect(row).toMatchObject({ desktopColumns: 3, mobileColumns: 1 });
		expect(row.children).toHaveLength(3);
	});
});
