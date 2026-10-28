import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Card } from "@voila.dev/ui/card";
import { Skeleton } from "@voila.dev/ui/skeleton";
import { Table } from "@voila.dev/ui/table";

const meta = {
	title: "UI/Skeleton",
	component: Skeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Skeleton className="size-10 rounded-full" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-40" />
				<Skeleton className="h-4 w-28" />
			</div>
		</div>
	),
};

/**
 * Composed with the kit's actual Card. The wrapping `role="status"` +
 * sr-only text is the accessible-loading pattern the Skeleton itself does
 * not provide.
 */
export const ProjectCard: Story = {
	render: () => (
		<div role="status" className="w-72">
			<span className="sr-only">Loading project...</span>
			<Card.Root aria-hidden>
				<Card.Header>
					<Skeleton className="h-5 w-44" />
				</Card.Header>
				<Card.Content className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</Card.Content>
				<Card.Footer className="gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</Card.Footer>
			</Card.Root>
		</div>
	),
};

export const TableRows: Story = {
	render: () => (
		<Table.Root className="w-96">
			<Table.Body>
				{[0, 1, 2].map((row) => (
					<Table.Row key={row}>
						<Table.Cell>
							<Skeleton className="h-4 w-32" />
						</Table.Cell>
						<Table.Cell>
							<Skeleton className="h-4 w-20" />
						</Table.Cell>
						<Table.Cell>
							<Skeleton className="h-4 w-12" />
						</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
		</Table.Root>
	),
};
