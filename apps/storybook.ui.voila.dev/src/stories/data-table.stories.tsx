import { ExportIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Badge } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { CardGallery } from "@voila.dev/ui/card-gallery";
import {
	type ColumnDef,
	DataTable,
	type DataTableView,
	dataTableSelectionColumn,
	type RowSelectionState,
} from "@voila.dev/ui/data-table";
import { Select } from "@voila.dev/ui/select";
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

/** The same rows with enough columns to force a horizontal scroll. */
const wideColumns: ColumnDef<Project>[] = [
	{ accessorKey: "reference", header: "Reference", size: 110 },
	{ accessorKey: "client", header: "Client", size: 180 },
	{ accessorKey: "specialty", header: "Specialty", size: 160 },
	{
		accessorKey: "status",
		header: "Status",
		size: 140,
		cell: ({ row }) => (
			<Badge color={statusColor[row.original.status]}>
				{row.original.status}
			</Badge>
		),
	},
	{
		id: "owner",
		header: "Owner",
		size: 160,
		accessorFn: (project) => project.client,
	},
	{
		id: "renewal",
		header: "Renewal",
		size: 160,
		accessorFn: (project) => project.reference,
	},
	{
		accessorKey: "amount",
		header: () => <span className="block w-full text-right">Amount</span>,
		size: 140,
		cell: ({ row }) => (
			<span className="block text-right tabular-nums">
				{row.original.amount.toFixed(2)} USD
			</span>
		),
	},
];

const meta = {
	title: "DataTable/DataTable",
	component: DataTable.Root,
	tags: ["autodocs"],
	args: { columns, data: projects },
} satisfies Meta<typeof DataTable.Root<Project, unknown>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<DataTable.Root columns={columns} data={projects.slice(0, 5)} />
	),
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
		<DataTable.Root
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
				<DataTable.Toolbar>
					<DataTable.Search
						placeholder="Search projects..."
						value={search}
						onChange={(event) => {
							setSearch(event.target.value);
							setPage(0);
						}}
					/>
					<DataTable.Filters>
						<Select.Root
							value={status}
							onValueChange={(value) => {
								setStatus(value as string | null);
								setPage(0);
							}}
						>
							<Select.Trigger className="w-40">
								<Select.Value placeholder="All statuses" />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={null}>All statuses</Select.Item>
								<Select.Item value="Confirmed">Confirmed</Select.Item>
								<Select.Item value="Pending">Pending</Select.Item>
								<Select.Item value="Completed">Completed</Select.Item>
							</Select.Content>
						</Select.Root>
					</DataTable.Filters>
					<DataTable.Actions>
						<Button variant="outline" size="sm">
							<ExportIcon data-icon="inline-start" />
							Export
						</Button>
					</DataTable.Actions>
				</DataTable.Toolbar>
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
		<DataTable.Root
			columns={columns}
			data={projects}
			stickyHeader
			containerClassName="max-h-64"
		/>
	),
};

export const Loading: Story = {
	render: () => (
		<DataTable.Root columns={columns} data={projects.slice(0, 5)} loading />
	),
};

export const EmptyState: Story = {
	render: () => <DataTable.Root columns={columns} data={[]} />,
};

/** With `renderMobileCard`, the table is replaced below the `md` breakpoint by
 * a card list built from the same (sorted) rows — narrow the viewport to see
 * it. */
export const MobileCards: Story = {
	render: () => (
		<DataTable.Root
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

/** The floating bulk-action bar: portalled above the bottom edge, so showing
 * or clearing a selection never shifts the table behind it. "Select all"
 * appears while the selection is partial and flips the bar into all-rows
 * mode. */
function SelectionBarExample() {
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
	const [allSelected, setAllSelected] = useState(false);

	const selectedCount = allSelected
		? projects.length
		: Object.values(rowSelection).filter(Boolean).length;

	const clear = () => {
		setRowSelection({});
		setAllSelected(false);
	};

	return (
		<>
			<DataTable.Root
				columns={[dataTableSelectionColumn<Project>(), ...columns]}
				data={projects}
				enableRowSelection
				getRowId={(project) => project.reference}
				rowSelection={rowSelection}
				onRowSelectionChange={(selection) => {
					// Touching any checkbox narrows an "all rows" selection back
					// down to the visible picks.
					setAllSelected(false);
					setRowSelection(selection);
				}}
			/>
			<DataTable.SelectionBar
				count={selectedCount}
				label={`${selectedCount} selected`}
				onClear={clear}
				clearLabel="Clear selection"
				selectAll={
					allSelected
						? undefined
						: {
								label: `Select all ${projects.length}`,
								onSelect: () => setAllSelected(true),
							}
				}
			>
				<Button type="button" variant="outline" size="sm" onClick={clear}>
					Archive
				</Button>
			</DataTable.SelectionBar>
		</>
	);
}

export const SelectionBar: Story = {
	render: () => <SelectionBarExample />,
};

interface Organization {
	name: string;
	category: string;
	logo?: string;
}

function organizationLogo(initials: string, background: string) {
	return `data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${background}"/><text x="48" y="61" font-family="system-ui, sans-serif" font-size="34" font-weight="600" fill="#fff" text-anchor="middle">${initials}</text></svg>`,
	)}`;
}

const organizations: Organization[] = [
	{
		name: "Riverside Studio",
		category: "Design studio",
		logo: organizationLogo("RS", "#0e7490"),
	},
	{
		name: "Northgate Labs",
		category: "Research",
		logo: organizationLogo("NL", "#7c3aed"),
	},
	{
		name: "Harbour Media",
		category: "Media production",
		logo: organizationLogo("HM", "#ea580c"),
	},
	{
		name: "Eastfield Group",
		category: "Consulting",
		logo: organizationLogo("EG", "#16a34a"),
	},
	{
		name: "Southbank Digital",
		category: "Software",
		logo: organizationLogo("SD", "#2563eb"),
	},
	{ name: "Old Town Press", category: "Publishing" },
	{
		name: "Westside Ventures",
		category: "Finance",
		logo: organizationLogo("WV", "#ca8a04"),
	},
	{
		name: "Lakeside Health",
		category: "Healthcare",
		logo: organizationLogo("LH", "#dc2626"),
	},
	{
		name: "Highfield Energy",
		category: "Renewables",
		logo: organizationLogo("HE", "#db2777"),
	},
	{ name: "Millbrook Archive", category: "Heritage" },
];

const organizationColumns: ColumnDef<Organization>[] = [
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "category", header: "Category" },
];

/**
 * `view="gallery"` turns the filtered rows into a `CardGallery` grid — logo
 * large, name below, category last. `DataTable.ViewToggle` flips between the
 * two layouts, the toolbar's search keeps filtering either one, and the
 * `pagination` footer is equally at home in both — omitted here to show the
 * whole directory at once.
 */
function GalleryViewExample() {
	const [view, setView] = useState<DataTableView>("gallery");
	const [search, setSearch] = useState("");

	return (
		<DataTable.Root
			columns={organizationColumns}
			data={organizations}
			globalFilter={search}
			view={view}
			renderGalleryCard={(organization) => (
				<>
					<CardGallery.Logo src={organization.logo}>
						{organization.name.charAt(0)}
					</CardGallery.Logo>
					<CardGallery.Title>{organization.name}</CardGallery.Title>
					<CardGallery.Description>
						{organization.category}
					</CardGallery.Description>
				</>
			)}
			toolbar={
				<DataTable.Toolbar>
					<DataTable.Search
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search organizations..."
					/>
					<DataTable.Actions>
						<DataTable.ViewToggle view={view} onViewChange={setView} />
					</DataTable.Actions>
				</DataTable.Toolbar>
			}
		/>
	);
}

export const GalleryView: Story = {
	render: () => <GalleryViewExample />,
};

/**
 * Pinned columns stay put while the rest scrolls sideways. The frozen cells
 * carry the row's own background, so hover and selection reach them without
 * the scrolled columns showing through.
 */
export const PinnedColumns: Story = {
	render: () => (
		<div className="max-w-lg">
			<DataTable.Root
				columns={wideColumns}
				data={projects}
				columnPinning={{ left: ["reference", "client"], right: ["amount"] }}
				onRowClick={() => {}}
			/>
		</div>
	),
};
