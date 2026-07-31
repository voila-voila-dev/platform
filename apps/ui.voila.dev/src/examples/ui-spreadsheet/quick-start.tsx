import { Input } from "@voila.dev/ui/input";
import { Spreadsheet } from "@voila.dev/ui/spreadsheet";
import { useState } from "react";

interface Variant {
	id: number;
	name: string;
	reference: string;
	stock: string;
}

const VARIANTS: Variant[] = [
	{ id: 1, name: "Nitrile gloves S", reference: "ESS-001", stock: "120" },
	{ id: 2, name: "Nitrile gloves M", reference: "ESS-002", stock: "64" },
	{ id: 3, name: "Nitrile gloves L", reference: "ESS-003", stock: "0" },
];

export function Grid() {
	const [rows, setRows] = useState(VARIANTS);
	const updateRow = (id: number, patch: Partial<Variant>) =>
		setRows((previous) =>
			previous.map((row) => (row.id === id ? { ...row, ...patch } : row)),
		);
	return (
		<div className="w-full">
			<Spreadsheet.Root>
				<Spreadsheet.Columns>
					<Spreadsheet.Column />
					<Spreadsheet.Column width={130} />
					<Spreadsheet.Column width={100} />
				</Spreadsheet.Columns>
				<Spreadsheet.Header>
					<tr>
						<Spreadsheet.Head>Name</Spreadsheet.Head>
						<Spreadsheet.Head>Reference</Spreadsheet.Head>
						<Spreadsheet.Head>Stock</Spreadsheet.Head>
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
									aria-label={`Row ${index + 1} stock`}
									value={row.stock}
									onChange={(event) =>
										updateRow(row.id, { stock: event.target.value })
									}
								/>
							</Spreadsheet.Cell>
						</Spreadsheet.Row>
					))}
				</Spreadsheet.Body>
			</Spreadsheet.Root>
		</div>
	);
}
