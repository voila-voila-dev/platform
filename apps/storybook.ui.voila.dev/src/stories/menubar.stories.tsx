import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Menubar,
	MenubarCheckboxItem,
	MenubarContent,
	MenubarGroup,
	MenubarItem,
	MenubarLabel,
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
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Menubar",
	component: Menubar,
	tags: ["autodocs"],
} satisfies Meta<typeof Menubar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
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
				<MenubarTrigger>Providers</MenubarTrigger>
				<MenubarContent>
					<MenubarItem>Invite a provider</MenubarItem>
					<MenubarItem>Browse directory</MenubarItem>
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
	),
};

/**
 * Exercises the `MenubarLabel` + `MenubarGroup` path (the `GroupLabel`-outside-
 * `Group` crash pattern from the dropdown/context-menu family), plus inset and
 * disabled items — all absent from the default story.
 */
export const WithLabelsGroupsAndStates: Story = {
	render: () => (
		<Menubar>
			<MenubarMenu>
				<MenubarTrigger>Account</MenubarTrigger>
				<MenubarContent>
					<MenubarLabel>Signed in as Nathan</MenubarLabel>
					<MenubarSeparator />
					<MenubarGroup>
						<MenubarLabel inset>Workspace</MenubarLabel>
						<MenubarItem inset>Switch organization</MenubarItem>
						<MenubarItem inset>Billing settings</MenubarItem>
					</MenubarGroup>
					<MenubarSeparator />
					<MenubarItem disabled>Invite teammates (soon)</MenubarItem>
					<MenubarItem variant="destructive">Sign out</MenubarItem>
				</MenubarContent>
			</MenubarMenu>
		</Menubar>
	),
};

/**
 * Opens the first menu and its submenu via the play function so the static
 * Storybook canvas captures an open state — guards against the kit-wide
 * "broken-on-open ships silently" risk noted in the review.
 */
export const OpenInteraction: Story = {
	...Default,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const trigger = canvas.getByRole("menuitem", { name: "Missions" });

		await userEvent.click(trigger);
		await waitFor(() =>
			expect(trigger).toHaveAttribute("aria-expanded", "true"),
		);

		// Menu content renders in a portal, so query the document body.
		const body = within(canvasElement.ownerDocument.body);
		await waitFor(() =>
			expect(body.getByRole("menuitem", { name: /New mission/ })).toBeVisible(),
		);

		const exportTrigger = body.getByRole("menuitem", { name: "Export" });
		await userEvent.hover(exportTrigger);
		await waitFor(() =>
			expect(
				body.getByRole("menuitem", { name: "Export as CSV" }),
			).toBeVisible(),
		);
	},
};
