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
				<CommandInput placeholder="Search projects, freelancers..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Projects">
						<CommandItem>
							<CalendarIcon />
							Website redesign — kickoff
						</CommandItem>
						<CommandItem>
							<CalendarIcon />
							Design review — Tuesday
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Freelancers">
						<CommandItem>
							<UserIcon />
							Nathan Guyot
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<UsersIcon />
							All freelancers
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading="Settings">
						<CommandItem>
							<GearIcon />
							Workspace settings
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
 * `value`/`keywords` levers) are visually exercised: "design" matches an item
 * only through its keywords.
 */
export const Filtering: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command>
				<CommandInput placeholder="Search freelancers..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Freelancers">
						<CommandItem value="nathan-guyot" keywords={["design", "founder"]}>
							<UserIcon />
							Nathan Guyot
						</CommandItem>
						<CommandItem value="all-freelancers">
							<UsersIcon />
							All freelancers
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("Search freelancers...");

		await userEvent.type(input, "design");
		await waitFor(() => {
			expect(canvas.getByText("Nathan Guyot")).toBeVisible();
			expect(canvas.queryByText("All freelancers")).toBeNull();
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
				<CommandInput placeholder="Search projects..." />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading="Projects">
						<CommandItem>
							<CalendarIcon />
							Website redesign — kickoff
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</Command>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText("Search projects...");

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
						<CommandItem data-checked="true">Designer</CommandItem>
						<CommandItem>Developer</CommandItem>
						<CommandItem disabled>Copywriter (unavailable)</CommandItem>
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
									Create a project
								</CommandItem>
								<CommandItem onSelect={() => setOpen(false)}>
									<UserIcon />
									Invite a freelancer
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
