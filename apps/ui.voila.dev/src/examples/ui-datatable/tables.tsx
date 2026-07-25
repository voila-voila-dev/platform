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
} from "@voila.dev/ui/datatable";
import { useState } from "react";

interface Project {
	reference: string;
	client: string;
	role: string;
	status: "Confirmed" | "Pending" | "Completed";
	amount: number;
}

const STATUS_COLOR = {
	Confirmed: "green",
	Pending: "amber",
	Completed: "gray",
} as const;

const PROJECTS: Project[] = [
	{
		reference: "PRJ-001",
		client: "Riverside Studio",
		role: "Designer",
		status: "Confirmed",
		amount: 180,
	},
	{
		reference: "PRJ-002",
		client: "Northgate Labs",
		role: "Developer",
		status: "Pending",
		amount: 240,
	},
	{
		reference: "PRJ-003",
		client: "Harbour Media",
		role: "Copywriter",
		status: "Confirmed",
		amount: 150,
	},
	{
		reference: "PRJ-004",
		client: "Eastfield Group",
		role: "Designer",
		status: "Completed",
		amount: 210,
	},
	{
		reference: "PRJ-005",
		client: "Southbank Digital",
		role: "Consultant",
		status: "Pending",
		amount: 320,
	},
];

const columns: ColumnDef<Project>[] = [
	{ accessorKey: "reference", header: "Reference", size: 130 },
	{ accessorKey: "client", header: "Client" },
	{ accessorKey: "role", header: "Role" },
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
		cell: ({ row }) => `$${row.original.amount}`,
	},
];

export function Hero() {
	const [search, setSearch] = useState("");
	return (
		<div className="w-full">
			<DataTable
				columns={[
					dataTableSelectionColumn<Project>({
						selectAllLabel: "Select all projects",
						selectRowLabel: (project) => `Select ${project.reference}`,
					}),
					...columns,
				]}
				data={PROJECTS}
				enableRowSelection
				getRowId={(project) => project.reference}
				globalFilter={search}
				toolbar={(table) => (
					<DataTableToolbar>
						<DataTableSearch
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search projects"
						/>
						<DataTableActions>
							<DataTableViewOptions table={table} />
							<DataTableExport table={table} filename="projects.csv" />
						</DataTableActions>
					</DataTableToolbar>
				)}
			/>
		</div>
	);
}

export function Default() {
	return (
		<div className="w-full">
			<DataTable columns={columns} data={PROJECTS} />
		</div>
	);
}

export function Selection() {
	return (
		<div className="w-full">
			<DataTable
				columns={[
					dataTableSelectionColumn<Project>({
						selectAllLabel: "Select all projects",
						selectRowLabel: (project) => `Select ${project.reference}`,
					}),
					...columns,
				]}
				data={PROJECTS}
				enableRowSelection
				getRowId={(project) => project.reference}
			/>
		</div>
	);
}

export function Resizing() {
	return (
		<div className="w-full">
			<DataTable columns={columns} data={PROJECTS} enableColumnResizing />
		</div>
	);
}

export function Pinning() {
	return (
		// Narrow on purpose: pinning only shows itself once the table has to pan.
		<div className="w-full max-w-md">
			<DataTable
				columns={columns}
				data={PROJECTS}
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
				data={PROJECTS}
				toolbar={(table) => (
					<DataTableToolbar>
						<DataTableActions>
							<DataTableViewOptions table={table} />
							<DataTableExport table={table} filename="projects.csv" />
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
				data={PROJECTS}
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
				data={PROJECTS}
				renderExpandedRow={(project) => (
					<dl className="grid gap-1 text-sm sm:grid-cols-2">
						<div>
							<dt className="inline text-muted-foreground">Client: </dt>
							<dd className="inline">{project.client}</dd>
						</div>
						<div>
							<dt className="inline text-muted-foreground">Role: </dt>
							<dd className="inline">{project.role}</dd>
						</div>
					</dl>
				)}
			/>
		</div>
	);
}

export function GlobalFilter() {
	const [search, setSearch] = useState("des");
	return (
		<div className="w-full">
			<DataTable
				columns={columns}
				data={PROJECTS}
				globalFilter={search}
				toolbar={
					<DataTableToolbar>
						<DataTableSearch
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search projects"
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
				data={PROJECTS}
				toolbar={(table) => (
					<DataTableToolbar>
						<DataTableActions>
							<DataTableExport table={table} filename="projects.csv" />
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
				data={PROJECTS.slice(page * 2, page * 2 + 2)}
				pagination={{
					page,
					pageSize: 2,
					total: PROJECTS.length,
					onPageChange: setPage,
				}}
			/>
		</div>
	);
}
