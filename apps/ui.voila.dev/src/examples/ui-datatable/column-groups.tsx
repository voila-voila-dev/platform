import {
	type ColumnDef,
	DataTable,
	type DataTableFeatures,
} from "@voila.dev/ui/data-table";

interface Campaign {
	name: string;
	emailOpened: number;
	emailClicked: number;
	smsClicked: number;
}

const CAMPAIGNS: Campaign[] = [
	{
		name: "Spring launch",
		emailOpened: 0.54,
		emailClicked: 0.24,
		smsClicked: 0.22,
	},
	{
		name: "Summer sale",
		emailOpened: 0.33,
		emailClicked: 0.09,
		smsClicked: 0.17,
	},
	{
		name: "Back to school",
		emailOpened: 0.61,
		emailClicked: 0.31,
		smsClicked: 0.36,
	},
];

const rate = (value: number) => `${Math.round(value * 100)} %`;

export const columns: ColumnDef<DataTableFeatures, Campaign>[] = [
	{ accessorKey: "name", header: "Campaign" },
	{
		id: "email",
		header: "Email",
		columns: [
			{
				accessorKey: "emailOpened",
				header: "Opened",
				cell: ({ row }) => rate(row.original.emailOpened),
			},
			{
				accessorKey: "emailClicked",
				header: "Clicked",
				cell: ({ row }) => rate(row.original.emailClicked),
			},
		],
	},
	{
		id: "sms",
		header: "SMS",
		columns: [
			{
				accessorKey: "smsClicked",
				header: "Clicked",
				cell: ({ row }) => rate(row.original.smsClicked),
			},
		],
	},
];

export function Groups() {
	return (
		<DataTable.Root
			columns={columns}
			data={CAMPAIGNS}
			initialSorting={[{ id: "emailClicked", desc: false }]}
		/>
	);
}
