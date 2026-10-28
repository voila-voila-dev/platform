import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Breadcrumb } from "@voila.dev/ui/breadcrumb";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";

const meta = {
	title: "UI/Breadcrumb",
	component: Breadcrumb.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumb.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Website redesign</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};

export const WithEllipsis: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Ellipsis />
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Bookings</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Booking details</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};

export const WithDropdownEllipsis: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Dashboard</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<DropdownMenu.Root>
						<Breadcrumb.Ellipsis
							className="cursor-pointer transition-colors hover:text-foreground"
							render={<DropdownMenu.Trigger />}
						/>
						<DropdownMenu.Content align="start">
							<DropdownMenu.Item>Workspaces</DropdownMenu.Item>
							<DropdownMenu.Item>Projects</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="#">Bookings</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Booking details</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};

// Stand-in for a router link (e.g. TanStack Router's <Link to=... />): the
// `render` prop forwards breadcrumb styling and data-slot to the custom element.
function RouterLink({
	to,
	children,
	...props
}: React.ComponentProps<"a"> & { to: string }) {
	return (
		<a href={to} {...props}>
			{children}
		</a>
	);
}

export const WithRouterLink: Story = {
	render: () => (
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link render={<RouterLink to="/dashboard" />}>
						Dashboard
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link render={<RouterLink to="/projects" />}>
						Projects
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Website redesign</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	),
};

export const LongLabels: Story = {
	render: () => (
		<div className="max-w-72 rounded-lg border border-dashed border-border p-4">
			<Breadcrumb.Root>
				<Breadcrumb.List>
					<Breadcrumb.Item>
						<Breadcrumb.Link href="#">Dashboard</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Link href="#">
							Northwind Industries global marketing team
						</Breadcrumb.Link>
					</Breadcrumb.Item>
					<Breadcrumb.Separator />
					<Breadcrumb.Item>
						<Breadcrumb.Page>
							Complete brand identity refresh for the international product
							launch campaign
						</Breadcrumb.Page>
					</Breadcrumb.Item>
				</Breadcrumb.List>
			</Breadcrumb.Root>
		</div>
	),
};
