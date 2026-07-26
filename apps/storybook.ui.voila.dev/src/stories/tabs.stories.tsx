import {
	ClipboardTextIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Tabs } from "@voila.dev/ui/tabs";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Tabs",
	component: Tabs.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs.Root defaultValue="projects" className="w-96">
			<Tabs.List>
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their delivery status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse vetted freelancers available for your projects.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvasElement.querySelector("[data-slot=tabs-list]");
		// The list collapses to its 32px rail only when the orientation
		// variants match the emitted data attributes - guards the regression
		// where every data-[orientation=…] class was dead.
		expect(list?.getBoundingClientRect().height).toBeLessThan(40);
		await userEvent.click(canvas.getByRole("tab", { name: "Freelancers" }));
		await waitFor(() =>
			expect(
				canvas.getByText(
					"Browse vetted freelancers available for your projects.",
				),
			).toBeVisible(),
		);
	},
};

export const LineVariant: Story = {
	render: () => (
		<Tabs.Root defaultValue="projects" className="w-96">
			<Tabs.List variant="line">
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their delivery status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse vetted freelancers available for your projects.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	),
	play: async ({ canvasElement }) => {
		const active = canvasElement.querySelector(
			"[data-slot=tabs-trigger][data-active]",
		);
		expect(active).not.toBeNull();
		// The ::after underline must have real size - it was 0x0 when the
		// orientation variants were dead.
		const after = getComputedStyle(active as Element, "::after");
		expect(Number.parseFloat(after.height)).toBeGreaterThan(0);
		expect(Number.parseFloat(after.width)).toBeGreaterThan(0);
	},
};

export const Vertical: Story = {
	render: () => (
		<Tabs.Root defaultValue="projects" orientation="vertical" className="w-96">
			<Tabs.List>
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">Freelancers</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their delivery status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse vetted freelancers available for your projects.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	),
	play: async ({ canvasElement }) => {
		const [first, second] = canvasElement.querySelectorAll(
			"[data-slot=tabs-trigger]",
		);
		// Vertical tabs must stack - the second trigger sits below the first.
		expect(second?.getBoundingClientRect().top).toBeGreaterThan(
			first?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
		);
	},
};

export const WithIcons: Story = {
	render: () => (
		<Tabs.Root defaultValue="projects" className="w-96">
			<Tabs.List>
				<Tabs.Trigger value="projects">
					<ClipboardTextIcon data-icon="inline-start" />
					Projects
				</Tabs.Trigger>
				<Tabs.Trigger value="freelancers">
					<UsersIcon data-icon="inline-start" />
					Freelancers
				</Tabs.Trigger>
				<Tabs.Trigger value="billing">
					<ReceiptIcon data-icon="inline-start" />
					Billing
				</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their delivery status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse vetted freelancers available for your projects.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	),
};

export const WithDisabled: Story = {
	render: () => (
		<Tabs.Root defaultValue="projects" className="w-96">
			<Tabs.List>
				<Tabs.Trigger value="projects">Projects</Tabs.Trigger>
				<Tabs.Trigger value="freelancers" disabled>
					Freelancers
				</Tabs.Trigger>
				<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="projects">
				Review upcoming projects and their delivery status.
			</Tabs.Content>
			<Tabs.Content value="freelancers">
				Browse vetted freelancers available for your projects.
			</Tabs.Content>
			<Tabs.Content value="billing">
				Track invoices and payouts for completed projects.
			</Tabs.Content>
		</Tabs.Root>
	),
};
