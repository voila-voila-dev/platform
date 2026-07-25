// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "#/components/table.tsx";

afterEach(cleanup);

function Fixture() {
	return (
		<Table>
			<TableCaption>Recent projects for your workspace.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Reference</TableHead>
					<TableHead>Client</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow data-selected>
					<TableCell>PRJ-001</TableCell>
					<TableCell>Northwind Studio</TableCell>
				</TableRow>
				<TableRow>
					<TableCell>PRJ-002</TableCell>
					<TableCell>Globex Labs</TableCell>
				</TableRow>
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={2}>Total</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}

describe("Table", () => {
	it("renders a table inside a horizontal scroll container", () => {
		const screen = render(<Fixture />);
		const table = screen.getByRole("table");
		expect(table.getAttribute("data-slot")).toBe("table");
		const container = table.parentElement;
		expect(container?.getAttribute("data-slot")).toBe("table-container");
		expect(container?.classList.contains("overflow-x-auto")).toBe(true);
	});

	it("merges className on the table and containerClassName on the wrapper", () => {
		const screen = render(
			<Table className="custom-table-class" containerClassName="max-h-96">
				<TableBody />
			</Table>,
		);
		const table = screen.getByRole("table");
		expect(table.classList.contains("custom-table-class")).toBe(true);
		expect(table.classList.contains("max-h-96")).toBe(false);
		expect(table.parentElement?.classList.contains("max-h-96")).toBe(true);
		expect(table.parentElement?.classList.contains("custom-table-class")).toBe(
			false,
		);
	});

	it("renders semantic table sections with their slots", () => {
		const screen = render(<Fixture />);
		const table = screen.getByRole("table");
		for (const [slot, tagName] of [
			["table-header", "THEAD"],
			["table-body", "TBODY"],
			["table-footer", "TFOOT"],
			["table-caption", "CAPTION"],
		] as const) {
			const element = table.querySelector(`[data-slot=${slot}]`);
			expect(element?.tagName).toBe(tagName);
		}
		expect(screen.getAllByRole("columnheader").length).toBe(2);
		expect(screen.getByText("Northwind Studio").tagName).toBe("TD");
	});
});

describe("TableRow", () => {
	it("scopes hover highlighting to body rows", () => {
		const screen = render(<Fixture />);
		const row = screen.getByText("PRJ-001").closest("tr");
		expect(row?.classList.contains("[tbody_&]:hover:bg-muted/50")).toBe(true);
		expect(row?.classList.contains("hover:bg-muted/50")).toBe(false);
	});

	it("highlights rows stamped with data-selected", () => {
		const screen = render(<Fixture />);
		const selected = screen.getByText("PRJ-001").closest("tr");
		expect(selected?.hasAttribute("data-selected")).toBe(true);
		expect(selected?.classList.contains("data-selected:bg-muted")).toBe(true);
		const unselected = screen.getByText("PRJ-002").closest("tr");
		expect(unselected?.hasAttribute("data-selected")).toBe(false);
	});

	it("merges className", () => {
		const screen = render(
			<table>
				<tbody>
					<TableRow className="custom-row-class" />
				</tbody>
			</table>,
		);
		const row = screen.baseElement.querySelector("[data-slot=table-row]");
		expect(row?.classList.contains("custom-row-class")).toBe(true);
	});
});

describe("TableHead and TableCell", () => {
	it("keep content on one line by default and accept overrides", () => {
		const screen = render(
			<table>
				<thead>
					<tr>
						<TableHead>Reference</TableHead>
					</tr>
				</thead>
				<tbody>
					<tr>
						<TableCell className="whitespace-normal">
							A long project description that should wrap
						</TableCell>
					</tr>
				</tbody>
			</table>,
		);
		const head = screen.getByRole("columnheader");
		expect(head.classList.contains("whitespace-nowrap")).toBe(true);
		const cell = screen.getByRole("cell");
		expect(cell.classList.contains("whitespace-normal")).toBe(true);
		expect(cell.classList.contains("whitespace-nowrap")).toBe(false);
	});
});
