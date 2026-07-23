// @vitest-environment jsdom
import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	type ColumnDef,
	DataTable,
	DataTableActions,
	DataTableFilters,
	DataTablePagination,
	DataTableSearch,
	DataTableToolbar,
	DataTableViewOptions,
	dataTableSelectionColumn,
	dataTableToCsv,
} from "#/components/data-table.tsx";

afterEach(cleanup);

interface Mission {
	reference: string;
	club: string;
	amount: number;
}

const missions: Mission[] = [
	{ reference: "MIS-001", club: "Stade Rochelais", amount: 180 },
	{ reference: "MIS-002", club: "RC Vannes", amount: 240 },
	{ reference: "MIS-003", club: "Provence Rugby", amount: 150 },
];

const columns: ColumnDef<Mission>[] = [
	{ accessorKey: "reference", header: "Reference" },
	{ accessorKey: "club", header: "Club" },
	{ accessorKey: "amount", header: "Amount" },
];

function bodyRows(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll("tbody [data-slot=table-row]"),
	);
}

describe("DataTable", () => {
	it("renders headers and one row per data item", () => {
		const screen = render(<DataTable columns={columns} data={missions} />);
		expect(screen.getByText("Reference")).toBeDefined();
		expect(screen.getByText("Club")).toBeDefined();
		const rows = bodyRows(screen);
		expect(rows).toHaveLength(3);
		expect(rows[0]?.textContent).toContain("MIS-001");
	});

	it("sorts when a sortable header is clicked and exposes aria-sort", () => {
		const screen = render(<DataTable columns={columns} data={missions} />);
		const clubHeader = screen.getByText("Club").closest("th");
		if (!clubHeader) throw new Error("missing Club header");

		fireEvent.click(clubHeader);
		expect(clubHeader.getAttribute("aria-sort")).toBe("ascending");
		expect(bodyRows(screen)[0]?.textContent).toContain("Provence Rugby");

		fireEvent.click(clubHeader);
		expect(clubHeader.getAttribute("aria-sort")).toBe("descending");
		expect(bodyRows(screen)[0]?.textContent).toContain("Stade Rochelais");
	});

	it("applies initialSorting", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				initialSorting={[{ id: "amount", desc: true }]}
			/>,
		);
		expect(bodyRows(screen)[0]?.textContent).toContain("MIS-002");
	});

	it("renders the default empty state when there are no rows", () => {
		const screen = render(<DataTable columns={columns} data={[]} />);
		expect(screen.getByText("No results")).toBeDefined();
	});

	it("renders a custom empty state", () => {
		const screen = render(
			<DataTable columns={columns} data={[]} emptyState="Nothing here" />,
		);
		expect(screen.getByText("Nothing here")).toBeDefined();
		expect(screen.queryByText("No results")).toBeNull();
	});

	it("invokes onRowClick with the row's data", () => {
		const onRowClick = vi.fn();
		const screen = render(
			<DataTable columns={columns} data={missions} onRowClick={onRowClick} />,
		);
		fireEvent.click(screen.getByText("RC Vannes"));
		expect(onRowClick).toHaveBeenCalledWith(missions[1]);
	});

	it("shows a loading overlay while keeping rows visible", () => {
		const screen = render(
			<DataTable columns={columns} data={missions} loading />,
		);
		expect(
			screen.baseElement.querySelector("[data-slot=spinner]"),
		).not.toBeNull();
		expect(bodyRows(screen)).toHaveLength(3);
	});

	it("makes the header sticky when stickyHeader is set", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				stickyHeader
				containerClassName="max-h-40"
			/>,
		);
		const header = screen.baseElement.querySelector("[data-slot=table-header]");
		expect(header?.classList.contains("sticky")).toBe(true);
		const container = screen.baseElement.querySelector(
			"[data-slot=table-container]",
		);
		expect(container?.classList.contains("overflow-y-auto")).toBe(true);
		expect(container?.classList.contains("max-h-40")).toBe(true);
	});

	it("renders sorted mobile cards and hides the table below md", () => {
		const onRowClick = vi.fn();
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				initialSorting={[{ id: "club", desc: false }]}
				onRowClick={onRowClick}
				renderMobileCard={(mission) => <span>{mission.reference} card</span>}
			/>,
		);
		const list = screen.baseElement.querySelector(
			"[data-slot=data-table-mobile-list]",
		);
		expect(list?.classList.contains("md:hidden")).toBe(true);
		const cards = Array.from(list?.querySelectorAll("li") ?? []);
		expect(cards).toHaveLength(3);
		// Cards follow the table's sorted row model, not the raw data order.
		expect(cards[0]?.textContent).toBe("MIS-003 card");
		fireEvent.click(screen.getByText("MIS-002 card"));
		expect(onRowClick).toHaveBeenCalledWith(missions[1]);
		const tableWrapper = screen.baseElement.querySelector(
			"[data-slot=table-container]",
		)?.parentElement;
		expect(tableWrapper?.classList.contains("hidden")).toBe(true);
		expect(tableWrapper?.classList.contains("md:block")).toBe(true);
	});

	it("renders the toolbar emplacement above the table", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				toolbar={
					<DataTableToolbar>
						<DataTableSearch placeholder="Search missions" />
						<DataTableFilters>filters</DataTableFilters>
						<DataTableActions>actions</DataTableActions>
					</DataTableToolbar>
				}
			/>,
		);
		expect(screen.getByPlaceholderText("Search missions")).toBeDefined();
		expect(
			screen.baseElement.querySelector("[data-slot=data-table-filters]"),
		).not.toBeNull();
		expect(
			screen.baseElement.querySelector("[data-slot=data-table-actions]"),
		).not.toBeNull();
	});
});

describe("DataTable selection", () => {
	const selectableColumns: ColumnDef<Mission>[] = [
		dataTableSelectionColumn<Mission>({
			selectAllLabel: "Select all missions",
			selectRowLabel: (mission) => `Select ${mission.reference}`,
		}),
		...columns,
	];

	it("selects a row through its checkbox and stamps data-selected", () => {
		const onRowSelectionChange = vi.fn();
		const screen = render(
			<DataTable
				columns={selectableColumns}
				data={missions}
				enableRowSelection
				onRowSelectionChange={onRowSelectionChange}
			/>,
		);
		fireEvent.click(screen.getByLabelText("Select MIS-002"));
		expect(onRowSelectionChange).toHaveBeenCalledWith({ 1: true });
		const selected = bodyRows(screen).filter((row) =>
			row.hasAttribute("data-selected"),
		);
		expect(selected).toHaveLength(1);
		expect(selected[0]?.textContent).toContain("MIS-002");
	});

	it("selects every row through the header checkbox", () => {
		const screen = render(
			<DataTable
				columns={selectableColumns}
				data={missions}
				enableRowSelection
			/>,
		);
		fireEvent.click(screen.getByLabelText("Select all missions"));
		expect(
			bodyRows(screen).every((row) => row.hasAttribute("data-selected")),
		).toBe(true);
	});

	it("does not trigger onRowClick from the selection checkbox", () => {
		const onRowClick = vi.fn();
		const screen = render(
			<DataTable
				columns={selectableColumns}
				data={missions}
				enableRowSelection
				onRowClick={onRowClick}
			/>,
		);
		fireEvent.click(screen.getByLabelText("Select MIS-001"));
		expect(onRowClick).not.toHaveBeenCalled();
	});

	it("supports controlled selection state", () => {
		const screen = render(
			<DataTable
				columns={selectableColumns}
				data={missions}
				enableRowSelection
				rowSelection={{ 0: true }}
			/>,
		);
		const selected = bodyRows(screen).filter((row) =>
			row.hasAttribute("data-selected"),
		);
		expect(selected).toHaveLength(1);
		expect(selected[0]?.textContent).toContain("MIS-001");
	});
});

describe("DataTablePagination", () => {
	it("renders the row range and windowed page numbers", () => {
		const screen = render(
			<DataTablePagination
				page={0}
				pageSize={10}
				total={100}
				onPageChange={() => {}}
			/>,
		);
		expect(screen.getByText("1-10 of 100")).toBeDefined();
		const current = screen.getByLabelText("Go to page 1");
		expect(current.getAttribute("aria-current")).toBe("page");
		expect(screen.getByLabelText("Go to page 5")).toBeDefined();
		expect(screen.getByLabelText("Go to page 10")).toBeDefined();
		// Pages inside the elided window are not rendered.
		expect(screen.queryByLabelText("Go to page 7")).toBeNull();
	});

	it("navigates with previous/next and direct page buttons", () => {
		const onPageChange = vi.fn();
		const screen = render(
			<DataTablePagination
				page={3}
				pageSize={10}
				total={100}
				onPageChange={onPageChange}
			/>,
		);
		fireEvent.click(screen.getByLabelText("Previous"));
		expect(onPageChange).toHaveBeenCalledWith(2);
		fireEvent.click(screen.getByLabelText("Next"));
		expect(onPageChange).toHaveBeenCalledWith(4);
		fireEvent.click(screen.getByLabelText("Go to page 10"));
		expect(onPageChange).toHaveBeenCalledWith(9);
	});

	it("disables previous on the first page and next on the last", () => {
		const first = render(
			<DataTablePagination
				page={0}
				pageSize={10}
				total={20}
				onPageChange={() => {}}
			/>,
		);
		expect(first.getByLabelText("Previous").hasAttribute("disabled")).toBe(
			true,
		);
		cleanup();
		const last = render(
			<DataTablePagination
				page={1}
				pageSize={10}
				total={20}
				onPageChange={() => {}}
			/>,
		);
		expect(last.getByLabelText("Next").hasAttribute("disabled")).toBe(true);
	});

	it("hides the controls on a single page but keeps the range", () => {
		const screen = render(
			<DataTablePagination
				page={0}
				pageSize={10}
				total={4}
				onPageChange={() => {}}
			/>,
		);
		expect(screen.getByText("1-4 of 4")).toBeDefined();
		expect(screen.queryByLabelText("Next")).toBeNull();
	});

	it("renders localized labels", () => {
		const screen = render(
			<DataTablePagination
				page={0}
				pageSize={10}
				total={30}
				onPageChange={() => {}}
				previousText="Précédent"
				nextText="Suivant"
				rangeText={({ from, to, total }) => `${from}–${to} sur ${total}`}
				pageLabel={(pageNumber) => `Aller à la page ${pageNumber}`}
			/>,
		);
		expect(screen.getByText("Précédent")).toBeDefined();
		expect(screen.getByText("Suivant")).toBeDefined();
		expect(screen.getByText("1–10 sur 30")).toBeDefined();
		expect(screen.getByLabelText("Aller à la page 2")).toBeDefined();
	});
});

describe("DataTable with pagination", () => {
	it("renders the pagination footer below the table", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				pagination={{
					page: 0,
					pageSize: 3,
					total: 9,
					onPageChange: () => {},
				}}
			/>,
		);
		expect(screen.getByText("1-3 of 9")).toBeDefined();
		const table = within(screen.baseElement as HTMLElement);
		expect(table.getByLabelText("Go to page 3")).toBeDefined();
	});
});

describe("DataTable row expansion", () => {
	const renderExpanded = (mission: Mission) => (
		<p data-testid="detail">{mission.club}</p>
	);

	// Regression: the body grew a leading cell for the expander while the header
	// did not, so every column rendered one place to the left of its heading.
	it("gives the expander column a matching header cell", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				renderExpandedRow={renderExpanded}
			/>,
		);
		const table = screen.baseElement.querySelector("table") as HTMLTableElement;
		const headerCells = table.querySelectorAll("thead tr th").length;
		const bodyCells = table.querySelectorAll("tbody tr:first-child td").length;
		expect(headerCells).toBe(bodyCells);
		expect(headerCells).toBe(columns.length + 1);
	});

	it("opens and closes the detail panel", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				renderExpandedRow={renderExpanded}
			/>,
		);
		expect(screen.queryByTestId("detail")).toBeNull();
		fireEvent.click(screen.getAllByRole("button", { name: "Expand row" })[0]);
		expect(screen.getByTestId("detail").textContent).toBe("Stade Rochelais");
		fireEvent.click(screen.getByRole("button", { name: "Collapse row" }));
		expect(screen.queryByTestId("detail")).toBeNull();
	});

	it("spans the detail panel across every column, expander included", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				renderExpandedRow={renderExpanded}
			/>,
		);
		fireEvent.click(screen.getAllByRole("button", { name: "Expand row" })[0]);
		const panel = screen.baseElement.querySelector(
			"[data-slot=data-table-expanded-row] td",
		);
		expect(panel?.getAttribute("colspan")).toBe(String(columns.length + 1));
	});

	it("leaves rows unexpandable when no panel is supplied", () => {
		const screen = render(<DataTable columns={columns} data={missions} />);
		expect(screen.queryByRole("button", { name: "Expand row" })).toBeNull();
	});
});

describe("DataTable column resizing", () => {
	it("offers a focusable handle per column, off by default", () => {
		const plain = render(<DataTable columns={columns} data={missions} />);
		expect(
			plain.baseElement.querySelectorAll(
				"[data-slot=data-table-resize-handle]",
			),
		).toHaveLength(0);
		cleanup();
		const resizable = render(
			<DataTable columns={columns} data={missions} enableColumnResizing />,
		);
		const handles = resizable.baseElement.querySelectorAll(
			"[data-slot=data-table-resize-handle]",
		);
		expect(handles).toHaveLength(columns.length);
		expect(handles[0]?.tagName).toBe("BUTTON");
	});

	it("reports a width change from the keyboard", () => {
		const onColumnSizingChange = vi.fn();
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				enableColumnResizing
				onColumnSizingChange={onColumnSizingChange}
			/>,
		);
		const handle = screen.baseElement.querySelector(
			"[data-slot=data-table-resize-handle]",
		) as HTMLButtonElement;
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		expect(onColumnSizingChange).toHaveBeenCalledTimes(1);
		expect(Object.values(onColumnSizingChange.mock.calls[0][0])[0]).toBe(
			150 + 16,
		);
	});

	// The sort handler lives on the whole header cell, so a drag that starts on
	// the handle must not also reorder the rows.
	it("does not sort when the handle is clicked", () => {
		const screen = render(
			<DataTable columns={columns} data={missions} enableColumnResizing />,
		);
		const handle = screen.baseElement.querySelector(
			"[data-slot=data-table-resize-handle]",
		) as HTMLButtonElement;
		fireEvent.click(handle);
		const header = handle.closest("th");
		expect(header?.getAttribute("aria-sort")).toBeNull();
	});
});

describe("DataTable column pinning", () => {
	it("freezes the named columns against each edge", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				columnPinning={{ left: ["reference"], right: ["amount"] }}
			/>,
		);
		const cells = screen.baseElement.querySelectorAll<HTMLTableCellElement>(
			"tbody tr:first-child td",
		);
		expect(cells[0]?.style.position).toBe("sticky");
		expect(cells[0]?.style.left).toBe("0px");
		expect(cells[2]?.style.position).toBe("sticky");
		expect(cells[2]?.style.right).toBe("0px");
		// The middle column pans normally.
		expect(cells[1]?.style.position).toBe("");
	});

	// A pinned cell that hard-codes its background stops following the row's
	// hover, selection and expansion states.
	it("lets pinned cells inherit the row background", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				columnPinning={{ left: ["reference"] }}
			/>,
		);
		const cell = screen.baseElement.querySelector("tbody tr:first-child td");
		expect(cell?.className).toContain("bg-inherit");
	});
});

describe("DataTable column visibility and export", () => {
	it("hides a column through the view options menu", () => {
		const screen = render(
			<DataTable
				columns={columns}
				data={missions}
				toolbar={(table) => <DataTableViewOptions table={table} />}
			/>,
		);
		expect(screen.getAllByRole("columnheader")).toHaveLength(columns.length);
		fireEvent.click(screen.getByRole("button", { name: "Columns" }));
		fireEvent.click(screen.getByRole("menuitemcheckbox", { name: "Club" }));
		expect(screen.getAllByRole("columnheader")).toHaveLength(
			columns.length - 1,
		);
	});

	it("serializes the visible, sorted rows to CSV", () => {
		let csv = "";
		render(
			<DataTable
				columns={columns}
				data={missions}
				toolbar={(table) => {
					csv = dataTableToCsv(table);
					return null;
				}}
			/>,
		);
		const lines = csv.split("\r\n");
		expect(lines[0]).toBe("Reference,Club,Amount");
		expect(lines[1]).toBe("MIS-001,Stade Rochelais,180");
		expect(lines).toHaveLength(missions.length + 1);
	});

	it("quotes fields containing a comma or a quote", () => {
		let csv = "";
		render(
			<DataTable
				columns={[{ accessorKey: "club", header: "Club" }]}
				data={[{ reference: "x", club: 'Rugby, "the club"', amount: 0 }]}
				toolbar={(table) => {
					csv = dataTableToCsv(table);
					return null;
				}}
			/>,
		);
		expect(csv.split("\r\n")[1]).toBe('"Rugby, ""the club"""');
	});
});

describe("DataTable global filter", () => {
	it("narrows the rows to the matching ones", () => {
		const screen = render(
			<DataTable columns={columns} data={missions} globalFilter="Vannes" />,
		);
		const rows = screen.baseElement.querySelectorAll("tbody tr");
		expect(rows).toHaveLength(1);
		expect(rows[0]?.textContent).toContain("MIS-002");
	});
});
