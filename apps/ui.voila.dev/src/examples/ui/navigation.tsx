import {
	CalendarCheckIcon,
	CaretDownIcon,
	GearIcon,
	HouseIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import { Accordion } from "@voila.dev/ui/accordion";
import { Breadcrumb } from "@voila.dev/ui/breadcrumb";
import { Button } from "@voila.dev/ui/button";
import { Collapsible } from "@voila.dev/ui/collapsible";
import { NavigationMenu } from "@voila.dev/ui/navigation-menu";
import { Pagination } from "@voila.dev/ui/pagination";
import { Separator } from "@voila.dev/ui/separator";
import { Sidebar } from "@voila.dev/ui/sidebar";
import { StickyActionBar } from "@voila.dev/ui/sticky-action-bar";
import { Tabs } from "@voila.dev/ui/tabs";

export function BreadcrumbExample() {
	return (
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
					<Breadcrumb.Link href="#">Projects</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Landing page redesign</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	);
}

export function NavigationMenuExample() {
	return (
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Projects</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul className="grid w-64 gap-1">
							<li>
								<NavigationMenu.Link href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Open projects</span>
										<span className="text-muted-foreground text-xs">
											Projects waiting for a freelancer.
										</span>
									</div>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">My engagements</span>
										<span className="text-muted-foreground text-xs">
											Confirmed projects and schedules.
										</span>
									</div>
								</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Freelancers</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul className="grid w-56 gap-1">
							<li>
								<NavigationMenu.Link href="#">Directory</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="#">Invitations</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	);
}

export function TabsExample() {
	return (
		<Tabs.Root defaultValue="projects" className="w-full max-w-96">
			<Tabs.List>
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their staffing status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse independent freelancers available for hire.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	);
}

export function TabsLine() {
	return (
		<Tabs.Root defaultValue="projects" className="w-full max-w-96">
			<Tabs.List variant="line">
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their staffing status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse independent freelancers available for hire.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	);
}

export function PaginationExample() {
	return (
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
	);
}

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

export function SidebarExample() {
	return (
		<div className="h-96 w-full overflow-hidden rounded-lg border">
			<Sidebar.Provider>
				<Sidebar.Root collapsible="icon">
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

export function AccordionExample() {
	return (
		<Accordion.Root className="w-full max-w-96" defaultValue={["publishing"]}>
			<Accordion.Item value="publishing">
				<Accordion.Trigger>How do I publish a project?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						From your workspace dashboard, create a project with the scope,
						timeline and required role. Matching freelancers are notified as
						soon as it is published.
					</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="applications">
				<Accordion.Trigger>Who can apply to a project?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Any verified freelancer whose skills match the project requirements
						can apply.
					</p>
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="payment">
				<Accordion.Trigger>When is the freelancer paid?</Accordion.Trigger>
				<Accordion.Content>
					<p>
						Payment is held when you accept a proposal and released once the
						project report is submitted.
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	);
}

export function CollapsibleExample() {
	return (
		<Collapsible.Root className="flex w-full max-w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="font-medium text-sm">
					3 freelancers applied to this project
				</h4>
				<Collapsible.Trigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle proposals"
				>
					<CaretDownIcon className="transition-transform duration-200 group-aria-expanded/collapsible-trigger:rotate-180 motion-reduce:transition-none" />
				</Collapsible.Trigger>
			</div>
			<Collapsible.Content className="flex flex-col gap-2">
				{["Nathan Guyot", "Marie Lefevre", "Paul Martin"].map((name) => (
					<div key={name} className="rounded-md border px-3 py-2 text-sm">
						{name}
					</div>
				))}
			</Collapsible.Content>
		</Collapsible.Root>
	);
}

export function StickyActionBarExample() {
	return (
		<div className="relative h-80 w-full max-w-md overflow-y-auto rounded-lg border">
			<div className="flex flex-col gap-3 p-4 pb-2">
				{Array.from({ length: 12 }, (_, index) => (
					<p key={String(index)} className="text-muted-foreground text-sm">
						Project detail {index + 1} — landing page redesign for the launch,
						first drafts due 48 hours after the kickoff call.
					</p>
				))}
			</div>
			<StickyActionBar hideOnDesktop={false}>
				<Button variant="outline">Contact</Button>
				<Button>Apply</Button>
			</StickyActionBar>
		</div>
	);
}
