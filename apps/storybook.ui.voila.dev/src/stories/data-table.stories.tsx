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

interface Mission {
	reference: string;
	club: string;
	specialty: string;
	status: "Confirmed" | "Pending" | "Completed";
	amount: number;
}

const missions: Mission[] = [
	{
		reference: "MIS-001",
		club: "Stade Rochelais",
		specialty: "Physiotherapist",
		status: "Confirmed",
		amount: 180,
	},
	{
		reference: "MIS-002",
		club: "RC Vannes",
		specialty: "Osteopath",
		status: "Pending",
		amount: 240,
	},
	{
		reference: "MIS-003",
		club: "US Carcassonne",
		specialty: "Nurse",
		status: "Confirmed",
		amount: 150,
	},
	{
		reference: "MIS-004",
		club: "Provence Rugby",
		specialty: "Physiotherapist",
		status: "Completed",
		amount: 210,
	},
	{
		reference: "MIS-005",
		club: "Aviron Bayonnais",
		specialty: "Sports doctor",
		status: "Pending",
		amount: 320,
	},
	{
		reference: "MIS-006",
		club: "Biarritz Olympique",
		specialty: "Physiotherapist",
		status: "Confirmed",
		amount: 195,
	},
	{
		reference: "MIS-007",
		club: "Colomiers Rugby",
		specialty: "Osteopath",
		status: "Completed",
		amount: 225,
	},
	{
		reference: "MIS-008",
		club: "Stade Montois",
		specialty: "Nurse",
		status: "Pending",
		amount: 140,
	},
	{
		reference: "MIS-009",
		club: "USON Nevers",
		specialty: "Physiotherapist",
		status: "Confirmed",
		amount: 185,
	},
	{
		reference: "MIS-010",
		club: "Rouen Normandie",
		specialty: "Sports doctor",
		status: "Completed",
		amount: 300,
	},
	{
		reference: "MIS-011",
		club: "Soyaux Angoulême",
		specialty: "Osteopath",
		status: "Pending",
		amount: 230,
	},
	{
		reference: "MIS-012",
		club: "Valence Romans",
		specialty: "Nurse",
		status: "Confirmed",
		amount: 155,
	},
];

const statusColor = {
	Confirmed: "green",
	Pending: "amber",
	Completed: "gray",
} as const;

const columns: ColumnDef<Mission>[] = [
	{ accessorKey: "reference", header: "Reference", size: 110 },
	{ accessorKey: "club", header: "Club" },
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
				{row.original.amount.toFixed(2)} EUR
			</span>
		),
	},
];

const meta = {
	title: "DataTable/DataTable",
	component: DataTable,
	tags: ["autodocs"],
	args: { columns, data: missions },
} satisfies Meta<typeof DataTable<Mission, unknown>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <DataTable columns={columns} data={missions.slice(0, 5)} />,
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
			missions.filter(
				(mission) =>
					(status === null || mission.status === status) &&
					`${mission.reference} ${mission.club} ${mission.specialty}`
						.toLowerCase()
						.includes(search.toLowerCase()),
			),
		[search, status],
	);
	const pageRows = filtered.slice(page * pageSize, (page + 1) * pageSize);

	return (
		<DataTable
			columns={[
				dataTableSelectionColumn<Mission>({
					selectAllLabel: "Select all missions",
					selectRowLabel: (mission) => `Select ${mission.reference}`,
				}),
				...columns,
			]}
			data={pageRows}
			enableRowSelection
			getRowId={(mission) => mission.reference}
			toolbar={
				<DataTableToolbar>
					<DataTableSearch
						placeholder="Search missions..."
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
			data={missions}
			stickyHeader
			containerClassName="max-h-64"
		/>
	),
};

export const Loading: Story = {
	render: () => (
		<DataTable columns={columns} data={missions.slice(0, 5)} loading />
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
			data={missions.slice(0, 5)}
			initialSorting={[{ id: "club", desc: false }]}
			renderMobileCard={(mission) => (
				<div className="flex items-center justify-between gap-2">
					<div>
						<p className="font-medium">{mission.club}</p>
						<p className="text-muted-foreground text-sm">
							{mission.reference} · {mission.specialty}
						</p>
					</div>
					<Badge color={statusColor[mission.status]}>{mission.status}</Badge>
				</div>
			)}
		/>
	),
};
