import {
	CalendarCheckIcon,
	GearIcon,
	HouseIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Separator } from "@voila.dev/ui/separator";
import { Sidebar } from "@voila.dev/ui/sidebar";

const navigationItems = [
	{ title: "Dashboard", icon: HouseIcon, isActive: true },
	{ title: "Projects", icon: CalendarCheckIcon, badge: "12" },
	{ title: "Freelancers", icon: UsersIcon },
	{ title: "Billing", icon: ReceiptIcon },
];

function SidebarDemo({
	collapsible = "offcanvas",
}: {
	collapsible?: "offcanvas" | "icon" | "none";
}) {
	return (
		<Sidebar.Provider>
			<Sidebar.Root collapsible={collapsible}>
				<Sidebar.Header>
					<div className="px-2 py-1.5 text-sm font-semibold group-data-[collapsible=icon]:hidden">
						Northwind Studio
					</div>
				</Sidebar.Header>
				<Sidebar.Content>
					<Sidebar.Group>
						<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{navigationItems.map((item) => (
									<Sidebar.MenuItem key={item.title}>
										<Sidebar.MenuButton
											isActive={item.isActive}
											tooltip={item.title}
										>
											<item.icon />
											<span>{item.title}</span>
										</Sidebar.MenuButton>
										{item.badge ? (
											<Sidebar.MenuBadge>{item.badge}</Sidebar.MenuBadge>
										) : null}
									</Sidebar.MenuItem>
								))}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Sidebar.Group>
				</Sidebar.Content>
				<Sidebar.Footer>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton tooltip="Settings">
								<GearIcon />
								<span>Settings</span>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.Footer>
			</Sidebar.Root>
			<Sidebar.Inset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<Sidebar.Trigger />
					{/* Vertical separators self-stretch by default; a fixed height needs
					    `my-auto` to re-center within the taller header row. */}
					<Separator orientation="vertical" className="my-auto h-4" />
					<span className="text-sm font-medium">Dashboard</span>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4">
					<div className="grid gap-4 md:grid-cols-3">
						<div className="h-24 rounded-lg bg-muted/50" />
						<div className="h-24 rounded-lg bg-muted/50" />
						<div className="h-24 rounded-lg bg-muted/50" />
					</div>
					<div className="min-h-64 flex-1 rounded-lg bg-muted/50" />
				</div>
			</Sidebar.Inset>
		</Sidebar.Provider>
	);
}

const meta = {
	title: "UI/Sidebar",
	component: Sidebar.Root,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <SidebarDemo />,
};

export const IconCollapsible: Story = {
	render: () => <SidebarDemo collapsible="icon" />,
};
