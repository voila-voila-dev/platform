import {
	CalendarCheckIcon,
	GearIcon,
	HouseIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Separator } from "@voila.dev/ui/components/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@voila.dev/ui/components/sidebar";

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
		<SidebarProvider>
			<Sidebar collapsible={collapsible}>
				<SidebarHeader>
					<div className="px-2 py-1.5 text-sm font-semibold group-data-[collapsible=icon]:hidden">
						Northwind Studio
					</div>
				</SidebarHeader>
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Platform</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{navigationItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											isActive={item.isActive}
											tooltip={item.title}
										>
											<item.icon />
											<span>{item.title}</span>
										</SidebarMenuButton>
										{item.badge ? (
											<SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
										) : null}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton tooltip="Settings">
								<GearIcon />
								<span>Settings</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger />
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
			</SidebarInset>
		</SidebarProvider>
	);
}

const meta = {
	title: "UI/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => <SidebarDemo />,
};

export const IconCollapsible: Story = {
	render: () => <SidebarDemo collapsible="icon" />,
};
