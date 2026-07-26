import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Menubar } from "@voila.dev/ui/menubar";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Menubar",
	component: Menubar.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Menubar.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
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
				<Menubar.Trigger>Freelancers</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Item>Invite a freelancer</Menubar.Item>
					<Menubar.Item>Browse directory</Menubar.Item>
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
	),
};

/**
 * Exercises the `Menubar.Label` + `Menubar.Group` path (the `GroupLabel`-outside-
 * `Group` crash pattern from the dropdown/context-menu family), plus inset and
 * disabled items — all absent from the default story.
 */
export const WithLabelsGroupsAndStates: Story = {
	render: () => (
		<Menubar.Root>
			<Menubar.Menu>
				<Menubar.Trigger>Account</Menubar.Trigger>
				<Menubar.Content>
					<Menubar.Label>Signed in as Nathan</Menubar.Label>
					<Menubar.Separator />
					<Menubar.Group>
						<Menubar.Label inset>Workspace</Menubar.Label>
						<Menubar.Item inset>Switch workspace</Menubar.Item>
						<Menubar.Item inset>Billing settings</Menubar.Item>
					</Menubar.Group>
					<Menubar.Separator />
					<Menubar.Item disabled>Invite teammates (soon)</Menubar.Item>
					<Menubar.Item variant="destructive">Sign out</Menubar.Item>
				</Menubar.Content>
			</Menubar.Menu>
		</Menubar.Root>
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
		const trigger = canvas.getByRole("menuitem", { name: "Projects" });

		await userEvent.click(trigger);
		await waitFor(() =>
			expect(trigger).toHaveAttribute("aria-expanded", "true"),
		);

		// Menu content renders in a portal, so query the document body.
		const body = within(canvasElement.ownerDocument.body);
		await waitFor(() =>
			expect(body.getByRole("menuitem", { name: /New project/ })).toBeVisible(),
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
