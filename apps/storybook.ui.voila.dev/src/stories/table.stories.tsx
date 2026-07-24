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

const projects = [
	{
		reference: "PRJ-001",
		client: "Northwind Studio",
		role: "Designer",
		status: "Confirmed",
		amount: "180.00 USD",
	},
	{
		reference: "PRJ-002",
		client: "Globex Labs",
		role: "Developer",
		status: "Pending",
		amount: "240.00 USD",
	},
	{
		reference: "PRJ-003",
		client: "Initech Media",
		role: "Copywriter",
		status: "Confirmed",
		amount: "150.00 USD",
	},
	{
		reference: "PRJ-004",
		client: "Umbrella Digital",
		role: "Designer",
		status: "Completed",
		amount: "210.00 USD",
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
			<TableCaption>Recent projects for your workspace.</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Reference</TableHead>
					<TableHead>Client</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Status</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => (
					<TableRow key={project.reference}>
						<TableCell className="font-medium">{project.reference}</TableCell>
						<TableCell>{project.client}</TableCell>
						<TableCell>{project.role}</TableCell>
						<TableCell>{project.status}</TableCell>
						<TableCell className="text-right">{project.amount}</TableCell>
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
					<TableHead>Client</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project) => (
					<TableRow key={project.reference}>
						<TableCell className="font-medium">{project.reference}</TableCell>
						<TableCell>{project.client}</TableCell>
						<TableCell className="text-right">{project.amount}</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell colSpan={2}>Total</TableCell>
					<TableCell className="text-right">780.00 USD</TableCell>
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
						<Checkbox aria-label="Select all projects" />
					</TableHead>
					<TableHead>Reference</TableHead>
					<TableHead>Client</TableHead>
					<TableHead className="text-right">Amount</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{projects.map((project, index) => {
					const selected = index < 2;
					return (
						<TableRow
							key={project.reference}
							data-selected={selected || undefined}
						>
							<TableCell>
								<Checkbox
									aria-label={`Select ${project.reference}`}
									defaultChecked={selected}
								/>
							</TableCell>
							<TableCell className="font-medium">{project.reference}</TableCell>
							<TableCell>{project.client}</TableCell>
							<TableCell className="text-right">{project.amount}</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	),
};
