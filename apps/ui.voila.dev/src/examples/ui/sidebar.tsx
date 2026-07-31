import {
	CalendarCheckIcon,
	GearIcon,
	HouseIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import { Separator } from "@voila.dev/ui/separator";
import { Sidebar } from "@voila.dev/ui/sidebar";

const sidebarItems = [
	{ title: "Dashboard", icon: HouseIcon, isActive: true, badge: undefined },
	{
		title: "Projects",
		icon: CalendarCheckIcon,
		isActive: false,
		badge: "12",
	},
	{ title: "Freelancers", icon: UsersIcon, isActive: false, badge: undefined },
	{ title: "Billing", icon: ReceiptIcon, isActive: false, badge: undefined },
];

/*
 * `Sidebar.Root` pins itself with `position: fixed`, which in a real app means
 * the viewport. `transform-gpu` gives this frame its own containing block, so
 * the demo stays inside the preview instead of covering the page.
 */
export function Default() {
	return (
		<div className="h-96 w-full transform-gpu overflow-hidden rounded-lg border">
			<Sidebar.Provider className="h-full min-h-full">
				<Sidebar.Root collapsible="icon" className="h-full">
					<Sidebar.Header>
						<div className="px-2 py-1.5 font-semibold text-sm group-data-[collapsible=icon]:hidden">
							Northwind Trading
						</div>
					</Sidebar.Header>
					<Sidebar.Content>
						<Sidebar.Group>
							<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
							<Sidebar.GroupContent>
								<Sidebar.Menu>
									{sidebarItems.map((item) => (
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
						<Separator orientation="vertical" className="my-auto h-4" />
						<span className="font-medium text-sm">Dashboard</span>
					</header>
					<div className="flex flex-1 flex-col gap-4 p-4">
						<div className="grid gap-4 md:grid-cols-3">
							<div className="h-16 rounded-lg bg-muted/50" />
							<div className="h-16 rounded-lg bg-muted/50" />
							<div className="h-16 rounded-lg bg-muted/50" />
						</div>
					</div>
				</Sidebar.Inset>
			</Sidebar.Provider>
		</div>
	);
}
