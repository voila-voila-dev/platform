import {
	CalendarIcon,
	GearIcon,
	UserIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import { AlertDialog } from "@voila.dev/ui/alert-dialog";
import { Button } from "@voila.dev/ui/button";
import { Command } from "@voila.dev/ui/command";
import { ConfirmDialog } from "@voila.dev/ui/confirm-dialog";
import { ContextMenu } from "@voila.dev/ui/context-menu";
import { Dialog } from "@voila.dev/ui/dialog";
import { Drawer } from "@voila.dev/ui/drawer";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";
import { HoverCard } from "@voila.dev/ui/hover-card";
import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";
import { Menubar } from "@voila.dev/ui/menubar";
import { Popover } from "@voila.dev/ui/popover";
import { ResponsiveDialog } from "@voila.dev/ui/responsive-dialog";
import { ResponsiveSheet } from "@voila.dev/ui/responsive-sheet";
import { Sheet } from "@voila.dev/ui/sheet";
import { Tooltip } from "@voila.dev/ui/tooltip";

export function DialogExample() {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Invite a freelancer
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Invite a freelancer</Dialog.Title>
					<Dialog.Description>
						Send an invitation to an independent freelancer so they can apply to
						your workspace's projects.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer>
					<Dialog.Close render={<Button variant="outline" />}>
						Cancel
					</Dialog.Close>
					<Button>Send invitation</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	);
}

export function AlertDialogExample() {
	return (
		<AlertDialog.Root>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</AlertDialog.Trigger>
			<AlertDialog.Content size="sm">
				<AlertDialog.Header>
					<AlertDialog.Media>
						<WarningIcon className="text-destructive" />
					</AlertDialog.Media>
					<AlertDialog.Title>Cancel this project?</AlertDialog.Title>
					<AlertDialog.Description>
						The freelancer will be notified and the engagement released. This
						action cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">
						Cancel project
					</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
}

export function ConfirmDialogExample() {
	return (
		<>
			<ConfirmDialog
				trigger={<Button variant="outline">Publish project</Button>}
				title="Publish this project?"
				description="Freelancers matching the required skills will be notified and can start applying."
				confirmLabel="Publish"
			/>
			<ConfirmDialog
				trigger={<Button variant="outline">Archive project</Button>}
				title="Archive this project?"
				description="The project will be hidden from the active list. You can restore it at any time."
				confirmLabel="Archive"
				onConfirm={() => new Promise((resolve) => setTimeout(resolve, 1500))}
			/>
		</>
	);
}

export function ResponsiveDialogExample() {
	return (
		<ResponsiveDialog.Root>
			<ResponsiveDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</ResponsiveDialog.Trigger>
			<ResponsiveDialog.Content>
				<ResponsiveDialog.Header>
					<ResponsiveDialog.Title>Cancel this project?</ResponsiveDialog.Title>
					<ResponsiveDialog.Description>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveDialog.Description>
				</ResponsiveDialog.Header>
				<ResponsiveDialog.Body>
					<p>
						The held payment is returned to the client's wallet once the
						cancellation is confirmed.
					</p>
				</ResponsiveDialog.Body>
				<ResponsiveDialog.Footer>
					<ResponsiveDialog.Close render={<Button variant="outline" />}>
						Keep project
					</ResponsiveDialog.Close>
					<Button variant="destructive">Cancel project</Button>
				</ResponsiveDialog.Footer>
			</ResponsiveDialog.Content>
		</ResponsiveDialog.Root>
	);
}

export function SheetExample() {
	return (
		<Sheet.Root>
			<Sheet.Trigger render={<Button variant="outline" />}>
				Open project details
			</Sheet.Trigger>
			<Sheet.Content>
				<Sheet.Header>
					<Sheet.Title>Project details</Sheet.Title>
					<Sheet.Description>
						On-site design support for the marketing site launch week.
					</Sheet.Description>
				</Sheet.Header>
				<div className="grid gap-2 px-4 text-sm">
					<p>Client: Northwind Trading</p>
					<p>Date: Saturday, June 14 — 2:00 PM</p>
					<p>Rate: 45 USD / hour</p>
				</div>
				<Sheet.Footer>
					<Button>Confirm engagement</Button>
					<Sheet.Close render={<Button variant="outline" />}>
						Cancel
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	);
}

export function ResponsiveSheetExample() {
	return (
		<ResponsiveSheet.Root>
			<ResponsiveSheet.Trigger render={<Button variant="outline" />}>
				Open email details
			</ResponsiveSheet.Trigger>
			<ResponsiveSheet.Content size="xl">
				<ResponsiveSheet.Header>
					<ResponsiveSheet.Title>Email details</ResponsiveSheet.Title>
					<ResponsiveSheet.Description>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveSheet.Description>
				</ResponsiveSheet.Header>
				<ResponsiveSheet.Body>
					<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
						<dt className="text-muted-foreground">To</dt>
						<dd>camille@example.com</dd>
						<dt className="text-muted-foreground">Status</dt>
						<dd>Sent</dd>
					</dl>
				</ResponsiveSheet.Body>
				<ResponsiveSheet.Footer>
					<Button>Resend</Button>
				</ResponsiveSheet.Footer>
			</ResponsiveSheet.Content>
		</ResponsiveSheet.Root>
	);
}

export function DrawerExample() {
	return (
		<Drawer.Root>
			<Drawer.Trigger asChild>
				<Button variant="outline">View project details</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Launch support — Saturday</Drawer.Title>
					<Drawer.Description>
						Remote, 14:00 to 18:00. One product designer requested.
					</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer>
					<Button>Apply to this project</Button>
					<Drawer.Close asChild>
						<Button variant="outline">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	);
}

export function PopoverExample() {
	return (
		<>
			<Popover.Root>
				<Popover.Trigger
					render={<Button variant="outline">Project details</Button>}
				/>
				<Popover.Content>
					<Popover.Header>
						<Popover.Title>Saturday launch support</Popover.Title>
						<Popover.Description>
							Northwind Trading — June 14, from 14:00 to 18:00.
						</Popover.Description>
					</Popover.Header>
					<p className="text-muted-foreground">
						A product designer is needed on call for the launch-day fixes.
					</p>
				</Popover.Content>
			</Popover.Root>
			<Popover.Root>
				<Popover.Trigger
					render={<Button variant="outline">Edit rate</Button>}
				/>
				<Popover.Content className="w-64">
					<Popover.Header>
						<Popover.Title>Hourly rate</Popover.Title>
					</Popover.Header>
					<div className="grid gap-2">
						<Label htmlFor="hourly-rate">Rate (USD)</Label>
						<Input id="hourly-rate" type="number" defaultValue="45" />
						<Button size="sm">Save</Button>
					</div>
				</Popover.Content>
			</Popover.Root>
		</>
	);
}

export function HoverCardExample() {
	return (
		<HoverCard.Root>
			<HoverCard.Trigger render={<Button variant="link" />}>
				@nathan.guyot
			</HoverCard.Trigger>
			<HoverCard.Content>
				<div className="flex flex-col gap-1">
					<p className="font-medium">Nathan Guyot</p>
					<p className="text-muted-foreground">
						Product designer — covers launch weeks and design sprints for SaaS
						teams across Europe.
					</p>
					<p className="text-muted-foreground text-xs">Joined March 2026</p>
				</div>
			</HoverCard.Content>
		</HoverCard.Root>
	);
}

export function TooltipExample() {
	return (
		<>
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Tooltip.Root key={side}>
					<Tooltip.Trigger render={<Button variant="outline" />}>
						{side}
					</Tooltip.Trigger>
					<Tooltip.Content side={side}>
						Tooltip on the {side} side
					</Tooltip.Content>
				</Tooltip.Root>
			))}
		</>
	);
}

export function DropdownMenuExample() {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger render={<Button variant="outline" />}>
				Project actions
			</DropdownMenu.Trigger>
			<DropdownMenu.Content className="w-56">
				<DropdownMenu.Label>Launch support — Saturday</DropdownMenu.Label>
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						Edit project
						<DropdownMenu.Shortcut>⌘E</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						Duplicate
						<DropdownMenu.Shortcut>⌘D</DropdownMenu.Shortcut>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>Assign freelancer</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item>Nathan Guyot</DropdownMenu.Item>
						<DropdownMenu.Item>Marie Lefevre</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item variant="destructive">
					Cancel project
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}

export function ContextMenuExample() {
	return (
		<ContextMenu.Root>
			<ContextMenu.Trigger className="flex h-36 w-72 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm">
				Right-click here
			</ContextMenu.Trigger>
			<ContextMenu.Content>
				<ContextMenu.Label>Project</ContextMenu.Label>
				<ContextMenu.Item>
					Edit project
					<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut>
				</ContextMenu.Item>
				<ContextMenu.Item>Duplicate</ContextMenu.Item>
				<ContextMenu.Separator />
				<ContextMenu.Sub>
					<ContextMenu.SubTrigger>Assign freelancer</ContextMenu.SubTrigger>
					<ContextMenu.SubContent>
						<ContextMenu.Item>Nathan Guyot</ContextMenu.Item>
						<ContextMenu.Item>Marie Lefevre</ContextMenu.Item>
					</ContextMenu.SubContent>
				</ContextMenu.Sub>
				<ContextMenu.Separator />
				<ContextMenu.Item variant="destructive">
					Cancel project
				</ContextMenu.Item>
			</ContextMenu.Content>
		</ContextMenu.Root>
	);
}

export function MenubarExample() {
	return (
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Projects</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>
						New project <Menubar.Shortcut>⌘N</Menubar.Shortcut>
					</Menubar.Item>
					<Menubar.Item>Duplicate project</Menubar.Item>
					<Menubar.Separator />
					<Menubar.Sub>
						<Menubar.SubTrigger>Export</Menubar.SubTrigger>
						<Menubar.SubContent>
							<Menubar.Item>Export as CSV</Menubar.Item>
							<Menubar.Item>Export as PDF</Menubar.Item>
						</Menubar.SubContent>
					</Menubar.Sub>
					<Menubar.Separator />
					<Menubar.Item variant="destructive">Cancel project</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
			<Menubar.Menu>
				<Menubar.Trigger>View</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.CheckboxItem defaultChecked>
						Show archived projects
					</Menubar.CheckboxItem>
					<Menubar.Separator />
					<Menubar.RadioGroup defaultValue="week">
						<Menubar.RadioItem value="day">Day</Menubar.RadioItem>
						<Menubar.RadioItem value="week">Week</Menubar.RadioItem>
						<Menubar.RadioItem value="month">Month</Menubar.RadioItem>
					</Menubar.RadioGroup>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
	);
}

export function CommandExample() {
	return (
		<div className="w-full max-w-80 rounded-xl border">
			<Command.Root>
				<Command.Input placeholder="Search projects, freelancers…" />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Projects">
						<Command.Item>
							<CalendarIcon />
							Launch support — Saturday
						</Command.Item>
						<Command.Item>
							<CalendarIcon />
							Design review — Tuesday
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Freelancers">
						<Command.Item>
							<UserIcon />
							Nathan Guyot
							<Command.Shortcut>⌘P</Command.Shortcut>
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Settings">
						<Command.Item>
							<GearIcon />
							Workspace settings
							<Command.Shortcut>⌘S</Command.Shortcut>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</div>
	);
}
