import { Badge } from "@voila.dev/ui/components/badge";
import {
	type ColumnDef,
	DataTable,
	DataTableActions,
	type DataTableDensity,
	DataTableDensityToggle,
	DataTableExport,
	DataTableSearch,
	DataTableToolbar,
	DataTableViewOptions,
	dataTableSelectionColumn,
} from "@voila.dev/ui-datatable/components/data-table";
import { useState } from "react";

interface Mission {
	reference: string;
	club: string;
	specialty: string;
	status: "Confirmed" | "Pending" | "Completed";
	amount: number;
}

const STATUS_COLOR = {
	Confirmed: "green",
	Pending: "amber",
	Completed: "gray",
} as const;

const MISSIONS: Mission[] = [
	{
		reference: "MIS-001",
		club: "Riverside Rugby",
		specialty: "Physiotherapist",
		status: "Confirmed",
		amount: 180,
	},
	{
		reference: "MIS-002",
		club: "Northgate FC",
		specialty: "Osteopath",
		status: "Pending",
		amount: 240,
	},
	{
		reference: "MIS-003",
		club: "Harbour Athletics",
		specialty: "Nurse",
		status: "Confirmed",
		amount: 150,
	},
	{
		reference: "MIS-004",
		club: "Eastfield United",
		specialty: "Physiotherapist",
		status: "Completed",
		amount: 210,
	},
	{
		reference: "MIS-005",
		club: "Southbank Swim",
		specialty: "Sports doctor",
		status: "Pending",
		amount: 320,
	},
];

const columns: ColumnDef<Mission>[] = [
	{ accessorKey: "reference", header: "Reference", size: 130 },
	{ accessorKey: "club", header: "Club" },
	{ accessorKey: "specialty", header: "Specialty" },
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge color={STATUS_COLOR[row.original.status]}>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "amount",
		header: "Amount",
		size: 110,
		cell: ({ row }) => `€${row.original.amount}`,
	},
];

export function Default() {
	return (
		<div className="w-full">
			<DataTable columns={columns} data={MISSIONS} />
		</div>
	);
}

export function Selection() {
	return (
		<div className="w-full">
			<DataTable
				columns={[
					dataTableSelectionColumn<Mission>({
						selectAllLabel: "Select all missions",
						selectRowLabel: (mission) => `Select ${mission.reference}`,
					}),
					...columns,
				]}
				data={MISSIONS}
				enableRowSelection
				getRowId={(mission) => mission.reference}
			/>
		</div>
	);
}

export function Resizing() {
	return (
		<div className="w-full">
			<DataTable columns={columns} data={MISSIONS} enableColumnResizing />
		</div>
	);
}

export function Pinning() {
	return (
		// Narrow on purpose: pinning only shows itself once the table has to pan.
		<div className="w-full max-w-md">
			<DataTable
				columns={columns}
				data={MISSIONS}
				columnPinning={{ left: ["reference"], right: ["amount"] }}
			/>
		</div>
	);
}

export function ViewOptions() {
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={MISSIONS}
				toolbar={(table) => (
					<DataTableToolbar>
						<DataTableActions>
							<DataTableViewOptions table={table} />
							<DataTableExport table={table} filename="missions.csv" />
						</DataTableActions>
					</DataTableToolbar>
				)}
			/>
		</div>
	);
}

export function Density() {
	const [density, setDensity] = useState<DataTableDensity>("compact");
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={MISSIONS}
				density={density}
				toolbar={
					<DataTableToolbar>
						<DataTableActions>
							<DataTableDensityToggle
								density={density}
								onDensityChange={setDensity}
							/>
						</DataTableActions>
					</DataTableToolbar>
				}
			/>
		</div>
	);
}

export function Expansion() {
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={MISSIONS}
				renderExpandedRow={(mission) => (
					<dl className="grid gap-1 text-sm sm:grid-cols-2">
						<div>
							<dt className="inline text-muted-foreground">Club: </dt>
							<dd className="inline">{mission.club}</dd>
						</div>
						<div>
							<dt className="inline text-muted-foreground">Specialty: </dt>
							<dd className="inline">{mission.specialty}</dd>
						</div>
					</dl>
				)}
			/>
		</div>
	);
}

export function GlobalFilter() {
	const [search, setSearch] = useState("phys");
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={MISSIONS}
				globalFilter={search}
				toolbar={
					<DataTableToolbar>
						<DataTableSearch
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search missions"
						/>
					</DataTableToolbar>
				}
			/>
		</div>
	);
}

export function Export() {
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={MISSIONS}
				toolbar={(table) => (
					<DataTableToolbar>
						<DataTableActions>
							<DataTableExport table={table} filename="missions.csv" />
						</DataTableActions>
					</DataTableToolbar>
				)}
			/>
		</div>
	);
}

export function Pagination() {
	const [page, setPage] = useState(0);
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={MISSIONS.slice(page * 2, page * 2 + 2)}
				pagination={{
					page,
					pageSize: 2,
					total: MISSIONS.length,
					onPageChange: setPage,
				}}
			/>
		</div>
	);
}
