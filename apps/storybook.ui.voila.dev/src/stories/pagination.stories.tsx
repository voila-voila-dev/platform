import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@voila.dev/ui/components/pagination";

const meta = {
	title: "UI/Pagination",
	component: Pagination,
	tags: ["autodocs"],
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">1</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						2
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">3</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationEllipsis />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">12</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

export const PreviousNextOnly: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" />
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

// First page: Previous is disabled (dimmed, not focusable, no navigation).
export const FirstPage: Story = {
	render: () => (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious href="#" isDisabled />
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#" isActive>
						1
					</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">2</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationLink href="#">3</PaginationLink>
				</PaginationItem>
				<PaginationItem>
					<PaginationNext href="#" />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	),
};

// The picked `size` prop drives the page-link height (default is `icon`).
export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#" size="icon-sm">
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="icon-sm" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="icon-sm">
							3
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
			<Pagination>
				<PaginationContent>
					<PaginationItem>
						<PaginationLink href="#" size="icon-lg">
							1
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="icon-lg" isActive>
							2
						</PaginationLink>
					</PaginationItem>
					<PaginationItem>
						<PaginationLink href="#" size="icon-lg">
							3
						</PaginationLink>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		</div>
	),
};
