// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Spreadsheet } from "#/spreadsheet/components/spreadsheet.tsx";

beforeEach(() => {
	// Base UI's Positioner measures the anchor with ResizeObserver, absent in jsdom.
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

afterEach(cleanup);

describe("Spreadsheet.NestedInput", () => {
	it("shows the summary on the closed cell", () => {
		const view = render(
			<Spreadsheet.NestedInput
				summary="2 paliers"
				ariaLabel="Paliers"
				title="Paliers"
			>
				<table />
			</Spreadsheet.NestedInput>,
		);
		expect(view.getByLabelText("Paliers").textContent).toContain("2 paliers");
	});

	it("keeps the nested table out of the document until it is opened", async () => {
		const view = render(
			<Spreadsheet.NestedInput
				summary="2 paliers"
				ariaLabel="Paliers"
				title="Paliers"
			>
				<p>nested rows</p>
			</Spreadsheet.NestedInput>,
		);
		expect(view.queryByText("nested rows")).toBeNull();

		fireEvent.click(view.getByLabelText("Paliers"));
		await waitFor(() => {
			expect(view.getByText("nested rows")).not.toBeNull();
		});
	});

	it("flags an empty summary so the cell can read as muted", () => {
		const view = render(
			<Spreadsheet.NestedInput summary="  " ariaLabel="Paliers" title="Paliers">
				<table />
			</Spreadsheet.NestedInput>,
		);
		expect(view.getByLabelText("Paliers").dataset.empty).toBe("true");
	});

	it("marks itself invalid so the cell raises its destructive ring", () => {
		const view = render(
			<Spreadsheet.NestedInput
				summary="1 palier"
				ariaLabel="Paliers"
				title="Paliers"
				invalid
			>
				<table />
			</Spreadsheet.NestedInput>,
		);
		expect(view.getByLabelText("Paliers").getAttribute("aria-invalid")).toBe(
			"true",
		);
	});
});
