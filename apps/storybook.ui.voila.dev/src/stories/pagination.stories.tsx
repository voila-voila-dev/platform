import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Pagination } from "@voila.dev/ui/pagination";

const meta = {
	title: "UI/Pagination",
	component: Pagination.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Pagination.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Pagination.Root>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous href="#" />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#">1</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#" isActive>
						2
					</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#">3</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Ellipsis />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#">12</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Next href="#" />
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	),
};

export const PreviousNextOnly: Story = {
	render: () => (
		<Pagination.Root>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous href="#" />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Next href="#" />
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	),
};

// First page: Previous is disabled (dimmed, not focusable, no navigation).
export const FirstPage: Story = {
	render: () => (
		<Pagination.Root>
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.Previous href="#" isDisabled />
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#" isActive>
						1
					</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#">2</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Link href="#">3</Pagination.Link>
				</Pagination.Item>
				<Pagination.Item>
					<Pagination.Next href="#" />
				</Pagination.Item>
			</Pagination.Content>
		</Pagination.Root>
	),
};

// The picked `size` prop drives the page-link height (default is `icon`).
export const Sizes: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<Pagination.Root>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Link href="#" size="icon-sm">
							1
						</Pagination.Link>
					</Pagination.Item>
					<Pagination.Item>
						<Pagination.Link href="#" size="icon-sm" isActive>
							2
						</Pagination.Link>
					</Pagination.Item>
					<Pagination.Item>
						<Pagination.Link href="#" size="icon-sm">
							3
						</Pagination.Link>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
			<Pagination.Root>
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Link href="#" size="icon-lg">
							1
						</Pagination.Link>
					</Pagination.Item>
					<Pagination.Item>
						<Pagination.Link href="#" size="icon-lg" isActive>
							2
						</Pagination.Link>
					</Pagination.Item>
					<Pagination.Item>
						<Pagination.Link href="#" size="icon-lg">
							3
						</Pagination.Link>
					</Pagination.Item>
				</Pagination.Content>
			</Pagination.Root>
		</div>
	),
};
