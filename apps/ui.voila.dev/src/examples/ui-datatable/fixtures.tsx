import { Badge } from "@voila.dev/ui/badge";
import type { ColumnDef } from "@voila.dev/ui/data-table";

export interface Project {
	reference: string;
	client: string;
	role: string;
	status: "Confirmed" | "Pending" | "Completed";
	amount: number;
}

export const STATUS_COLOR = {
	Confirmed: "green",
	Pending: "amber",
	Completed: "gray",
} as const;

export const PROJECTS: Project[] = [
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

export const columns: ColumnDef<Project>[] = [
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
