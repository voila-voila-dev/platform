import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@voila.dev/ui/components/card";
import { Skeleton } from "@voila.dev/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@voila.dev/ui/components/table";

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
			<Card aria-hidden>
				<CardHeader>
					<Skeleton className="h-5 w-44" />
				</CardHeader>
				<CardContent className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</CardContent>
				<CardFooter className="gap-2">
					<Skeleton className="h-8 w-24" />
					<Skeleton className="h-8 w-24" />
				</CardFooter>
			</Card>
		</div>
	),
};

export const TableRows: Story = {
	render: () => (
		<Table className="w-96">
			<TableBody>
				{[0, 1, 2].map((row) => (
					<TableRow key={row}>
						<TableCell>
							<Skeleton className="h-4 w-32" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-20" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-12" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	),
};
