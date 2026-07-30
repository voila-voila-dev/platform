// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Table } from "#/table/components/table.tsx";

afterEach(cleanup);

function Fixture() {
	return (
		<Table.Root>
			<Table.Caption>Recent projects for your workspace.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Reference</Table.Head>
					<Table.Head>Client</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				<Table.Row data-selected>
					<Table.Cell>PRJ-001</Table.Cell>
					<Table.Cell>Northwind Studio</Table.Cell>
				</Table.Row>
				<Table.Row>
					<Table.Cell>PRJ-002</Table.Cell>
					<Table.Cell>Globex Labs</Table.Cell>
				</Table.Row>
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colSpan={2}>Total</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
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
			<Table.Root className="custom-table-class" containerClassName="max-h-96">
				<Table.Body />
			</Table.Root>,
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

describe("Table.Row", () => {
	it("scopes hover highlighting to body rows", () => {
		const screen = render(<Fixture />);
		const row = screen.getByText("PRJ-001").closest("tr");
		expect(row?.classList.contains("in-[tbody]:hover:bg-muted/50")).toBe(true);
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
					<Table.Row className="custom-row-class" />
				</tbody>
			</table>,
		);
		const row = screen.baseElement.querySelector("[data-slot=table-row]");
		expect(row?.classList.contains("custom-row-class")).toBe(true);
	});
});

describe("Table.Head and Table.Cell", () => {
	it("keep content on one line by default and accept overrides", () => {
		const screen = render(
			<table>
				<thead>
					<tr>
						<Table.Head>Reference</Table.Head>
					</tr>
				</thead>
				<tbody>
					<tr>
						<Table.Cell className="whitespace-normal">
							A long project description that should wrap
						</Table.Cell>
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
