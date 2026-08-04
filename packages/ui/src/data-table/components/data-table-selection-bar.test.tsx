// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DataTable } from "#/data-table/components/data-table.tsx";

afterEach(cleanup);

describe("DataTable.SelectionBar", () => {
	it("renders nothing while the selection is empty", () => {
		render(
			<DataTable.SelectionBar
				count={0}
				label="0 selected"
				onClear={() => {}}
				clearLabel="Clear selection"
			/>,
		);
		expect(screen.queryByRole("toolbar")).toBeNull();
	});

	it("shows the label, the actions, and clears on the X", () => {
		const onClear = vi.fn();
		render(
			<DataTable.SelectionBar
				count={2}
				label="2 selected"
				onClear={onClear}
				clearLabel="Clear selection"
			>
				<button type="button">Delete</button>
			</DataTable.SelectionBar>,
		);
		expect(screen.getByRole("toolbar", { name: "2 selected" })).toBeTruthy();
		expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
		fireEvent.click(screen.getByRole("button", { name: "Clear selection" }));
		expect(onClear).toHaveBeenCalledTimes(1);
	});

	it("offers select-all only while the selection is partial", () => {
		const onSelect = vi.fn();
		const { rerender } = render(
			<DataTable.SelectionBar
				count={2}
				label="2 selected"
				onClear={() => {}}
				clearLabel="Clear selection"
				selectAll={{ label: "Select all 56", onSelect }}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Select all 56" }));
		expect(onSelect).toHaveBeenCalledTimes(1);

		rerender(
			<DataTable.SelectionBar
				count={56}
				label="56 selected"
				onClear={() => {}}
				clearLabel="Clear selection"
			/>,
		);
		expect(screen.queryByRole("button", { name: "Select all 56" })).toBeNull();
	});
});
