import {
	CalendarIcon,
	GearIcon,
	UserIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Command } from "@voila.dev/ui/command";
import { useCommandPalette } from "@voila.dev/ui/hooks";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Command",
	component: Command.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Command.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command.Root>
				<Command.Input placeholder="Search projects, freelancers..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Projects">
						<Command.Item>
							<CalendarIcon />
							Website redesign — kickoff
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
						<Command.Item>
							<UsersIcon />
							All freelancers
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
			<Command.Root>
				<Command.Input placeholder="Search freelancers..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Freelancers">
						<Command.Item value="nathan-guyot" keywords={["design", "founder"]}>
							<UserIcon />
							Nathan Guyot
						</Command.Item>
						<Command.Item value="all-freelancers">
							<UsersIcon />
							All freelancers
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
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
 * Types a query matching nothing so the muted Command.Empty state is visible.
 */
export const Empty: Story = {
	render: () => (
		<div className="w-80 rounded-xl border">
			<Command.Root>
				<Command.Input placeholder="Search projects..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Projects">
						<Command.Item>
							<CalendarIcon />
							Website redesign — kickoff
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
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
			<Command.Root>
				<Command.Input placeholder="Search specialties..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Specialties">
						<Command.Item data-checked="true">Designer</Command.Item>
						<Command.Item>Developer</Command.Item>
						<Command.Item disabled>Copywriter (unavailable)</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
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
					<Command.Shortcut>⌘K</Command.Shortcut>
				</Button>
				<Command.Dialog open={open} onOpenChange={setOpen}>
					<Command.Root>
						<Command.Input placeholder="Type a command or search..." />
						<Command.List>
							<Command.Empty>No results found.</Command.Empty>
							<Command.Group heading="Quick actions">
								<Command.Item onSelect={() => setOpen(false)}>
									<CalendarIcon />
									Create a project
								</Command.Item>
								<Command.Item onSelect={() => setOpen(false)}>
									<UserIcon />
									Invite a freelancer
								</Command.Item>
								<Command.Item onSelect={() => setOpen(false)}>
									<GearIcon />
									Open settings
								</Command.Item>
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Command.Dialog>
			</>
		);
	},
};
