import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@voila.dev/ui/components/checkbox";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@voila.dev/ui/components/table";

const missions = [
	{
		reference: "MIS-001",
		club: "Stade Rochelais",
		specialty: "Physiotherapist",
		status: "Confirmed",
		amount: "180.00 EUR",
	},
	{
		reference: "MIS-002",
		club: "RC Vannes",
		specialty: "Osteopath",
		status: "Pending",
		amount: "240.00 EUR",
	},
	{
		reference: "MIS-003",
		club: "US Carcassonne",
		specialty: "Nurse",
		status: "Confirmed",
		amount: "150.00 EUR",
	},
	{
		reference: "MIS-004",
		club: "Provence Rugby",
		specialty: "Physiotherapist",
		status: "Completed",
		amount: "210.00 EUR",
	},
];

const meta = {
	title: "UI/Table",
	component: Table,
	tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Table>
			<TableCaption>Recent missions for your organization.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Reference</TableHead>
					<TableHead>Club</TableHead>
					<TableHead>Specialty</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{missions.map((mission) => (
					<TableRow key={mission.reference}>
						<TableCell className="font-medium">{mission.reference}</TableCell>
						<TableCell>{mission.club}</TableCell>
						<TableCell>{mission.specialty}</TableCell>
						<TableCell>{mission.status}</TableCell>
						<TableCell className="text-right">{mission.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Reference</TableHead>
					<TableHead>Club</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{missions.map((mission) => (
					<TableRow key={mission.reference}>
						<TableCell className="font-medium">{mission.reference}</TableCell>
						<TableCell>{mission.club}</TableCell>
						<TableCell className="text-right">{mission.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={2}>Total</TableCell>
					<TableCell className="text-right">780.00 EUR</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	),
};

export const WithSelection: Story = {
	render: () => (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>
						<Checkbox aria-label="Select all missions" />
					</TableHead>
					<TableHead>Reference</TableHead>
					<TableHead>Club</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{missions.map((mission, index) => {
					const selected = index < 2;
					return (
						<TableRow
							key={mission.reference}
							data-selected={selected || undefined}
						>
							<TableCell>
								<Checkbox
									aria-label={`Select ${mission.reference}`}
									defaultChecked={selected}
								/>
							</TableCell>
							<TableCell className="font-medium">{mission.reference}</TableCell>
							<TableCell>{mission.club}</TableCell>
							<TableCell className="text-right">{mission.amount}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	),
};
