import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Checkbox } from "@voila.dev/ui/checkbox";
import { Table } from "@voila.dev/ui/table";

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
	component: Table.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Table.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Table.Root>
			<Table.Caption>Recent projects for your workspace.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Reference</Table.Head>
					<Table.Head>Client</Table.Head>
					<Table.Head>Role</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head className="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{projects.map((project) => (
					<Table.Row key={project.reference}>
						<Table.Cell className="font-medium">{project.reference}</Table.Cell>
						<Table.Cell>{project.client}</Table.Cell>
						<Table.Cell>{project.role}</Table.Cell>
						<Table.Cell>{project.status}</Table.Cell>
						<Table.Cell className="text-right">{project.amount}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Reference</Table.Head>
					<Table.Head>Client</Table.Head>
					<Table.Head className="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{projects.map((project) => (
					<Table.Row key={project.reference}>
						<Table.Cell className="font-medium">{project.reference}</Table.Cell>
						<Table.Cell>{project.client}</Table.Cell>
						<Table.Cell className="text-right">{project.amount}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colSpan={2}>Total</Table.Cell>
					<Table.Cell className="text-right">780.00 USD</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	),
};

export const WithSelection: Story = {
	render: () => (
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>
						<Checkbox aria-label="Select all projects" />
					</Table.Head>
					<Table.Head>Reference</Table.Head>
					<Table.Head>Client</Table.Head>
					<Table.Head className="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{projects.map((project, index) => {
					const selected = index < 2;
					return (
						<Table.Row
							key={project.reference}
							data-selected={selected || undefined}
						>
							<Table.Cell>
								<Checkbox
									aria-label={`Select ${project.reference}`}
									defaultChecked={selected}
								/>
							</Table.Cell>
							<Table.Cell className="font-medium">
								{project.reference}
							</Table.Cell>
							<Table.Cell>{project.client}</Table.Cell>
							<Table.Cell className="text-right">{project.amount}</Table.Cell>
						</Table.Row>
					);
				})}
			</Table.Body>
		</Table.Root>
	),
};
