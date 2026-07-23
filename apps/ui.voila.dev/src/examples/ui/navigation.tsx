import {
	CalendarCheckIcon,
	CaretDownIcon,
	GearIcon,
	HouseIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@voila.dev/ui/components/accordion";
import {
	Breadcrumb,
	BreadcrumbEllipsis,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@voila.dev/ui/components/breadcrumb";
import { Button } from "@voila.dev/ui/components/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@voila.dev/ui/components/collapsible";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@voila.dev/ui/components/navigation-menu";
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@voila.dev/ui/components/pagination";
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
import { StickyActionBar } from "@voila.dev/ui/components/sticky-action-bar";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@voila.dev/ui/components/tabs";

export function BreadcrumbExample() {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbEllipsis />
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink href="#">Missions</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbPage>Match day coverage</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}

export function NavigationMenuExample() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Missions</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-64 gap-1">
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Open missions</span>
										<span className="text-muted-foreground text-xs">
											Missions waiting for a provider.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">My bookings</span>
										<span className="text-muted-foreground text-xs">
											Confirmed missions and schedules.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Providers</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-56 gap-1">
							<li>
								<NavigationMenuLink href="#">Directory</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">Invitations</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

export function TabsExample() {
	return (
		<Tabs defaultValue="missions" className="w-full max-w-96">
			<TabsList>
				<TabsTrigger value="missions">Missions</TabsTrigger>
				<TabsTrigger value="providers">Providers</TabsTrigger>
				<TabsTrigger value="billing">Billing</TabsTrigger>
			</TabsList>
			<TabsContent value="missions">
				Review upcoming missions and their staffing status.
			</TabsContent>
			<TabsContent value="providers">
				Browse healthcare providers available in your area.
			</TabsContent>
			<TabsContent value="billing">
				Track invoices and payouts for completed missions.
			</TabsContent>
		</Tabs>
	);
}

export function TabsLine() {
	return (
		<Tabs defaultValue="missions" className="w-full max-w-96">
			<TabsList variant="line">
				<TabsTrigger value="missions">Missions</TabsTrigger>
				<TabsTrigger value="providers">Providers</TabsTrigger>
				<TabsTrigger value="billing">Billing</TabsTrigger>
			</TabsList>
			<TabsContent value="missions">
				Review upcoming missions and their staffing status.
			</TabsContent>
			<TabsContent value="providers">
				Browse healthcare providers available in your area.
			</TabsContent>
			<TabsContent value="billing">
				Track invoices and payouts for completed missions.
			</TabsContent>
		</Tabs>
	);
}

export function PaginationExample() {
	return (
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
	);
}

const sidebarItems = [
	{ title: "Dashboard", icon: HouseIcon, isActive: true, badge: undefined },
	{
		title: "Missions",
		icon: CalendarCheckIcon,
		isActive: false,
		badge: "12",
	},
	{ title: "Providers", icon: UsersIcon, isActive: false, badge: undefined },
	{ title: "Billing", icon: ReceiptIcon, isActive: false, badge: undefined },
];

export function SidebarExample() {
	return (
		<div className="h-96 w-full overflow-hidden rounded-lg border">
			<SidebarProvider>
				<Sidebar collapsible="icon">
					<SidebarHeader>
						<div className="px-2 py-1.5 font-semibold text-sm group-data-[collapsible=icon]:hidden">
							Stade Rochelais
						</div>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Platform</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{sidebarItems.map((item) => (
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
				</SidebarInset>
			</SidebarProvider>
		</div>
	);
}

export function AccordionExample() {
	return (
		<Accordion className="w-full max-w-96" defaultValue={["publishing"]}>
			<AccordionItem value="publishing">
				<AccordionTrigger>How do I publish a mission?</AccordionTrigger>
				<AccordionContent>
					<p>
						From your club dashboard, create a mission with the date, location
						and required specialty. Providers in your area are notified as soon
						as it is published.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="applications">
				<AccordionTrigger>Who can apply to a mission?</AccordionTrigger>
				<AccordionContent>
					<p>
						Any verified health professional whose specialty matches the mission
						requirements can apply.
					</p>
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="payment">
				<AccordionTrigger>When is the provider paid?</AccordionTrigger>
				<AccordionContent>
					<p>
						Payment is held when you accept an application and released once the
						mission report is submitted.
					</p>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

export function CollapsibleExample() {
	return (
		<Collapsible className="flex w-full max-w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="font-medium text-sm">
					3 providers applied to this mission
				</h4>
				<CollapsibleTrigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle applications"
				>
					<CaretDownIcon className="transition-transform duration-200 group-aria-expanded/collapsible-trigger:rotate-180 motion-reduce:transition-none" />
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="flex flex-col gap-2">
				{["Nathan Guyot", "Marie Lefevre", "Paul Martin"].map((name) => (
					<div key={name} className="rounded-md border px-3 py-2 text-sm">
						{name}
					</div>
				))}
			</CollapsibleContent>
		</Collapsible>
	);
}

export function StickyActionBarExample() {
	return (
		<div className="relative h-80 w-full max-w-md overflow-y-auto rounded-lg border">
			<div className="flex flex-col gap-3 p-4 pb-2">
				{Array.from({ length: 12 }, (_, index) => (
					<p key={String(index)} className="text-muted-foreground text-sm">
						Détail de la mission {index + 1} — couverture kiné du match de
						samedi, arrivée 30 minutes avant le coup d'envoi.
					</p>
				))}
			</div>
			<StickyActionBar hideOnDesktop={false}>
				<Button variant="outline">Contacter</Button>
				<Button>Postuler</Button>
			</StickyActionBar>
		</div>
	);
}
