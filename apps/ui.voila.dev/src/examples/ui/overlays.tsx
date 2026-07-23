import {
	CalendarIcon,
	GearIcon,
	UserIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@voila.dev/ui/components/alert-dialog";
import { Button } from "@voila.dev/ui/components/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@voila.dev/ui/components/command";
import { ConfirmDialog } from "@voila.dev/ui/components/confirm-dialog";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "@voila.dev/ui/components/context-menu";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@voila.dev/ui/components/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@voila.dev/ui/components/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@voila.dev/ui/components/dropdown-menu";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@voila.dev/ui/components/hover-card";
import { Input } from "@voila.dev/ui/components/input";
import { Label } from "@voila.dev/ui/components/label";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarRadioGroup,
	MenubarRadioItem,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@voila.dev/ui/components/menubar";
import {
	Popover,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@voila.dev/ui/components/popover";
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from "@voila.dev/ui/components/responsive-dialog";
import {
	ResponsiveSheet,
	ResponsiveSheetBody,
	ResponsiveSheetContent,
	ResponsiveSheetDescription,
	ResponsiveSheetFooter,
	ResponsiveSheetHeader,
	ResponsiveSheetTitle,
	ResponsiveSheetTrigger,
} from "@voila.dev/ui/components/responsive-sheet";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@voila.dev/ui/components/sheet";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@voila.dev/ui/components/tooltip";

export function DialogExample() {
	return (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Invite a provider
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite a provider</DialogTitle>
					<DialogDescription>
						Send an invitation to a healthcare provider so they can apply to
						your club's missions.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button>Send invitation</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function AlertDialogExample() {
	return (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Cancel mission
			</AlertDialogTrigger>
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogMedia>
						<WarningIcon className="text-destructive" />
					</AlertDialogMedia>
					<AlertDialogTitle>Cancel this mission?</AlertDialogTitle>
					<AlertDialogDescription>
						The provider will be notified and the booking released. This action
						cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep mission</AlertDialogCancel>
					<AlertDialogAction variant="destructive">
						Cancel mission
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export function ConfirmDialogExample() {
	return (
		<>
			<ConfirmDialog
				trigger={<Button variant="outline">Publish mission</Button>}
				title="Publish this mission?"
				description="Providers matching the required skills will be notified and can start applying."
				confirmLabel="Publish"
			/>
			<ConfirmDialog
				trigger={<Button variant="outline">Archive mission</Button>}
				title="Archive this mission?"
				description="The mission will be hidden from the active list. You can restore it at any time."
				confirmLabel="Archive"
				onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1500))}
			/>
		</>
	);
}

export function ResponsiveDialogExample() {
	return (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger render={<Button variant="outline" />}>
				Cancel mission
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Cancel this mission?</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogBody>
					<p>
						The held payment is returned to the club's wallet once the
						cancellation is confirmed.
					</p>
				</ResponsiveDialogBody>
				<ResponsiveDialogFooter>
					<ResponsiveDialogClose render={<Button variant="outline" />}>
						Keep mission
					</ResponsiveDialogClose>
					<Button variant="destructive">Cancel mission</Button>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	);
}

export function SheetExample() {
	return (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open mission details
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Mission details</SheetTitle>
					<SheetDescription>
						Pitch-side physiotherapy cover for the Saturday home match.
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-2 px-4 text-sm">
					<p>Club: Stade Rochelais</p>
					<p>Date: Saturday, June 14 — 2:00 PM</p>
					<p>Rate: 45 EUR / hour</p>
				</div>
				<SheetFooter>
					<Button>Confirm booking</Button>
					<SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

export function ResponsiveSheetExample() {
	return (
		<ResponsiveSheet>
			<ResponsiveSheetTrigger render={<Button variant="outline" />}>
				Open email details
			</ResponsiveSheetTrigger>
			<ResponsiveSheetContent size="xl">
				<ResponsiveSheetHeader>
					<ResponsiveSheetTitle>Email details</ResponsiveSheetTitle>
					<ResponsiveSheetDescription>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveSheetDescription>
				</ResponsiveSheetHeader>
				<ResponsiveSheetBody>
					<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
						<dt className="text-muted-foreground">To</dt>
						<dd>camille@example.com</dd>
						<dt className="text-muted-foreground">Status</dt>
						<dd>Sent</dd>
					</dl>
				</ResponsiveSheetBody>
				<ResponsiveSheetFooter>
					<Button>Resend</Button>
				</ResponsiveSheetFooter>
			</ResponsiveSheetContent>
		</ResponsiveSheet>
	);
}

export function DrawerExample() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">View mission details</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Match coverage — Saturday</DrawerTitle>
					<DrawerDescription>
						Stade Marcel Michelin, 14:00 to 18:00. One physiotherapist
						requested.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Apply to this mission</Button>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

export function PopoverExample() {
	return (
		<>
			<Popover>
				<PopoverTrigger
					render={<Button variant="outline">Mission details</Button>}
				/>
				<PopoverContent>
					<PopoverHeader>
						<PopoverTitle>Saturday match coverage</PopoverTitle>
						<PopoverDescription>
							Stade Rennais — June 14, from 14:00 to 18:00.
						</PopoverDescription>
					</PopoverHeader>
					<p className="text-muted-foreground">
						A physiotherapist is needed pitch-side for the senior rugby team.
					</p>
				</PopoverContent>
			</Popover>
			<Popover>
				<PopoverTrigger render={<Button variant="outline">Edit rate</Button>} />
				<PopoverContent className="w-64">
					<PopoverHeader>
						<PopoverTitle>Hourly rate</PopoverTitle>
					</PopoverHeader>
					<div className="grid gap-2">
						<Label htmlFor="hourly-rate">Rate (EUR)</Label>
						<Input id="hourly-rate" type="number" defaultValue="45" />
						<Button size="sm">Save</Button>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
}

export function HoverCardExample() {
	return (
		<HoverCard>
			<HoverCardTrigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCardTrigger>
			<HoverCardContent>
				<div className="flex flex-col gap-1">
					<p className="font-medium">Nathan Guyot</p>
					<p className="text-muted-foreground">
						Physiotherapist — covers match days and recovery sessions for rugby
						clubs around Clermont-Ferrand.
					</p>
					<p className="text-muted-foreground text-xs">Joined March 2026</p>
				</div>
			</HoverCardContent>
		</HoverCard>
	);
}

export function TooltipExample() {
	return (
		<>
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Tooltip key={side}>
					<TooltipTrigger render={<Button variant="outline" />}>
						{side}
					</TooltipTrigger>
					<TooltipContent side={side}>
						Tooltip on the {side} side
					</TooltipContent>
				</Tooltip>
			))}
		</>
	);
}

export function DropdownMenuExample() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="outline" />}>
				Mission actions
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Match coverage — Saturday</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Edit mission
						<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Duplicate
						<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>Assign provider</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>Nathan Guyot</DropdownMenuItem>
						<DropdownMenuItem>Marie Lefevre</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					Cancel mission
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export function ContextMenuExample() {
	return (
		<ContextMenu>
			<ContextMenuTrigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
				Right-click here
			</ContextMenuTrigger>
			<ContextMenuContent>
				<ContextMenuLabel>Mission</ContextMenuLabel>
				<ContextMenuItem>
					Edit mission
					<ContextMenuShortcut>⌘E</ContextMenuShortcut>
				</ContextMenuItem>
				<ContextMenuItem>Duplicate</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuSub>
					<ContextMenuSubTrigger>Assign provider</ContextMenuSubTrigger>
					<ContextMenuSubContent>
						<ContextMenuItem>Nathan Guyot</ContextMenuItem>
						<ContextMenuItem>Marie Lefevre</ContextMenuItem>
					</ContextMenuSubContent>
				</ContextMenuSub>
				<ContextMenuSeparator />
				<ContextMenuItem variant="destructive">Cancel mission</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}

export function MenubarExample() {
	return (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Missions</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>
						New mission <MenubarShortcut>⌘N</MenubarShortcut>
					</MenubarItem>
					<MenubarItem>Duplicate mission</MenubarItem>
					<MenubarSeparator />
					<MenubarSub>
						<MenubarSubTrigger>Export</MenubarSubTrigger>
						<MenubarSubContent>
							<MenubarItem>Export as CSV</MenubarItem>
							<MenubarItem>Export as PDF</MenubarItem>
						</MenubarSubContent>
					</MenubarSub>
					<MenubarSeparator />
					<MenubarItem variant="destructive">Cancel mission</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>View</MenubarTrigger>
				<MenubarContent>
					<MenubarCheckboxItem defaultChecked>
						Show archived missions
					</MenubarCheckboxItem>
					<MenubarSeparator />
					<MenubarRadioGroup defaultValue="week">
						<MenubarRadioItem value="day">Day</MenubarRadioItem>
						<MenubarRadioItem value="week">Week</MenubarRadioItem>
						<MenubarRadioItem value="month">Month</MenubarRadioItem>
					</MenubarRadioGroup>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	);
}

export function CommandExample() {
	return (
		<div className="w-full max-w-80 rounded-xl border">
			<Command>
				<CommandInput placeholder="Search missions, providers…" />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Missions">
						<CommandItem>
							<CalendarIcon />
							Match coverage — Saturday
						</CommandItem>
						<CommandItem>
							<CalendarIcon />
							Recovery session — Tuesday
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Providers">
						<CommandItem>
							<UserIcon />
							Nathan Guyot
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<GearIcon />
							Organization settings
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	);
}
