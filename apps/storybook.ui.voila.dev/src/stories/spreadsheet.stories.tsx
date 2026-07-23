import { TrashIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Checkbox } from "@voila.dev/ui/components/checkbox";
import { Field, FieldError, FieldLabel } from "@voila.dev/ui/components/field";
import { Input } from "@voila.dev/ui/components/input";
import { MoneyInput } from "@voila.dev/ui/components/money-input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@voila.dev/ui/components/native-select";
import { Switch } from "@voila.dev/ui/components/switch";
import {
	Spreadsheet,
	type SpreadsheetPasteData,
	type SpreadsheetSort,
} from "@voila.dev/ui-spreadsheet/components/spreadsheet";
import { type Dispatch, type SetStateAction, useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "Spreadsheet/Spreadsheet",
	component: Spreadsheet.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Spreadsheet.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

interface VariantRow {
	id: number;
	name: string;
	reference: string;
	quantity: string;
}

const initialVariants: VariantRow[] = [
	{ id: 1, name: "Nitrile gloves S", reference: "ESS-001", quantity: "100" },
	{ id: 2, name: "Nitrile gloves M", reference: "ESS-002", quantity: "100" },
	{ id: 3, name: "Nitrile gloves L", reference: "ESS-003", quantity: "90" },
];

function VariantsExample() {
	const [rows, setRows] = useState(initialVariants);
	const [nextId, setNextId] = useState(4);

	const updateRow = (id: number, patch: Partial<VariantRow>) => {
		setRows((current) =>
			current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
		);
	};

	return (
		<Spreadsheet.Root>
			<Spreadsheet.Columns>
				<Spreadsheet.Column />
				<Spreadsheet.Column width={120} />
				<Spreadsheet.Column width={100} />
				<Spreadsheet.Column width={40} />
			</Spreadsheet.Columns>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head>Name</Spreadsheet.Head>
					<Spreadsheet.Head>Reference</Spreadsheet.Head>
					<Spreadsheet.Head>Units/carton</Spreadsheet.Head>
					<Spreadsheet.Head>
						<span className="sr-only">Actions</span>
					</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				{rows.map((row, index) => (
					<Spreadsheet.Row key={row.id}>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} name`}
								value={row.name}
								onChange={(event) =>
									updateRow(row.id, { name: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} reference`}
								value={row.reference}
								onChange={(event) =>
									updateRow(row.id, { reference: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								type="number"
								aria-label={`Row ${index + 1} units per carton`}
								value={row.quantity}
								onChange={(event) =>
									updateRow(row.id, { quantity: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.RowActions>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={
									row.name === "" ? "Delete new row" : `Delete ${row.name}`
								}
								onClick={() =>
									setRows((current) =>
										current.filter((candidate) => candidate.id !== row.id),
									)
								}
							>
								<TrashIcon />
							</Button>
						</Spreadsheet.RowActions>
					</Spreadsheet.Row>
				))}
				<Spreadsheet.AddRow
					colSpan={4}
					onClick={() => {
						setRows((current) => [
							...current,
							{ id: nextId, name: "", reference: "", quantity: "" },
						]);
						setNextId((current) => current + 1);
					}}
				>
					Add a row
				</Spreadsheet.AddRow>
			</Spreadsheet.Body>
		</Spreadsheet.Root>
	);
}

export const Default: Story = {
	render: () => <VariantsExample />,
};

/**
 * One column per control family, proving every flattening rule of the cell:
 * `Input` (number), `MoneyInput` (locked EUR, targets `fieldset[data-slot]`),
 * `NativeSelect`, centered `Checkbox` and `Switch`. Focus each cell to check
 * the cell-level ring replaces the control's own.
 */
export const MixedControls: Story = {
	render: function MixedControlsStory() {
		const [price, setPrice] = useState("12.50");
		const [packaging, setPackaging] = useState("carton");
		const [inStock, setInStock] = useState(true);
		const [published, setPublished] = useState(false);
		const [quantity, setQuantity] = useState("100");
		return (
			<Spreadsheet.Root>
				<Spreadsheet.Columns>
					<Spreadsheet.Column />
					<Spreadsheet.Column width={90} />
					<Spreadsheet.Column width={140} />
					<Spreadsheet.Column width={130} />
					<Spreadsheet.Column width={70} />
					<Spreadsheet.Column width={80} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>Variant</Spreadsheet.Head>
						<Spreadsheet.Head>Quantity</Spreadsheet.Head>
						<Spreadsheet.Head>Unit price</Spreadsheet.Head>
						<Spreadsheet.Head>Packaging</Spreadsheet.Head>
						<Spreadsheet.Head className="text-center">Stock</Spreadsheet.Head>
						<Spreadsheet.Head className="text-center">
							Published
						</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.CellText>Nitrile gloves M</Spreadsheet.CellText>
						<Spreadsheet.Cell>
							<Input
								type="number"
								aria-label="Quantity"
								value={quantity}
								onChange={(event) => setQuantity(event.target.value)}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<MoneyInput
								aria-label="Unit price"
								value={price}
								onValueChange={setPrice}
								currency="EUR"
								currencyLabel="Currency"
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<NativeSelect
								aria-label="Packaging"
								value={packaging}
								onChange={(event) => setPackaging(event.target.value)}
							>
								<NativeSelectOption value="unit">Unit</NativeSelectOption>
								<NativeSelectOption value="box">Box</NativeSelectOption>
								<NativeSelectOption value="carton">Carton</NativeSelectOption>
							</NativeSelect>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Checkbox
								aria-label="In stock"
								checked={inStock}
								onCheckedChange={(checked) => setInStock(checked === true)}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Switch
								aria-label="Published"
								checked={published}
								onCheckedChange={setPublished}
							/>
						</Spreadsheet.Cell>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
};

/**
 * Error styling happens at two levels: `aria-invalid` on a control tints and
 * rings its own cell, `invalid` on a row tints the whole row. Readable
 * messages stay outside the grid, in a `FieldError` below the table.
 */
export const InvalidStates: Story = {
	render: () => (
		// No `data-invalid` on the Field: it would cascade the destructive text
		// color into every control, while only two spots are actually invalid.
		<Field>
			<Spreadsheet.Root>
				<Spreadsheet.Columns>
					<Spreadsheet.Column />
					<Spreadsheet.Column width={120} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>Name</Spreadsheet.Head>
						<Spreadsheet.Head>Reference</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					<Spreadsheet.Row>
						<Spreadsheet.Cell>
							<Input aria-label="Row 1 name" defaultValue="Nitrile gloves S" />
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								aria-label="Row 1 reference"
								defaultValue=""
								aria-invalid
							/>
						</Spreadsheet.Cell>
					</Spreadsheet.Row>
					<Spreadsheet.Row invalid>
						<Spreadsheet.Cell>
							<Input aria-label="Row 2 name" defaultValue="Nitrile gloves S" />
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input aria-label="Row 2 reference" defaultValue="ESS-001" />
						</Spreadsheet.Cell>
					</Spreadsheet.Row>
				</Spreadsheet.Body>
			</Spreadsheet.Root>
			<FieldError>
				Row 1 needs a reference and row 2 duplicates ESS-001.
			</FieldError>
		</Field>
	),
};

/** Adds a row, types into it, then deletes it again. */
export const AddRemoveRows: Story = {
	render: () => <VariantsExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const rowCount = () =>
			canvasElement.querySelectorAll("[data-slot=spreadsheet-row]").length;
		const initialCount = rowCount();

		await userEvent.click(canvas.getByRole("button", { name: "Add a row" }));
		await waitFor(() => expect(rowCount()).toBe(initialCount + 1));

		const newInput = canvas.getByLabelText(`Row ${initialCount + 1} name`);
		await userEvent.type(newInput, "FFP2 masks");
		await expect(newInput).toHaveValue("FFP2 masks");

		await userEvent.click(
			canvas.getByRole("button", { name: "Delete FFP2 masks" }),
		);
		await waitFor(() => expect(rowCount()).toBe(initialCount));
	},
};

export const Empty: Story = {
	render: function EmptyStory() {
		return (
			<Spreadsheet.Root>
				<Spreadsheet.Columns>
					<Spreadsheet.Column />
					<Spreadsheet.Column width={120} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>Name</Spreadsheet.Head>
						<Spreadsheet.Head>Reference</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					<Spreadsheet.AddRow colSpan={2}>Add a row</Spreadsheet.AddRow>
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
};

export const Skeleton: Story = {
	render: () => (
		<Spreadsheet.Root>
			<Spreadsheet.Columns>
				<Spreadsheet.Column />
				<Spreadsheet.Column width={120} />
				<Spreadsheet.Column width={100} />
			</Spreadsheet.Columns>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head>Name</Spreadsheet.Head>
					<Spreadsheet.Head>Reference</Spreadsheet.Head>
					<Spreadsheet.Head>Units/carton</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				<Spreadsheet.Skeleton rows={4} columns={3} />
			</Spreadsheet.Body>
		</Spreadsheet.Root>
	),
};

/**
 * Controlled sort: clicking a sortable header cycles asc, desc, none. The
 * table only reports the change; the story reorders its own row array (a
 * sorted view over indexed form rows would break their binding).
 */
export const Sorting: Story = {
	render: function SortingStory() {
		const [rows, setRows] = useState(initialVariants);
		const [sort, setSort] = useState<SpreadsheetSort | null>(null);
		const applySort = (next: SpreadsheetSort | null) => {
			setSort(next);
			if (next === null) {
				setRows((current) =>
					[...current].sort((left, right) => left.id - right.id),
				);
				return;
			}
			const factor = next.direction === "asc" ? 1 : -1;
			setRows((current) =>
				[...current].sort((left, right) =>
					next.columnId === "quantity"
						? factor * (Number(left.quantity) - Number(right.quantity))
						: factor * left.name.localeCompare(right.name),
				),
			);
		};
		return (
			<Spreadsheet.Root sort={sort} onSortChange={applySort}>
				<Spreadsheet.Columns>
					<Spreadsheet.Column columnId="name" />
					<Spreadsheet.Column columnId="reference" width={120} />
					<Spreadsheet.Column columnId="quantity" width={110} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head columnId="name" sortable>
							Name
						</Spreadsheet.Head>
						<Spreadsheet.Head columnId="reference">Reference</Spreadsheet.Head>
						<Spreadsheet.Head columnId="quantity" sortable>
							Units/carton
						</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					{rows.map((row, index) => (
						<Spreadsheet.Row key={row.id}>
							<Spreadsheet.Cell>
								<Input
									aria-label={`Row ${index + 1} name`}
									value={row.name}
									onChange={(event) =>
										setRows((current) =>
											current.map((candidate) =>
												candidate.id === row.id
													? { ...candidate, name: event.target.value }
													: candidate,
											),
										)
									}
								/>
							</Spreadsheet.Cell>
							<Spreadsheet.CellText>{row.reference}</Spreadsheet.CellText>
							<Spreadsheet.CellText>{row.quantity}</Spreadsheet.CellText>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const firstName = () =>
			canvasElement.querySelector<HTMLInputElement>(
				"[data-slot=spreadsheet-cell] input",
			)?.value;
		await userEvent.click(canvas.getByRole("button", { name: "Name" }));
		await waitFor(() => expect(firstName()).toBe("Nitrile gloves L"));
		await expect(
			canvasElement
				.querySelector("th[data-column-id=name]")
				?.getAttribute("aria-sort"),
		).toBe("ascending");
	},
};

/**
 * Uncontrolled resize: drag the strip on a header's right edge, or focus it
 * and press ArrowLeft/ArrowRight. The first interaction switches the table to
 * `table-layout: fixed`. Pass `columnSizing`/`onColumnSizingChange` to
 * persist the widths instead.
 */
export const ColumnResize: Story = {
	render: () => (
		<Spreadsheet.Root>
			<Spreadsheet.Columns>
				<Spreadsheet.Column columnId="name" />
				<Spreadsheet.Column columnId="reference" width={140} />
				<Spreadsheet.Column columnId="quantity" width={110} />
			</Spreadsheet.Columns>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head columnId="name" resizable>
						Name
					</Spreadsheet.Head>
					<Spreadsheet.Head columnId="reference" resizable>
						Reference
					</Spreadsheet.Head>
					<Spreadsheet.Head columnId="quantity">Units/carton</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				{initialVariants.map((row, index) => (
					<Spreadsheet.Row key={row.id}>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} name`}
								defaultValue={row.name}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} reference`}
								defaultValue={row.reference}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.CellText>{row.quantity}</Spreadsheet.CellText>
					</Spreadsheet.Row>
				))}
			</Spreadsheet.Body>
		</Spreadsheet.Root>
	),
};

/**
 * The image column. Import a picture three ways - click the cell to open the
 * picker, drop a file onto it, or paste one from the clipboard while the cell
 * is focused. The kit never uploads: the story holds the object URL the same
 * way an app would hold the URL its upload returned.
 */
export const ImageColumn: Story = {
	render: function ImageColumnStory() {
		const [images, setImages] = useState<Record<number, string>>({});
		const [uploading, setUploading] = useState<number | null>(null);

		const importImage = (id: number, file: File) => {
			// Stands in for a real upload: a beat of latency, then the URL.
			setUploading(id);
			window.setTimeout(() => {
				setImages((current) => ({
					...current,
					[id]: URL.createObjectURL(file),
				}));
				setUploading(null);
			}, 600);
		};

		return (
			<Spreadsheet.Root gridNavigation>
				<Spreadsheet.Columns>
					<Spreadsheet.Column width={56} />
					<Spreadsheet.Column columnId="name" width={240} />
					<Spreadsheet.Column width={110} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>
							<span className="sr-only">Image</span>
						</Spreadsheet.Head>
						<Spreadsheet.Head columnId="name" resizable>
							Name
						</Spreadsheet.Head>
						<Spreadsheet.Head>Units/carton</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					{initialVariants.map((row, index) => (
						<Spreadsheet.Row key={row.id}>
							<Spreadsheet.CellImage
								src={images[row.id]}
								alt={row.name}
								value={row.reference}
								uploading={uploading === row.id}
								onFileSelect={(file) => importImage(row.id, file)}
								onRemove={() =>
									setImages(({ [row.id]: _removed, ...rest }) => rest)
								}
								pickLabel={`Row ${index + 1}: import an image`}
								removeLabel={`Row ${index + 1}: remove the image`}
							/>
							<Spreadsheet.Cell>
								<Input
									aria-label={`Row ${index + 1} name`}
									defaultValue={row.name}
								/>
							</Spreadsheet.Cell>
							<Spreadsheet.CellText>{row.quantity}</Spreadsheet.CellText>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
};

/**
 * Controlled column order: drag a header sideways (or focus it and press
 * Alt+ArrowLeft/ArrowRight) and the story re-renders every column from the
 * new order - the kit only reports the move.
 */
export const ColumnReorder: Story = {
	render: function ColumnReorderStory() {
		const [columnOrder, setColumnOrder] = useState([
			"name",
			"reference",
			"quantity",
		]);
		const headers: Record<string, string> = {
			name: "Name",
			reference: "Reference",
			quantity: "Units/carton",
		};
		const widths: Record<string, number | undefined> = {
			name: undefined,
			reference: 140,
			quantity: 110,
		};
		return (
			<Spreadsheet.Root
				columnOrder={columnOrder}
				onColumnOrderChange={setColumnOrder}
			>
				<Spreadsheet.Columns>
					{columnOrder.map((columnId) => (
						<Spreadsheet.Column
							key={columnId}
							columnId={columnId}
							width={widths[columnId]}
						/>
					))}
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						{columnOrder.map((columnId) => (
							<Spreadsheet.Head key={columnId} columnId={columnId}>
								{headers[columnId]}
							</Spreadsheet.Head>
						))}
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					{initialVariants.map((row, index) => (
						<Spreadsheet.Row key={row.id}>
							{columnOrder.map((columnId) =>
								columnId === "name" ? (
									<Spreadsheet.Cell key={columnId}>
										<Input
											aria-label={`Row ${index + 1} name`}
											defaultValue={row.name}
										/>
									</Spreadsheet.Cell>
								) : (
									<Spreadsheet.CellText key={columnId}>
										{columnId === "reference" ? row.reference : row.quantity}
									</Spreadsheet.CellText>
								),
							)}
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
};

/**
 * Row reordering through the drag handle: drag it vertically, or focus it and
 * press Space to grab, ArrowUp/ArrowDown to pick the position, Space to drop
 * (Escape cancels). The story applies `onRowMove` to its own array.
 */
export const RowDrag: Story = {
	render: function RowDragStory() {
		const [rows, setRows] = useState(initialVariants);
		return (
			<Spreadsheet.Root
				onRowMove={(fromIndex, toIndex) =>
					setRows((current) => {
						const next = [...current];
						const [moved] = next.splice(fromIndex, 1);
						if (moved !== undefined) {
							next.splice(toIndex, 0, moved);
						}
						return next;
					})
				}
			>
				<Spreadsheet.Columns>
					<Spreadsheet.Column width={32} />
					<Spreadsheet.Column />
					<Spreadsheet.Column width={140} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>
							<span className="sr-only">Reorder</span>
						</Spreadsheet.Head>
						<Spreadsheet.Head>Name</Spreadsheet.Head>
						<Spreadsheet.Head>Reference</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					{rows.map((row, index) => (
						<Spreadsheet.Row key={row.id}>
							<Spreadsheet.DragHandle
								index={index}
								aria-label={`Reorder ${row.name}`}
							/>
							<Spreadsheet.Cell>
								<Input
									aria-label={`Row ${index + 1} name`}
									value={row.name}
									onChange={(event) =>
										setRows((current) =>
											current.map((candidate) =>
												candidate.id === row.id
													? { ...candidate, name: event.target.value }
													: candidate,
											),
										)
									}
								/>
							</Spreadsheet.Cell>
							<Spreadsheet.CellText>{row.reference}</Spreadsheet.CellText>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const handle = canvas.getByRole("button", {
			name: "Reorder Nitrile gloves S",
		});
		handle.focus();
		await userEvent.keyboard(" ");
		await userEvent.keyboard("{ArrowDown}");
		await userEvent.keyboard(" ");
		await waitFor(() =>
			expect(
				canvasElement.querySelector<HTMLInputElement>(
					"[data-slot=spreadsheet-cell] input",
				)?.value,
			).toBe("Nitrile gloves M"),
		);
	},
};

interface GridRowsState {
	rows: VariantRow[];
	setRows: Dispatch<SetStateAction<VariantRow[]>>;
}

function GridVariantsTable({
	rows,
	setRows,
	onPasteData,
}: GridRowsState & {
	onPasteData?: (data: SpreadsheetPasteData) => void;
}) {
	const updateRow = (id: number, patch: Partial<VariantRow>) => {
		setRows((current) =>
			current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
		);
	};
	return (
		<Spreadsheet.Root gridNavigation onPasteData={onPasteData}>
			<Spreadsheet.Columns>
				<Spreadsheet.Column />
				<Spreadsheet.Column width={120} />
				<Spreadsheet.Column width={110} />
			</Spreadsheet.Columns>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head>Name</Spreadsheet.Head>
					<Spreadsheet.Head>Reference</Spreadsheet.Head>
					<Spreadsheet.Head>Units/carton</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				{rows.map((row, index) => (
					<Spreadsheet.Row key={row.id}>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} name`}
								value={row.name}
								onChange={(event) =>
									updateRow(row.id, { name: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} reference`}
								value={row.reference}
								onChange={(event) =>
									updateRow(row.id, { reference: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								type="number"
								aria-label={`Row ${index + 1} units per carton`}
								value={row.quantity}
								onChange={(event) =>
									updateRow(row.id, { quantity: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
					</Spreadsheet.Row>
				))}
			</Spreadsheet.Body>
		</Spreadsheet.Root>
	);
}

/**
 * Opt-in spreadsheet keyboard layer (`gridNavigation`): click a cell's edge
 * or Tab into the grid to land on a cell, move with the arrow keys (plus
 * Home/End/PageUp/PageDown), press Enter/F2 or just type to edit, Escape to
 * come back. Shift+arrows or a pointer drag select a rectangle and
 * Cmd/Ctrl+C copies it as TSV.
 */
export const GridNavigation: Story = {
	render: function GridNavigationStory() {
		const [rows, setRows] = useState(initialVariants);
		return <GridVariantsTable rows={rows} setRows={setRows} />;
	},
	play: async ({ canvasElement }) => {
		const firstCell = canvasElement.querySelector<HTMLTableCellElement>(
			"tbody td[data-slot=spreadsheet-cell]",
		);
		if (firstCell === null) {
			throw new Error("missing grid cell");
		}
		firstCell.focus();
		await userEvent.keyboard("{ArrowRight}");
		await waitFor(() =>
			expect(document.activeElement?.getAttribute("aria-colindex")).toBe("2"),
		);
		await userEvent.keyboard("{Shift>}{ArrowDown}{/Shift}");
		await waitFor(() =>
			expect(
				canvasElement.querySelectorAll("td[data-grid-selected]"),
			).toHaveLength(2),
		);
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				canvasElement.querySelectorAll("td[data-grid-selected]"),
			).toHaveLength(0),
		);
	},
};

const PASTE_COLUMNS = ["name", "reference", "quantity"] as const;

function patchVariantRow(
	row: VariantRow,
	line: readonly string[],
	startColumn: number,
): VariantRow {
	const patched = { ...row };
	for (const [columnOffset, pastedValue] of line.entries()) {
		const column = PASTE_COLUMNS[startColumn + columnOffset];
		if (column !== undefined) {
			patched[column] = pastedValue;
		}
	}
	return patched;
}

function applyPastedVariants(
	current: VariantRow[],
	{ startRow, startColumn, values }: SpreadsheetPasteData,
): VariantRow[] {
	const next = [...current];
	let nextId = Math.max(0, ...next.map((row) => row.id)) + 1;
	for (const [rowOffset, line] of values.entries()) {
		const rowIndex = startRow + rowOffset;
		while (next.length <= rowIndex) {
			next.push({ id: nextId, name: "", reference: "", quantity: "" });
			nextId += 1;
		}
		const target = next[rowIndex];
		if (target !== undefined) {
			next[rowIndex] = patchVariantRow(target, line, startColumn);
		}
	}
	return next;
}

/**
 * Grid-mode paste: `onPasteData` hands the parsed TSV matrix and its target
 * position to the consumer, who applies it to their own rows - extending the
 * array when the paste overflows, which is exactly what pasting variant rows
 * from Excel/Sheets needs. The play function simulates such a paste on the
 * first cell.
 */
export const CopyPaste: Story = {
	render: function CopyPasteStory() {
		const [rows, setRows] = useState(initialVariants);
		return (
			<GridVariantsTable
				rows={rows}
				setRows={setRows}
				onPasteData={(data) =>
					setRows((current) => applyPastedVariants(current, data))
				}
			/>
		);
	},
	play: async ({ canvasElement }) => {
		const firstCell = canvasElement.querySelector<HTMLTableCellElement>(
			"tbody td[data-slot=spreadsheet-cell]",
		);
		if (firstCell === null) {
			throw new Error("missing grid cell");
		}
		firstCell.focus();
		const clipboardData = new DataTransfer();
		clipboardData.setData(
			"text/plain",
			"FFP2 masks\tESS-101\t50\nSurgical masks\tESS-102\t80\nGowns\tESS-103\t40\nVisors\tESS-104\t25\n",
		);
		firstCell.dispatchEvent(
			new ClipboardEvent("paste", {
				clipboardData,
				bubbles: true,
				cancelable: true,
			}),
		);
		const canvas = within(canvasElement);
		await waitFor(() =>
			expect(canvas.getByLabelText("Row 4 name")).toHaveValue("Visors"),
		);
		await expect(canvas.getByLabelText("Row 1 reference")).toHaveValue(
			"ESS-101",
		);
	},
};

/** 30 rows in a capped container: the header stays pinned while scrolling. */
export const StickyHeader: Story = {
	render: function StickyHeaderStory() {
		const [rows, setRows] = useState(() =>
			Array.from({ length: 30 }, (_, index) => ({
				id: index + 1,
				name: `Variant ${index + 1}`,
				quantity: String((index + 1) * 10),
			})),
		);
		return (
			<Spreadsheet.Root stickyHeader containerClassName="max-h-80">
				<Spreadsheet.Columns>
					<Spreadsheet.Column />
					<Spreadsheet.Column width={110} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>Name</Spreadsheet.Head>
						<Spreadsheet.Head>Quantity</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					{rows.map((row, index) => (
						<Spreadsheet.Row key={row.id}>
							<Spreadsheet.Cell>
								<Input
									aria-label={`Row ${index + 1} name`}
									value={row.name}
									onChange={(event) =>
										setRows((current) =>
											current.map((candidate) =>
												candidate.id === row.id
													? { ...candidate, name: event.target.value }
													: candidate,
											),
										)
									}
								/>
							</Spreadsheet.Cell>
							<Spreadsheet.Cell>
								<Input
									type="number"
									aria-label={`Row ${index + 1} quantity`}
									value={row.quantity}
									onChange={(event) =>
										setRows((current) =>
											current.map((candidate) =>
												candidate.id === row.id
													? { ...candidate, quantity: event.target.value }
													: candidate,
											),
										)
									}
								/>
							</Spreadsheet.Cell>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
};

/**
 * 500 rows behind `Spreadsheet.VirtualRows`: only the visible window mounts,
 * two spacer rows keep the scrollbar honest. Requires `stickyHeader` plus a
 * capped container (the scroll element) and fixed-height rows. Grid
 * navigation stays on: rows carry their absolute index, so arrows, selection
 * and copy/paste keep working while scrolling. `stickyFirstColumn` composes
 * with all of it (the spacer rows are exempt from pinning by design).
 */
export const Virtualized: Story = {
	render: function VirtualizedStory() {
		const [rows, setRows] = useState(() =>
			Array.from({ length: 500 }, (_, index) => ({
				id: index + 1,
				name: `Variant ${index + 1}`,
				quantity: String(((index * 7) % 90) + 10),
			})),
		);
		const updateRow = (
			id: number,
			patch: { name?: string; quantity?: string },
		) => {
			setRows((current) =>
				current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
			);
		};
		return (
			<Spreadsheet.Root
				stickyHeader
				stickyFirstColumn
				gridNavigation
				containerClassName="max-h-80 max-w-lg"
				className="min-w-2xl"
			>
				<Spreadsheet.Columns>
					<Spreadsheet.Column width={90} />
					<Spreadsheet.Column />
					<Spreadsheet.Column width={110} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>#</Spreadsheet.Head>
						<Spreadsheet.Head>Name</Spreadsheet.Head>
						<Spreadsheet.Head>Quantity</Spreadsheet.Head>
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					<Spreadsheet.VirtualRows count={rows.length}>
						{(index) => {
							const row = rows[index];
							if (row === undefined) {
								return null;
							}
							return (
								<Spreadsheet.Row key={row.id}>
									<Spreadsheet.CellText>{row.id}</Spreadsheet.CellText>
									<Spreadsheet.Cell>
										<Input
											aria-label={`Row ${index + 1} name`}
											value={row.name}
											onChange={(event) =>
												updateRow(row.id, { name: event.target.value })
											}
										/>
									</Spreadsheet.Cell>
									<Spreadsheet.Cell>
										<Input
											type="number"
											aria-label={`Row ${index + 1} quantity`}
											value={row.quantity}
											onChange={(event) =>
												updateRow(row.id, { quantity: event.target.value })
											}
										/>
									</Spreadsheet.Cell>
								</Spreadsheet.Row>
							);
						}}
					</Spreadsheet.VirtualRows>
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
	play: async ({ canvasElement }) => {
		const mounted = () =>
			canvasElement.querySelectorAll("tr[data-slot=spreadsheet-row]").length;
		await waitFor(() => expect(mounted()).toBeGreaterThan(0));
		await expect(mounted()).toBeLessThan(60);
		const container = canvasElement.querySelector<HTMLElement>(
			"[data-slot=spreadsheet-container]",
		);
		if (container === null) {
			throw new Error("missing container");
		}
		container.scrollTop = container.scrollHeight;
		await waitFor(() =>
			expect(within(canvasElement).getByLabelText("Row 500 name")).toHaveValue(
				"Variant 500",
			),
		);
		await expect(mounted()).toBeLessThan(60);
	},
};

/**
 * Many columns in a narrow container: `stickyFirstColumn` pins the row label
 * while the grid pans horizontally, and an edge shadow appears once the
 * container is actually scrolled. Keep the first column read-only
 * (`Spreadsheet.CellText`) - editing inside a pinned cell over a panning
 * grid is disorienting.
 */
export const StickyFirstColumn: Story = {
	render: function StickyFirstColumnStory() {
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
		const [rows, setRows] = useState(() =>
			Array.from({ length: 6 }, (_, index) => ({
				id: index + 1,
				name: `Variant ${index + 1}`,
				quantities: months.map((_, month) => String((index + month) * 10)),
			})),
		);
		return (
			<Spreadsheet.Root
				stickyFirstColumn
				containerClassName="max-w-xl"
				// Force the declared column widths past the container: without a
				// min-width the auto layout would squeeze everything into view and
				// there would be nothing to pan.
				className="min-w-[840px]"
			>
				<Spreadsheet.Columns>
					<Spreadsheet.Column width={120} />
					{months.map((month) => (
						<Spreadsheet.Column key={month} width={90} />
					))}
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>Variant</Spreadsheet.Head>
						{months.map((month) => (
							<Spreadsheet.Head key={month}>{month}</Spreadsheet.Head>
						))}
					</tr>
				</Spreadsheet.Header>
				<Spreadsheet.Body>
					{rows.map((row, rowIndex) => (
						<Spreadsheet.Row key={row.id}>
							<Spreadsheet.CellText>{row.name}</Spreadsheet.CellText>
							{row.quantities.map((quantity, month) => (
								<Spreadsheet.Cell key={months[month]}>
									<Input
										type="number"
										aria-label={`${row.name} ${months[month]} quantity`}
										value={quantity}
										onChange={(event) =>
											setRows((current) =>
												current.map((candidate, index) =>
													index === rowIndex
														? {
																...candidate,
																quantities: candidate.quantities.map(
																	(existing, existingMonth) =>
																		existingMonth === month
																			? event.target.value
																			: existing,
																),
															}
														: candidate,
												),
											)
										}
									/>
								</Spreadsheet.Cell>
							))}
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		);
	},
};

interface MobileCardsRow {
	id: number;
	name: string;
	quantity: string;
}

function MobileCardsExample() {
	const [rows, setRows] = useState<MobileCardsRow[]>(
		initialVariants.map((variant) => ({
			id: variant.id,
			name: variant.name,
			quantity: variant.quantity,
		})),
	);
	const [nextId, setNextId] = useState(4);
	const updateRow = (id: number, patch: Partial<MobileCardsRow>) => {
		setRows((current) =>
			current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
		);
	};
	const removeRow = (id: number) => {
		setRows((current) => current.filter((candidate) => candidate.id !== id));
	};
	const addRow = () => {
		setRows((current) => [...current, { id: nextId, name: "", quantity: "" }]);
		setNextId((current) => current + 1);
	};
	return (
		<Spreadsheet.Root
			rowCount={rows.length}
			renderMobileRow={(index) => {
				const row = rows[index];
				if (row === undefined) {
					return null;
				}
				return (
					<div className="flex flex-col gap-3">
						<Field>
							<FieldLabel htmlFor={`mobile-name-${row.id}`}>Name</FieldLabel>
							<Input
								id={`mobile-name-${row.id}`}
								value={row.name}
								onChange={(event) =>
									updateRow(row.id, { name: event.target.value })
								}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor={`mobile-quantity-${row.id}`}>
								Units/carton
							</FieldLabel>
							<Input
								id={`mobile-quantity-${row.id}`}
								type="number"
								value={row.quantity}
								onChange={(event) =>
									updateRow(row.id, { quantity: event.target.value })
								}
							/>
						</Field>
						<Button
							variant="outline"
							size="sm"
							onClick={() => removeRow(row.id)}
						>
							<TrashIcon />
							Delete row
						</Button>
					</div>
				);
			}}
			mobileAddRow={
				<Spreadsheet.MobileAddRow onClick={addRow}>
					Add a row
				</Spreadsheet.MobileAddRow>
			}
		>
			<Spreadsheet.Columns>
				<Spreadsheet.Column />
				<Spreadsheet.Column width={110} />
				<Spreadsheet.Column width={40} />
			</Spreadsheet.Columns>
			<Spreadsheet.Header>
				<tr>
					<Spreadsheet.Head>Name</Spreadsheet.Head>
					<Spreadsheet.Head>Units/carton</Spreadsheet.Head>
					<Spreadsheet.Head>
						<span className="sr-only">Actions</span>
					</Spreadsheet.Head>
				</tr>
			</Spreadsheet.Header>
			<Spreadsheet.Body>
				{rows.map((row, index) => (
					<Spreadsheet.Row key={row.id}>
						<Spreadsheet.Cell>
							<Input
								aria-label={`Row ${index + 1} name`}
								value={row.name}
								onChange={(event) =>
									updateRow(row.id, { name: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.Cell>
							<Input
								type="number"
								aria-label={`Row ${index + 1} units per carton`}
								value={row.quantity}
								onChange={(event) =>
									updateRow(row.id, { quantity: event.target.value })
								}
							/>
						</Spreadsheet.Cell>
						<Spreadsheet.RowActions>
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label={`Delete row ${index + 1}`}
								onClick={() => removeRow(row.id)}
							>
								<TrashIcon />
							</Button>
						</Spreadsheet.RowActions>
					</Spreadsheet.Row>
				))}
				<Spreadsheet.AddRow colSpan={3} onClick={addRow}>
					Add a row
				</Spreadsheet.AddRow>
			</Spreadsheet.Body>
		</Spreadsheet.Root>
	);
}

/**
 * Below `md` the table swaps for a card per row (`renderMobileRow` +
 * `rowCount`): the SAME controlled state renders as labelled vertical fields
 * with a delete button, and `mobileAddRow` replaces the add row under the
 * stack - a dense grid is not editable with a thumb. Narrow the viewport (or
 * pick a mobile one in the toolbar) to see the swap.
 */
export const MobileCards: Story = {
	globals: { viewport: { value: "mobile2", isRotated: false } },
	render: () => <MobileCardsExample />,
};
