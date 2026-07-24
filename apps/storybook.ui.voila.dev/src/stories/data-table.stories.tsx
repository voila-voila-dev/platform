import { ExportIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@voila.dev/ui/components/select";
import {
	type ColumnDef,
	DataTable,
	DataTableActions,
	DataTableFilters,
	DataTableSearch,
	DataTableToolbar,
	dataTableSelectionColumn,
} from "@voila.dev/ui-datatable/components/data-table";
import { useMemo, useState } from "react";

interface Project {
	reference: string;
	client: string;
	specialty: string;
	status: "Confirmed" | "Pending" | "Completed";
	amount: number;
}

const projects: Project[] = [
	{
		reference: "PRJ-001",
		client: "Northwind Labs",
		specialty: "Designer",
		status: "Confirmed",
		amount: 180,
	},
	{
		reference: "PRJ-002",
		client: "Globex Media",
		specialty: "Developer",
		status: "Pending",
		amount: 240,
	},
	{
		reference: "PRJ-003",
		client: "Initech Systems",
		specialty: "Copywriter",
		status: "Confirmed",
		amount: 150,
	},
	{
		reference: "PRJ-004",
		client: "Umbrella Retail",
		specialty: "Designer",
		status: "Completed",
		amount: 210,
	},
	{
		reference: "PRJ-005",
		client: "Stark Industries",
		specialty: "Data analyst",
		status: "Pending",
		amount: 320,
	},
	{
		reference: "PRJ-006",
		client: "Wayne Ventures",
		specialty: "Designer",
		status: "Confirmed",
		amount: 195,
	},
	{
		reference: "PRJ-007",
		client: "Hooli Cloud",
		specialty: "Developer",
		status: "Completed",
		amount: 225,
	},
	{
		reference: "PRJ-008",
		client: "Pied Piper",
		specialty: "Copywriter",
		status: "Pending",
		amount: 140,
	},
	{
		reference: "PRJ-009",
		client: "Vandelay Studio",
		specialty: "Designer",
		status: "Confirmed",
		amount: 185,
	},
	{
		reference: "PRJ-010",
		client: "Wonka Digital",
		specialty: "Data analyst",
		status: "Completed",
		amount: 300,
	},
	{
		reference: "PRJ-011",
		client: "Dunder Mifflin",
		specialty: "Developer",
		status: "Pending",
		amount: 230,
	},
	{
		reference: "PRJ-012",
		client: "Massive Dynamic",
		specialty: "Copywriter",
		status: "Confirmed",
		amount: 155,
	},
];

const statusColor = {
	Confirmed: "green",
	Pending: "amber",
	Completed: "gray",
} as const;

const columns: ColumnDef<Project>[] = [
	{ accessorKey: "reference", header: "Reference", size: 110 },
	{ accessorKey: "client", header: "Client" },
	{ accessorKey: "specialty", header: "Specialty" },
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => (
			<Badge color={statusColor[row.original.status]}>
				{row.original.status}
			</Badge>
		),
	},
	{
		accessorKey: "amount",
		header: () => <span className="block w-full text-right">Amount</span>,
		cell: ({ row }) => (
			<span className="block text-right tabular-nums">
				{row.original.amount.toFixed(2)} USD
			</span>
		),
	},
];

const meta = {
	title: "DataTable/DataTable",
	component: DataTable,
	tags: ["autodocs"],
	args: { columns, data: projects },
} satisfies Meta<typeof DataTable<Project, unknown>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <DataTable columns={columns} data={projects.slice(0, 5)} />,
};

/**
 * The full recipe: toolbar emplacements (search at the start, filters next to
 * it, end-aligned actions), a selection column, sortable headers and the
 * windowed pagination footer. Search/filter/page state lives with the
 * consumer - here client-side, in the apps usually as server query params.
 */
function FullRecipeExample() {
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [page, setPage] = useState(0);
	const pageSize = 5;

	const filtered = useMemo(
		() =>
			projects.filter(
				(project) =>
					(status === null || project.status === status) &&
					`${project.reference} ${project.client} ${project.specialty}`
						.toLowerCase()
						.includes(search.toLowerCase()),
			),
		[search, status],
	);
	const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

	return (
		<DataTable
			columns={[
				dataTableSelectionColumn<Project>({
					selectAllLabel: "Select all projects",
					selectRowLabel: (project) => `Select ${project.reference}`,
				}),
				...columns,
			]}
			data={pageRows}
			enableRowSelection
			getRowId={(project) => project.reference}
			toolbar={
				<DataTableToolbar>
					<DataTableSearch
						placeholder="Search projects..."
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(0);
						}}
					/>
					<DataTableFilters>
						<Select
							value={status}
							onValueChange={(value) => {
								setStatus(value as string | null);
								setPage(0);
							}}
						>
							<SelectTrigger className="w-40">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={null}>All statuses</SelectItem>
								<SelectItem value="Confirmed">Confirmed</SelectItem>
								<SelectItem value="Pending">Pending</SelectItem>
								<SelectItem value="Completed">Completed</SelectItem>
							</SelectContent>
						</Select>
					</DataTableFilters>
					<DataTableActions>
						<Button variant="outline" size="sm">
							<ExportIcon data-icon="inline-start" />
							Export
						</Button>
					</DataTableActions>
				</DataTableToolbar>
			}
			pagination={{
				page,
				pageSize,
				total: filtered.length,
				onPageChange: setPage,
			}}
		/>
	);
}

export const FullRecipe: Story = {
	render: () => <FullRecipeExample />,
};

/** `stickyHeader` + a bounded `containerClassName` height keep the header row
 * pinned while the body scrolls. */
export const StickyHeader: Story = {
	render: () => (
		<DataTable
			columns={columns}
			data={projects}
			stickyHeader
			containerClassName="max-h-64"
		/>
	),
};

export const Loading: Story = {
	render: () => (
		<DataTable columns={columns} data={projects.slice(0, 5)} loading />
	),
};

export const EmptyState: Story = {
	render: () => <DataTable columns={columns} data={[]} />,
};

/** With `renderMobileCard`, the table is replaced below the `md` breakpoint by
 * a card list built from the same (sorted) rows — narrow the viewport to see
 * it. */
export const MobileCards: Story = {
	render: () => (
		<DataTable
			columns={columns}
			data={projects.slice(0, 5)}
			initialSorting={[{ id: "client", desc: false }]}
			renderMobileCard={(project) => (
				<div className="flex items-center justify-between gap-2">
					<div>
						<p className="font-medium">{project.client}</p>
						<p className="text-muted-foreground text-sm">
							{project.reference} · {project.specialty}
						</p>
					</div>
					<Badge color={statusColor[project.status]}>{project.status}</Badge>
				</div>
			)}
		/>
	),
};
