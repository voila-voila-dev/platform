import {
	CalendarIcon,
	GearIcon,
	UserIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@voila.dev/ui/components/command";
import { useCommandPalette } from "@voila.dev/ui/hooks/use-command-palette";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Command",
	component: Command,
	tags: ["autodocs"],
} satisfies Meta<typeof Command>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command>
				<CommandInput placeholder="Search missions, providers..." />
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
						<CommandItem>
							<UsersIcon />
							All providers
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
	),
};

/**
 * Types a query via the play function so the cmdk filtering (and the matching
 * `value`/`keywords` levers) are visually exercised: "physio" matches an item
 * only through its keywords.
 */
export const Filtering: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command>
				<CommandInput placeholder="Search providers..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Providers">
						<CommandItem value="nathan-guyot" keywords={["physio", "founder"]}>
							<UserIcon />
							Nathan Guyot
						</CommandItem>
						<CommandItem value="all-providers">
							<UsersIcon />
							All providers
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("Search providers...");

		await userEvent.type(input, "physio");
		await waitFor(() => {
			expect(canvas.getByText("Nathan Guyot")).toBeVisible();
			expect(canvas.queryByText("All providers")).toBeNull();
		});
	},
};

/**
 * Types a query matching nothing so the muted CommandEmpty state is visible.
 */
export const Empty: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command>
				<CommandInput placeholder="Search missions..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Missions">
						<CommandItem>
							<CalendarIcon />
							Match coverage — Saturday
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("Search missions...");

		await userEvent.type(input, "zzz");
		await waitFor(() => {
			expect(canvas.getByText("No results found.")).toBeVisible();
		});
	},
};

/**
 * The `data-checked` affordance is consumer-driven: cmdk never sets it, so a
 * selected-value item must add it manually to reveal the trailing CheckIcon.
 * Also covers the disabled item treatment.
 */
export const CheckedAndDisabled: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command>
				<CommandInput placeholder="Search specialties..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Specialties">
						<CommandItem data-checked="true">Physiotherapist</CommandItem>
						<CommandItem>Osteopath</CommandItem>
						<CommandItem disabled>Nurse (unavailable)</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
};

/**
 * Opens via the button or the global ⌘K / Ctrl+K hotkey provided by
 * `useCommandPalette`.
 */
export const Palette: Story = {
	render: () => {
		const { open, setOpen } = useCommandPalette();
		return (
			<>
				<Button variant="outline" onClick={() => setOpen(true)}>
					Open command palette
					<CommandShortcut>⌘K</CommandShortcut>
				</Button>
				<CommandDialog open={open} onOpenChange={setOpen}>
					<Command>
						<CommandInput placeholder="Type a command or search..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup heading="Quick actions">
								<CommandItem onSelect={() => setOpen(false)}>
									<CalendarIcon />
									Create a mission
								</CommandItem>
								<CommandItem onSelect={() => setOpen(false)}>
									<UserIcon />
									Invite a provider
								</CommandItem>
								<CommandItem onSelect={() => setOpen(false)}>
									<GearIcon />
									Open settings
								</CommandItem>
							</CommandGroup>
						</CommandList>
					</Command>
				</CommandDialog>
			</>
		);
	},
};
