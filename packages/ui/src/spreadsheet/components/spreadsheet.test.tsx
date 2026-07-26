// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { type MouseEventHandler, type ReactNode, useState } from "react";
import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { Input } from "#/input/components/input.tsx";
import {
	Spreadsheet,
	type SpreadsheetPasteData,
} from "#/spreadsheet/components/spreadsheet.tsx";

afterEach(cleanup);

// jsdom has no matchMedia and the root's `useIsMobile` needs one on every
// render. Assigned directly (not vi.stubGlobal: a later `unstubAllGlobals`
// would tear it down mid-file). `matches` re-reads innerWidth so tests drive
// the breakpoint by resizing the window.
beforeAll(() => {
	window.matchMedia = ((query: string) =>
		({
			matches: window.innerWidth < 768,
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {},
		}) as unknown as MediaQueryList) as typeof window.matchMedia;
});

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

function renderFixture(options?: {
	stickyHeader?: boolean;
	invalid?: boolean;
	onCellClick?: MouseEventHandler<HTMLTableCellElement>;
	onAddRow?: MouseEventHandler<HTMLButtonElement>;
	addRowDisabled?: boolean;
}) {
	return render(
		<Spreadsheet.Root
			stickyHeader={options?.stickyHeader}
			containerClassName="max-h-40"
			className="text-xs"
		>
			<Spreadsheet.Columns>
				<Spreadsheet.Column width={160} />
				<Spreadsheet.Column />
				<Spreadsheet.Column width="3rem" />
			</Spreadsheet.Columns>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head columnId="name">Name</Spreadsheet.Head>
					<Spreadsheet.Head>Reference</Spreadsheet.Head>
					<Spreadsheet.Head>
						<span className="sr-only">Actions</span>
					</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				<Spreadsheet.Row invalid={options?.invalid}>
					<Spreadsheet.Cell onClick={options?.onCellClick}>
						<Input aria-label="Name" defaultValue="Gants nitrile" />
					</Spreadsheet.Cell>
					<Spreadsheet.CellText>ESS-001</Spreadsheet.CellText>
					<Spreadsheet.RowActions>
						<button type="button" aria-label="Delete row" />
					</Spreadsheet.RowActions>
				</Spreadsheet.Row>
				<Spreadsheet.AddRow
					colSpan={3}
					onClick={options?.onAddRow}
					disabled={options?.addRowDisabled}
				>
					Add a row
				</Spreadsheet.AddRow>
			</Spreadsheet.Body>
		</Spreadsheet.Root>,
	);
}

describe("Spreadsheet.Root", () => {
	it("renders the scroll container and forwards containerClassName/className", () => {
		const screen = renderFixture();
		const container = screen.baseElement.querySelector(
			"[data-slot=spreadsheet-container]",
		);
		expect(container?.className).toContain("max-h-40");
		const table = screen.baseElement.querySelector(
			"table[data-slot=spreadsheet]",
		);
		expect(table?.className).toContain("text-xs");
	});

	it("stamps a data-slot on every part", () => {
		const screen = renderFixture();
		for (const slot of [
			"spreadsheet-container",
			"spreadsheet",
			"spreadsheet-columns",
			"spreadsheet-column",
			"spreadsheet-header",
			"spreadsheet-head",
			"spreadsheet-body",
			"spreadsheet-row",
			"spreadsheet-cell",
			"spreadsheet-cell-text",
			"spreadsheet-row-actions",
			"spreadsheet-add-row",
		]) {
			expect(
				screen.baseElement.querySelector(`[data-slot=${slot}]`),
				slot,
			).not.toBeNull();
		}
	});

	it("renders column widths on <col> elements", () => {
		const screen = renderFixture();
		const cols = screen.baseElement.querySelectorAll(
			"[data-slot=spreadsheet-column]",
		);
		expect((cols[0] as HTMLElement).style.width).toBe("160px");
		expect((cols[1] as HTMLElement).style.width).toBe("");
		expect((cols[2] as HTMLElement).style.width).toBe("3rem");
	});

	it("marks header cells as column headers", () => {
		const screen = renderFixture();
		const heads = screen.baseElement.querySelectorAll(
			"th[data-slot=spreadsheet-head]",
		);
		expect(heads).toHaveLength(3);
		for (const head of heads) {
			expect(head.getAttribute("scope")).toBe("col");
		}
		expect(heads[0]?.getAttribute("data-column-id")).toBe("name");
	});

	it("stamps data-invalid on invalid rows only", () => {
		const invalid = renderFixture({ invalid: true });
		expect(
			invalid.baseElement
				.querySelector("[data-slot=spreadsheet-row]")
				?.getAttribute("data-invalid"),
		).toBe("true");
		cleanup();
		const valid = renderFixture();
		expect(
			valid.baseElement
				.querySelector("[data-slot=spreadsheet-row]")
				?.hasAttribute("data-invalid"),
		).toBe(false);
	});

	it("forwards a click on the cell's empty space to the inner control", () => {
		const screen = renderFixture();
		const cell = screen.baseElement.querySelector(
			"[data-slot=spreadsheet-cell]",
		);
		if (!cell) throw new Error("missing cell");
		fireEvent.click(cell);
		expect(document.activeElement).toBe(screen.getByLabelText("Name"));
	});

	it("leaves clicks on interactive content alone", () => {
		const screen = render(
			<Spreadsheet.Root>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.Cell>
							<Input aria-label="Quantity" defaultValue="10" />
							<button type="button" aria-label="Clear" />
						</Spreadsheet.Cell>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		fireEvent.click(screen.getByLabelText("Clear"));
		expect(document.activeElement).not.toBe(screen.getByLabelText("Quantity"));
	});

	it("lets a consumer onClick cancel the focus forwarding", () => {
		const screen = renderFixture({
			onCellClick: (event) => event.preventDefault(),
		});
		const cell = screen.baseElement.querySelector(
			"[data-slot=spreadsheet-cell]",
		);
		if (!cell) throw new Error("missing cell");
		fireEvent.click(cell);
		expect(document.activeElement).not.toBe(screen.getByLabelText("Name"));
	});

	it("keeps a controlled input in a cell alive", () => {
		function Harness() {
			const [value, setValue] = useState("Gants");
			return (
				<Spreadsheet.Root>
					<Spreadsheet.Body>
						<Spreadsheet.Row>
							<Spreadsheet.Cell>
								<Input
									aria-label="Name"
									value={value}
									onChange={(event) => setValue(event.target.value)}
								/>
							</Spreadsheet.Cell>
						</Spreadsheet.Row>
					</Spreadsheet.Body>
				</Spreadsheet.Root>
			);
		}
		const screen = render(<Harness />);
		const input = screen.getByLabelText("Name") as HTMLInputElement;
		fireEvent.change(input, { target: { value: "Gants nitrile" } });
		expect(input.value).toBe("Gants nitrile");
	});

	it("keeps aria-invalid on the control itself", () => {
		const screen = render(
			<Spreadsheet.Root>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.Cell>
							<Input aria-label="Price" aria-invalid />
						</Spreadsheet.Cell>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		expect(screen.getByLabelText("Price").getAttribute("aria-invalid")).toBe(
			"true",
		);
	});

	it("renders the add-row affordance as a real button spanning all columns", () => {
		const onAddRow = vi.fn();
		const screen = renderFixture({ onAddRow });
		const row = screen.baseElement.querySelector(
			"[data-slot=spreadsheet-add-row]",
		);
		const cell = row?.querySelector("td");
		expect(cell?.getAttribute("colspan")).toBe("3");
		const button = screen.getByRole("button", { name: "Add a row" });
		expect(button.getAttribute("type")).toBe("button");
		fireEvent.click(button);
		expect(onAddRow).toHaveBeenCalledTimes(1);
	});

	it("disables the add-row button", () => {
		const screen = renderFixture({ addRowDisabled: true });
		expect(screen.getByRole("button", { name: "Add a row" })).toHaveProperty(
			"disabled",
			true,
		);
	});

	it("pins the header only when stickyHeader is set", () => {
		const sticky = renderFixture({ stickyHeader: true });
		expect(
			sticky.baseElement.querySelector("[data-slot=spreadsheet-header]")
				?.className,
		).toContain("sticky");
		cleanup();
		const plain = renderFixture();
		expect(
			plain.baseElement.querySelector("[data-slot=spreadsheet-header]")
				?.className,
		).not.toContain("sticky");
	});

	it("cycles the sort state through asc, desc, none", () => {
		const onSortChange = vi.fn();
		const renderSortable = (
			sort: {
				columnId: string;
				direction: "asc" | "desc";
			} | null,
		) =>
			render(
				<Spreadsheet.Root sort={sort} onSortChange={onSortChange}>
					<Spreadsheet.Header>
						<tr>
							<Spreadsheet.Head columnId="name" sortable>
								Name
							</Spreadsheet.Head>
						</tr>
					</Spreadsheet.Header>
				</Spreadsheet.Root>,
			);

		let screen = renderSortable(null);
		expect(
			screen.baseElement
				.querySelector("th[data-column-id=name]")
				?.hasAttribute("aria-sort"),
		).toBe(false);
		fireEvent.click(screen.getByRole("button", { name: "Name" }));
		expect(onSortChange).toHaveBeenLastCalledWith({
			columnId: "name",
			direction: "asc",
		});
		cleanup();

		screen = renderSortable({ columnId: "name", direction: "asc" });
		expect(
			screen.baseElement
				.querySelector("th[data-column-id=name]")
				?.getAttribute("aria-sort"),
		).toBe("ascending");
		fireEvent.click(screen.getByRole("button", { name: "Name" }));
		expect(onSortChange).toHaveBeenLastCalledWith({
			columnId: "name",
			direction: "desc",
		});
		cleanup();

		screen = renderSortable({ columnId: "name", direction: "desc" });
		expect(
			screen.baseElement
				.querySelector("th[data-column-id=name]")
				?.getAttribute("aria-sort"),
		).toBe("descending");
		fireEvent.click(screen.getByRole("button", { name: "Name" }));
		expect(onSortChange).toHaveBeenLastCalledWith(null);
	});

	it("resizes a column from the keyboard and switches to a fixed layout", () => {
		const screen = render(
			<Spreadsheet.Root>
				<Spreadsheet.Columns>
					<Spreadsheet.Column columnId="name" />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head columnId="name" resizable>
							Name
						</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
			</Spreadsheet.Root>,
		);
		const table = screen.baseElement.querySelector(
			"table[data-slot=spreadsheet]",
		);
		expect(table?.className).not.toContain("table-fixed");
		const handle = screen.getByRole("separator", { name: "Resize column" });
		// jsdom measures the header at 0px, so the first step clamps to the
		// 48px minimum; the second one grows from there.
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		const col = screen.baseElement.querySelector<HTMLElement>(
			"[data-slot=spreadsheet-column]",
		);
		expect(col?.style.width).toBe("48px");
		expect(table?.className).toContain("table-fixed");
		fireEvent.keyDown(handle, { key: "ArrowRight" });
		expect(col?.style.width).toBe("64px");
		fireEvent.keyDown(handle, { key: "ArrowLeft" });
		expect(col?.style.width).toBe("48px");
	});

	it("reports resized widths through a controlled columnSizing", () => {
		const onColumnSizingChange = vi.fn();
		const screen = render(
			<Spreadsheet.Root
				columnSizing={{ name: 100 }}
				onColumnSizingChange={onColumnSizingChange}
			>
				<Spreadsheet.Columns>
					<Spreadsheet.Column columnId="name" />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head columnId="name" resizable>
							Name
						</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
			</Spreadsheet.Root>,
		);
		const col = screen.baseElement.querySelector<HTMLElement>(
			"[data-slot=spreadsheet-column]",
		);
		expect(col?.style.width).toBe("100px");
		fireEvent.keyDown(
			screen.getByRole("separator", { name: "Resize column" }),
			{ key: "ArrowRight" },
		);
		expect(onColumnSizingChange).toHaveBeenCalledWith({ name: 116 });
		// Controlled: the col only moves when the prop does.
		expect(col?.style.width).toBe("100px");
	});

	it("moves a column with Alt+arrows under a controlled order", () => {
		const onColumnOrderChange = vi.fn();
		const screen = render(
			<Spreadsheet.Root
				columnOrder={["name", "reference"]}
				onColumnOrderChange={onColumnOrderChange}
			>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head columnId="name">Name</Spreadsheet.Head>
						<Spreadsheet.Head columnId="reference">Reference</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
			</Spreadsheet.Root>,
		);
		const nameHead = screen.baseElement.querySelector(
			"th[data-column-id=name]",
		);
		if (!nameHead) throw new Error("missing head");
		expect(nameHead.getAttribute("tabindex")).toBe("0");
		fireEvent.keyDown(nameHead, { key: "ArrowLeft", altKey: true });
		expect(onColumnOrderChange).not.toHaveBeenCalled();
		fireEvent.keyDown(nameHead, { key: "ArrowRight", altKey: true });
		expect(onColumnOrderChange).toHaveBeenCalledWith(["reference", "name"]);
	});

	it("moves a row from the keyboard through grab, arrows and drop", () => {
		const onRowMove = vi.fn();
		const screen = render(
			<Spreadsheet.Root onRowMove={onRowMove}>
				<Spreadsheet.Body>
					{[0, 1, 2].map((index) => (
						<Spreadsheet.Row key={index}>
							<Spreadsheet.DragHandle
								index={index}
								aria-label={`Reorder row ${index + 1}`}
							/>
							<Spreadsheet.CellText>Row {index + 1}</Spreadsheet.CellText>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		const handle = screen.getByRole("button", { name: "Reorder row 1" });
		fireEvent.keyDown(handle, { key: " " });
		expect(screen.getByRole("status").textContent).toContain("Row 1 grabbed");
		fireEvent.keyDown(handle, { key: "ArrowDown" });
		fireEvent.keyDown(handle, { key: "ArrowDown" });
		fireEvent.keyDown(handle, { key: "ArrowDown" });
		expect(screen.getByRole("status").textContent).toContain("position 3 of 3");
		fireEvent.keyDown(handle, { key: " " });
		expect(onRowMove).toHaveBeenCalledWith(0, 2);
	});

	it("cancels a keyboard row move with Escape", () => {
		const onRowMove = vi.fn();
		const screen = render(
			<Spreadsheet.Root onRowMove={onRowMove}>
				<Spreadsheet.Body>
					{[0, 1].map((index) => (
						<Spreadsheet.Row key={index}>
							<Spreadsheet.DragHandle
								index={index}
								aria-label={`Reorder row ${index + 1}`}
							/>
							<Spreadsheet.CellText>Row {index + 1}</Spreadsheet.CellText>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		const handle = screen.getByRole("button", { name: "Reorder row 1" });
		fireEvent.keyDown(handle, { key: " " });
		fireEvent.keyDown(handle, { key: "ArrowDown" });
		fireEvent.keyDown(handle, { key: "Escape" });
		expect(onRowMove).not.toHaveBeenCalled();
		expect(screen.getByRole("status").textContent).toBe("Row move cancelled.");
	});

	it("renders rows x columns of skeleton placeholders", () => {
		const screen = render(
			<Spreadsheet.Root>
				<Spreadsheet.Body>
					<Spreadsheet.Skeleton rows={4} columns={3} />
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		const rows = screen.baseElement.querySelectorAll(
			"[data-slot=spreadsheet-skeleton-row]",
		);
		expect(rows).toHaveLength(4);
		expect(rows[0]?.querySelectorAll("[data-slot=skeleton]")).toHaveLength(3);
	});
});

function renderGridFixture(options?: {
	onPasteData?: (data: SpreadsheetPasteData) => void;
}) {
	return render(
		<Spreadsheet.Root gridNavigation onPasteData={options?.onPasteData}>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head>Name</Spreadsheet.Head>
					<Spreadsheet.Head>Reference</Spreadsheet.Head>
					<Spreadsheet.Head>Quantity</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				{[0, 1, 2].map((row) => (
					<Spreadsheet.Row key={row}>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${row + 1} name`}
								defaultValue={`Name ${row + 1}`}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell value={`REF-${row + 1}`}>
							<Input
								aria-label={`Row ${row + 1} reference`}
								defaultValue={`ref-input-${row + 1}`}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.CellText>Q{row + 1}</Spreadsheet.CellText>
					</Spreadsheet.Row>
				))}
			</Spreadsheet.Body>
		</Spreadsheet.Root>,
	);
}

function gridCells(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll<HTMLTableCellElement>("tbody td"),
	);
}

describe("Spreadsheet.Root grid navigation", () => {
	it("upgrades the table to a grid with aria counts and indexes", () => {
		const screen = renderGridFixture();
		const table = screen.baseElement.querySelector(
			"table[data-slot=spreadsheet]",
		);
		expect(table?.getAttribute("role")).toBe("grid");
		expect(table?.getAttribute("aria-multiselectable")).toBe("true");
		expect(table?.getAttribute("aria-rowcount")).toBe("4");
		expect(table?.getAttribute("aria-colcount")).toBe("3");
		expect(
			screen.baseElement
				.querySelector("thead tr")
				?.getAttribute("aria-rowindex"),
		).toBe("1");
		const rows = screen.baseElement.querySelectorAll(
			"[data-slot=spreadsheet-row]",
		);
		expect(rows[0]?.getAttribute("aria-rowindex")).toBe("2");
		expect(rows[2]?.getAttribute("aria-rowindex")).toBe("4");
		expect(gridCells(screen)[1]?.getAttribute("aria-colindex")).toBe("2");
	});

	it("leaves the table alone when gridNavigation is off", () => {
		const screen = renderFixture();
		const table = screen.baseElement.querySelector(
			"table[data-slot=spreadsheet]",
		);
		expect(table?.hasAttribute("role")).toBe(false);
		expect(
			screen.baseElement.querySelector(
				"[data-slot=spreadsheet-cell][tabindex]",
			),
		).toBeNull();
	});

	it("keeps exactly one cell tabbable and removes controls from tab order", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		expect(cells.map((cell) => cell.getAttribute("tabindex"))).toEqual([
			"0",
			...Array.from({ length: 8 }, () => "-1"),
		]);
		for (const input of screen.baseElement.querySelectorAll("tbody input")) {
			expect(input.getAttribute("tabindex")).toBe("-1");
		}
	});

	it("moves the focused cell with the arrow keys and roves the tabindex", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, { key: "ArrowRight" });
		expect(document.activeElement).toBe(cells[1]);
		expect(cells[1]?.getAttribute("tabindex")).toBe("0");
		expect(cells[0]?.getAttribute("tabindex")).toBe("-1");
		fireEvent.keyDown(cells[1] as HTMLElement, { key: "ArrowDown" });
		expect(document.activeElement).toBe(cells[4]);
		fireEvent.keyDown(cells[4] as HTMLElement, { key: "ArrowLeft" });
		expect(document.activeElement).toBe(cells[3]);
		fireEvent.keyDown(cells[3] as HTMLElement, { key: "ArrowUp" });
		expect(document.activeElement).toBe(cells[0]);
	});

	it("jumps with Home, End, PageDown and Ctrl+Home", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[4]?.focus();
		fireEvent.keyDown(cells[4] as HTMLElement, { key: "End" });
		expect(document.activeElement).toBe(cells[5]);
		fireEvent.keyDown(cells[5] as HTMLElement, { key: "Home" });
		expect(document.activeElement).toBe(cells[3]);
		fireEvent.keyDown(cells[3] as HTMLElement, { key: "PageDown" });
		expect(document.activeElement).toBe(cells[6]);
		fireEvent.keyDown(cells[6] as HTMLElement, { key: "Home", ctrlKey: true });
		expect(document.activeElement).toBe(cells[0]);
	});

	it("enters edit mode with Enter and returns to the cell with Escape", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, { key: "Enter" });
		const input = screen.getByLabelText("Row 1 name");
		expect(document.activeElement).toBe(input);
		fireEvent.keyDown(input, { key: "Escape" });
		expect(document.activeElement).toBe(cells[0]);
	});

	it("starts editing from a printable key", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, { key: "a" });
		expect(document.activeElement).toBe(screen.getByLabelText("Row 1 name"));
	});

	it("commits with Enter while editing and moves down a row", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, { key: "Enter" });
		fireEvent.keyDown(screen.getByLabelText("Row 1 name"), { key: "Enter" });
		expect(document.activeElement).toBe(cells[3]);
	});

	it("moves to the next cell with Tab while editing", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, { key: "Enter" });
		fireEvent.keyDown(screen.getByLabelText("Row 1 name"), { key: "Tab" });
		expect(document.activeElement).toBe(cells[1]);
		fireEvent.keyDown(cells[1] as HTMLElement, { key: "Enter" });
		fireEvent.keyDown(screen.getByLabelText("Row 1 reference"), {
			key: "Tab",
			shiftKey: true,
		});
		expect(document.activeElement).toBe(cells[0]);
	});

	it("extends the selection with Shift+arrows and clears it with Escape", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, {
			key: "ArrowRight",
			shiftKey: true,
		});
		fireEvent.keyDown(cells[1] as HTMLElement, {
			key: "ArrowDown",
			shiftKey: true,
		});
		expect(document.activeElement).toBe(cells[4]);
		const selected = cells.map((cell) => cell.getAttribute("aria-selected"));
		expect(selected).toEqual([
			"true",
			"true",
			"false",
			"true",
			"true",
			"false",
			"false",
			"false",
			"false",
		]);
		expect(cells[0]?.hasAttribute("data-grid-selected")).toBe(true);
		fireEvent.keyDown(cells[4] as HTMLElement, { key: "Escape" });
		expect(
			cells.every((cell) => cell.getAttribute("aria-selected") === "false"),
		).toBe(true);
	});

	it("copies the selected range as TSV", () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(window.navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[0]?.focus();
		fireEvent.keyDown(cells[0] as HTMLElement, {
			key: "ArrowRight",
			shiftKey: true,
		});
		fireEvent.keyDown(cells[1] as HTMLElement, {
			key: "ArrowDown",
			shiftKey: true,
		});
		fireEvent.keyDown(cells[4] as HTMLElement, { key: "c", metaKey: true });
		// The declared `value` prop wins over the inner input's DOM value.
		expect(writeText).toHaveBeenCalledWith("Name 1\tREF-1\nName 2\tREF-2");
	});

	it("copies the active cell when nothing is selected, falling back to text", () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.defineProperty(window.navigator, "clipboard", {
			value: { writeText },
			configurable: true,
		});
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		cells[2]?.focus();
		fireEvent.keyDown(cells[2] as HTMLElement, { key: "c", ctrlKey: true });
		expect(writeText).toHaveBeenCalledWith("Q1");
	});

	it("emits onPasteData with the parsed TSV matrix and paste origin", () => {
		const onPasteData = vi.fn();
		const screen = renderGridFixture({ onPasteData });
		const cells = gridCells(screen);
		cells[4]?.focus();
		fireEvent.paste(cells[4] as HTMLElement, {
			clipboardData: { getData: () => "a\tb\nc\td\n" },
		});
		expect(onPasteData).toHaveBeenCalledWith({
			startRow: 1,
			startColumn: 1,
			values: [
				["a", "b"],
				["c", "d"],
			],
		});
	});

	it("leaves paste alone while editing a control", () => {
		const onPasteData = vi.fn();
		const screen = renderGridFixture({ onPasteData });
		const input = screen.getByLabelText("Row 1 name");
		input.focus();
		fireEvent.paste(input, {
			clipboardData: { getData: () => "a\tb" },
		});
		expect(onPasteData).not.toHaveBeenCalled();
	});

	it("focuses the cell itself on empty-space clicks in grid mode", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		fireEvent.click(cells[0] as HTMLElement);
		expect(document.activeElement).toBe(cells[0]);
	});

	it("extends the selection with a pointer drag across cells", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		// Text cells: a drag starting on an input belongs to the input.
		fireEvent.pointerDown(cells[2] as HTMLElement, {
			pointerId: 1,
			button: 0,
		});
		fireEvent.pointerMove(cells[5] as HTMLElement, { pointerId: 1 });
		expect(cells[2]?.getAttribute("aria-selected")).toBe("true");
		expect(cells[5]?.getAttribute("aria-selected")).toBe("true");
		expect(cells[8]?.getAttribute("aria-selected")).toBe("false");
		fireEvent.pointerUp(cells[5] as HTMLElement, { pointerId: 1 });
		// A later move without a pressed pointer must not keep selecting.
		fireEvent.pointerMove(cells[8] as HTMLElement, { pointerId: 1 });
		expect(cells[8]?.getAttribute("aria-selected")).toBe("false");
	});

	it("ignores pointer drags starting on interactive content", () => {
		const screen = renderGridFixture();
		const cells = gridCells(screen);
		fireEvent.pointerDown(screen.getByLabelText("Row 1 name"), {
			pointerId: 1,
			button: 0,
		});
		fireEvent.pointerMove(cells[4] as HTMLElement, { pointerId: 1 });
		expect(
			cells.every((cell) => cell.getAttribute("aria-selected") === "false"),
		).toBe(true);
	});
});

function renderVirtualFixture(options?: { gridNavigation?: boolean }) {
	return render(
		<Spreadsheet.Root
			stickyHeader
			containerClassName="max-h-52"
			gridNavigation={options?.gridNavigation}
		>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head>Name</Spreadsheet.Head>
					<Spreadsheet.Head>Reference</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				<Spreadsheet.VirtualRows count={500}>
					{(index) => (
						<Spreadsheet.Row key={index}>
							<Spreadsheet.Cell>
								<Input
									aria-label={`Row ${index + 1} name`}
									defaultValue={`Item ${index + 1}`}
								/>
							</Spreadsheet.Cell>
							<Spreadsheet.CellText>REF-{index + 1}</Spreadsheet.CellText>
						</Spreadsheet.Row>
					)}
				</Spreadsheet.VirtualRows>
			</Spreadsheet.Body>
		</Spreadsheet.Root>,
	);
}

function mountedRows(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll<HTMLTableRowElement>(
			"tr[data-slot=spreadsheet-row]",
		),
	);
}

describe("Spreadsheet.Root virtualization", () => {
	// @tanstack/react-virtual measures the scroll container through
	// ResizeObserver + offsetWidth/offsetHeight, none of which jsdom lays
	// out - stub a 200px-tall container so the virtualizer has a viewport.
	const originalOffsetHeight = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		"offsetHeight",
	);
	const originalOffsetWidth = Object.getOwnPropertyDescriptor(
		HTMLElement.prototype,
		"offsetWidth",
	);
	beforeAll(() => {
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			},
		);
		Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
			configurable: true,
			get(this: HTMLElement) {
				return this.dataset.slot === "spreadsheet-container" ? 200 : 0;
			},
		});
		Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
			configurable: true,
			get(this: HTMLElement) {
				return this.dataset.slot === "spreadsheet-container" ? 800 : 0;
			},
		});
	});
	afterAll(async () => {
		// The virtualizer debounces its scroll/measure notifications with a
		// ~50ms setTimeout that captures `window`; let any pending timer fire
		// while the jsdom environment still exists, otherwise it explodes with
		// "window is not defined" after teardown and fails the whole run.
		await new Promise((resolve) => setTimeout(resolve, 120));
		vi.unstubAllGlobals();
		if (originalOffsetHeight !== undefined) {
			Object.defineProperty(
				HTMLElement.prototype,
				"offsetHeight",
				originalOffsetHeight,
			);
		}
		if (originalOffsetWidth !== undefined) {
			Object.defineProperty(
				HTMLElement.prototype,
				"offsetWidth",
				originalOffsetWidth,
			);
		}
	});

	it("mounts only a window of rows, spacers keeping the scroll height", () => {
		const screen = renderVirtualFixture();
		const rows = mountedRows(screen);
		expect(rows.length).toBeGreaterThan(0);
		expect(rows.length).toBeLessThan(40);
		expect(rows[0]?.getAttribute("data-index")).toBe("0");
		expect(rows[0]?.getAttribute("aria-rowindex")).toBe("2");
		const bottomSpacer = screen.baseElement.querySelector<HTMLElement>(
			"[data-slot=spreadsheet-virtual-spacer] td",
		);
		// 500 rows x 33px minus the mounted window: far taller than a viewport.
		expect(
			Number.parseFloat(bottomSpacer?.style.height ?? "0"),
		).toBeGreaterThan(10_000);
		expect(
			screen.baseElement
				.querySelector("table[data-slot=spreadsheet]")
				?.getAttribute("aria-rowcount"),
		).toBe("501");
	});

	it("remounts the window around the scroll offset", () => {
		const screen = renderVirtualFixture();
		const container = screen.baseElement.querySelector<HTMLElement>(
			"[data-slot=spreadsheet-container]",
		);
		if (container === null) throw new Error("missing container");
		container.scrollTop = 5000;
		fireEvent.scroll(container);
		const rows = mountedRows(screen);
		const firstIndex = Number(rows[0]?.getAttribute("data-index"));
		expect(firstIndex).toBeGreaterThan(100);
		expect(rows.length).toBeLessThan(40);
		// The window is framed by spacers on both sides now.
		expect(
			screen.baseElement.querySelectorAll(
				"[data-slot=spreadsheet-virtual-spacer]",
			),
		).toHaveLength(2);
	});

	it("keeps grid navigation working over virtual rows", async () => {
		const screen = renderVirtualFixture({ gridNavigation: true });
		const firstCell = screen.baseElement.querySelector<HTMLTableCellElement>(
			"tr[data-slot=spreadsheet-row] td",
		);
		if (firstCell === null) throw new Error("missing cell");
		// Rows mounted by the virtualizer are stamped through the grid's
		// MutationObserver - a microtask away.
		await waitFor(() => expect(firstCell.getAttribute("tabindex")).toBe("0"));
		firstCell.focus();
		fireEvent.keyDown(firstCell, { key: "ArrowDown" });
		fireEvent.keyDown(document.activeElement as HTMLElement, {
			key: "ArrowDown",
		});
		const active = document.activeElement as HTMLTableCellElement;
		expect(active.closest("tr")?.getAttribute("data-index")).toBe("2");
		expect(active.closest("tr")?.getAttribute("aria-rowindex")).toBe("4");
		fireEvent.keyDown(active, { key: "Enter" });
		expect(document.activeElement).toBe(screen.getByLabelText("Row 3 name"));
	});
});

/**
 * jsdom knows no PointerEvent: dispatch a MouseEvent of the pointer type and
 * graft the pointer fields on it (React's synthetic event reads them off the
 * native event, own properties included).
 */
function firePointer(
	element: Element,
	type: "pointerdown" | "pointermove" | "pointerup",
	init: { pointerType: "touch" | "mouse"; clientY: number },
) {
	const event = new MouseEvent(type, {
		bubbles: true,
		cancelable: true,
		clientY: init.clientY,
	});
	Object.assign(event, { pointerId: 1, pointerType: init.pointerType });
	fireEvent(element, event);
}

function renderRowDragFixture() {
	const onRowMove = vi.fn();
	const screen = render(
		<Spreadsheet.Root onRowMove={onRowMove}>
			<Spreadsheet.Body>
				{[0, 1].map((index) => (
					<Spreadsheet.Row key={index}>
						<Spreadsheet.DragHandle
							index={index}
							aria-label={`Reorder row ${index + 1}`}
						/>
						<Spreadsheet.CellText>Row {index + 1}</Spreadsheet.CellText>
					</Spreadsheet.Row>
				))}
			</Spreadsheet.Body>
		</Spreadsheet.Root>,
	);
	const handle = screen.getByRole("button", { name: "Reorder row 1" });
	const row = handle.closest("tr");
	if (row === null) throw new Error("missing row");
	return { screen, onRowMove, handle, row };
}

describe("Spreadsheet.Root long-press row drag", () => {
	beforeAll(() => {
		// jsdom lacks pointer capture.
		Object.assign(HTMLElement.prototype, {
			setPointerCapture: () => {},
			releasePointerCapture: () => {},
		});
	});
	afterEach(() => {
		vi.useRealTimers();
	});

	it("arms a touch drag only after the long press", () => {
		vi.useFakeTimers();
		const { onRowMove, handle, row } = renderRowDragFixture();
		firePointer(handle, "pointerdown", { pointerType: "touch", clientY: 10 });
		// Not armed yet: moving does not drag.
		firePointer(handle, "pointermove", { pointerType: "touch", clientY: 14 });
		expect(row.hasAttribute("data-dragging")).toBe(false);
		vi.advanceTimersByTime(300);
		// The grab cue lifts the row in place.
		expect(row.getAttribute("data-dragging")).toBe("true");
		firePointer(handle, "pointermove", { pointerType: "touch", clientY: 60 });
		firePointer(handle, "pointerup", { pointerType: "touch", clientY: 60 });
		expect(onRowMove).toHaveBeenCalledWith(0, 1);
	});

	it("treats a finger that wanders before the delay as a scroll, not a drag", () => {
		vi.useFakeTimers();
		const { onRowMove, handle, row } = renderRowDragFixture();
		firePointer(handle, "pointerdown", { pointerType: "touch", clientY: 10 });
		firePointer(handle, "pointermove", { pointerType: "touch", clientY: 30 });
		vi.advanceTimersByTime(400);
		expect(row.hasAttribute("data-dragging")).toBe(false);
		firePointer(handle, "pointermove", { pointerType: "touch", clientY: 80 });
		firePointer(handle, "pointerup", { pointerType: "touch", clientY: 80 });
		expect(onRowMove).not.toHaveBeenCalled();
	});

	it("keeps dragging immediately with a mouse", () => {
		const { onRowMove, handle, row } = renderRowDragFixture();
		firePointer(handle, "pointerdown", { pointerType: "mouse", clientY: 10 });
		firePointer(handle, "pointermove", { pointerType: "mouse", clientY: 60 });
		expect(row.getAttribute("data-dragging")).toBe("true");
		firePointer(handle, "pointerup", { pointerType: "mouse", clientY: 60 });
		expect(onRowMove).toHaveBeenCalledWith(0, 1);
	});

	it("survives setPointerCapture throwing on synthetic pointers", () => {
		const original = HTMLElement.prototype.setPointerCapture;
		Object.assign(HTMLElement.prototype, {
			setPointerCapture: () => {
				throw new Error("NotFoundError");
			},
		});
		try {
			const { onRowMove, handle, row } = renderRowDragFixture();
			firePointer(handle, "pointerdown", { pointerType: "mouse", clientY: 10 });
			firePointer(handle, "pointermove", { pointerType: "mouse", clientY: 60 });
			expect(row.getAttribute("data-dragging")).toBe("true");
			firePointer(handle, "pointerup", { pointerType: "mouse", clientY: 60 });
			expect(onRowMove).toHaveBeenCalledWith(0, 1);
		} finally {
			Object.assign(HTMLElement.prototype, { setPointerCapture: original });
		}
	});

	it("ignores a second concurrent pointer while a drag is in flight", () => {
		const { onRowMove, handle, screen } = renderRowDragFixture();
		const secondHandle = screen.getByRole("button", { name: "Reorder row 2" });
		firePointer(handle, "pointerdown", { pointerType: "mouse", clientY: 10 });
		firePointer(secondHandle, "pointerdown", {
			pointerType: "touch",
			clientY: 45,
		});
		firePointer(handle, "pointermove", { pointerType: "mouse", clientY: 60 });
		firePointer(handle, "pointerup", { pointerType: "mouse", clientY: 60 });
		expect(onRowMove).toHaveBeenCalledWith(0, 1);
		expect(onRowMove).toHaveBeenCalledTimes(1);
	});
});

describe("Spreadsheet.Root sticky first column", () => {
	it("pins the first column parts only when stickyFirstColumn is set", () => {
		const sticky = render(
			<Spreadsheet.Root stickyFirstColumn>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.CellText>Label</Spreadsheet.CellText>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		expect(
			sticky.baseElement.querySelector("table[data-slot=spreadsheet]")
				?.className,
		).toContain("first-child]:sticky");
		cleanup();
		const plain = render(
			<Spreadsheet.Root>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.CellText>Label</Spreadsheet.CellText>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		expect(
			plain.baseElement.querySelector("table[data-slot=spreadsheet]")
				?.className,
		).not.toContain("first-child]:sticky");
	});

	it("stamps data-scrolled-x on the container while panned", () => {
		const screen = render(
			<Spreadsheet.Root stickyFirstColumn>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.CellText>Label</Spreadsheet.CellText>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>,
		);
		const container = screen.baseElement.querySelector<HTMLElement>(
			"[data-slot=spreadsheet-container]",
		);
		if (container === null) throw new Error("missing container");
		expect(container.hasAttribute("data-scrolled-x")).toBe(false);
		container.scrollLeft = 40;
		fireEvent.scroll(container);
		expect(container.hasAttribute("data-scrolled-x")).toBe(true);
		container.scrollLeft = 0;
		fireEvent.scroll(container);
		expect(container.hasAttribute("data-scrolled-x")).toBe(false);
	});
});

function renderMobileFixture(options?: {
	rowCount?: number;
	renderMobileRow?: (index: number) => ReactNode;
	onAdd?: () => void;
}) {
	return render(
		<Spreadsheet.Root
			rowCount={options?.rowCount}
			renderMobileRow={options?.renderMobileRow}
			mobileAddRow={
				<Spreadsheet.MobileAddRow onClick={options?.onAdd}>
					Add a row
				</Spreadsheet.MobileAddRow>
			}
		>
			<Spreadsheet.Body>
				<Spreadsheet.Row>
					<Spreadsheet.Cell>
						<Input aria-label="Name" defaultValue="Gants nitrile" />
					</Spreadsheet.Cell>
				</Spreadsheet.Row>
			</Spreadsheet.Body>
		</Spreadsheet.Root>,
	);
}

describe("Spreadsheet.Root mobile cards", () => {
	afterEach(() => {
		setViewportWidth(1024);
	});

	it("keeps the table on desktop even with renderMobileRow", () => {
		setViewportWidth(1024);
		const screen = renderMobileFixture({
			rowCount: 2,
			renderMobileRow: (index) => <div>Card {index + 1}</div>,
		});
		expect(
			screen.baseElement.querySelector("table[data-slot=spreadsheet]"),
		).not.toBeNull();
		expect(
			screen.baseElement.querySelector("[data-slot=spreadsheet-mobile-list]"),
		).toBeNull();
	});

	it("swaps the table for one card per row below the breakpoint", () => {
		setViewportWidth(500);
		const renderMobileRow = vi.fn((index: number) => (
			<div>Card {index + 1}</div>
		));
		const onAdd = vi.fn();
		const screen = renderMobileFixture({
			rowCount: 3,
			renderMobileRow,
			onAdd,
		});
		expect(
			screen.baseElement.querySelector("table[data-slot=spreadsheet]"),
		).toBeNull();
		const cards = screen.baseElement.querySelectorAll(
			"[data-slot=spreadsheet-mobile-card]",
		);
		expect(cards).toHaveLength(3);
		expect(cards[2]?.textContent).toBe("Card 3");
		expect(renderMobileRow).toHaveBeenCalledWith(2);
		const addButton = screen.getByRole("button", { name: "Add a row" });
		expect(addButton.getAttribute("type")).toBe("button");
		fireEvent.click(addButton);
		expect(onAdd).toHaveBeenCalledTimes(1);
	});

	it("still renders the add row with zero rows", () => {
		setViewportWidth(500);
		const screen = renderMobileFixture({
			rowCount: 0,
			renderMobileRow: () => <div>Card</div>,
		});
		expect(screen.baseElement.querySelector("ul")).toBeNull();
		expect(screen.getByRole("button", { name: "Add a row" })).toBeDefined();
	});

	it("keeps the table on mobile when no renderMobileRow is provided", () => {
		setViewportWidth(500);
		const screen = renderFixture();
		expect(
			screen.baseElement.querySelector("table[data-slot=spreadsheet]"),
		).not.toBeNull();
	});
});

const imageFile = () =>
	new File(["binary"], "packshot.png", { type: "image/png" });

function renderImageCellFixture(options?: {
	src?: string | null;
	onFileSelect?: (file: File) => void;
	onRemove?: () => void;
	onPasteData?: (data: SpreadsheetPasteData) => void;
	uploading?: boolean;
}) {
	return render(
		<Spreadsheet.Root gridNavigation onPasteData={options?.onPasteData}>
			<Spreadsheet.Body>
				<Spreadsheet.Row>
					<Spreadsheet.CellImage
						src={options?.src}
						alt="Hypafix 10 m"
						value="hypafix-10m"
						uploading={options?.uploading}
						onFileSelect={options?.onFileSelect ?? (() => {})}
						onRemove={options?.onRemove}
						pickLabel="Import an image, row 1"
						removeLabel="Remove the image, row 1"
					/>
					<Spreadsheet.Cell>
						<Input aria-label="Name" defaultValue="Hypafix" />
					</Spreadsheet.Cell>
				</Spreadsheet.Row>
			</Spreadsheet.Body>
		</Spreadsheet.Root>,
	);
}

describe("Spreadsheet.CellImage", () => {
	it("hands over a file picked through the input", () => {
		const onFileSelect = vi.fn();
		const screen = renderImageCellFixture({ onFileSelect });
		const input =
			screen.baseElement.querySelector<HTMLInputElement>("input[type=file]");
		if (input === null) throw new Error("missing file input");
		fireEvent.change(input, { target: { files: [imageFile()] } });
		expect(onFileSelect).toHaveBeenCalledTimes(1);
		expect(onFileSelect.mock.calls[0]?.[0]).toBeInstanceOf(File);
		// Cleared so re-picking the same file still fires `change`.
		expect(input.value).toBe("");
	});

	it("hands over a file dropped onto the cell", () => {
		const onFileSelect = vi.fn();
		const screen = renderImageCellFixture({ onFileSelect });
		const cell = screen.getByLabelText("Import an image, row 1").closest("td");
		if (cell === null) throw new Error("missing cell");
		fireEvent.drop(cell, { dataTransfer: { files: [imageFile()] } });
		expect(onFileSelect).toHaveBeenCalledTimes(1);
	});

	it("takes an image paste and keeps it away from the grid's TSV layer", () => {
		const onFileSelect = vi.fn();
		const onPasteData = vi.fn();
		const screen = renderImageCellFixture({ onFileSelect, onPasteData });
		const cell = screen.getByLabelText("Import an image, row 1").closest("td");
		if (cell === null) throw new Error("missing cell");
		fireEvent.paste(cell, {
			clipboardData: { files: [imageFile()], getData: () => "" },
		});
		expect(onFileSelect).toHaveBeenCalledTimes(1);
		expect(onPasteData).not.toHaveBeenCalled();
	});

	it("lets a text paste fall through to the grid", () => {
		const onFileSelect = vi.fn();
		const onPasteData = vi.fn();
		const screen = renderImageCellFixture({ onFileSelect, onPasteData });
		const cell = screen.getByLabelText("Import an image, row 1").closest("td");
		if (cell === null) throw new Error("missing cell");
		cell.focus();
		fireEvent.paste(cell, {
			clipboardData: { files: [], getData: () => "a\tb" },
		});
		expect(onFileSelect).not.toHaveBeenCalled();
		expect(onPasteData).toHaveBeenCalledTimes(1);
	});

	it("shows the remove action only once an image is set", () => {
		const onRemove = vi.fn();
		const empty = renderImageCellFixture({ src: null, onRemove });
		expect(empty.queryByLabelText("Remove the image, row 1")).toBeNull();
		cleanup();
		const filled = renderImageCellFixture({
			src: "https://cdn.example/a.webp",
			onRemove,
		});
		fireEvent.click(filled.getByLabelText("Remove the image, row 1"));
		expect(onRemove).toHaveBeenCalledTimes(1);
	});

	it("renders the thumbnail with the row's own alt text", () => {
		const screen = renderImageCellFixture({
			src: "https://cdn.example/a.webp",
		});
		const image = screen.baseElement.querySelector("img");
		expect(image?.getAttribute("alt")).toBe("Hypafix 10 m");
	});

	it("blocks imports and the picker while uploading", () => {
		const onFileSelect = vi.fn();
		const screen = renderImageCellFixture({ onFileSelect, uploading: true });
		const picker = screen.getByLabelText("Import an image, row 1");
		expect(picker.hasAttribute("disabled")).toBe(true);
		const cell = picker.closest("td");
		if (cell === null) throw new Error("missing cell");
		fireEvent.drop(cell, { dataTransfer: { files: [imageFile()] } });
		expect(onFileSelect).not.toHaveBeenCalled();
	});

	it("copies the declared value, not the hidden file input", () => {
		const screen = renderImageCellFixture({});
		const cell = screen.getByLabelText("Import an image, row 1").closest("td");
		expect(cell?.getAttribute("data-grid-value")).toBe("hypafix-10m");
	});
});
