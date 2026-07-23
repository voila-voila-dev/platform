import {
	ClipboardTextIcon,
	ReceiptIcon,
	UsersIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@voila.dev/ui/components/tabs";
import { expect, userEvent, waitFor, within } from "storybook/test";

const meta = {
	title: "UI/Tabs",
	component: Tabs,
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Tabs defaultValue="missions" className="w-96">
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
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvasElement.querySelector("[data-slot=tabs-list]");
		// The list collapses to its 32px rail only when the orientation
		// variants match the emitted data attributes - guards the regression
		// where every data-[orientation=…] class was dead.
		expect(list?.getBoundingClientRect().height).toBeLessThan(40);
		await userEvent.click(canvas.getByRole("tab", { name: "Providers" }));
		await waitFor(() =>
			expect(
				canvas.getByText("Browse healthcare providers available in your area."),
			).toBeVisible(),
		);
	},
};

export const LineVariant: Story = {
	render: () => (
		<Tabs defaultValue="missions" className="w-96">
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
		<Tabs defaultValue="missions" orientation="vertical" className="w-96">
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
		<Tabs defaultValue="missions" className="w-96">
			<TabsList>
				<TabsTrigger value="missions">
					<ClipboardTextIcon data-icon="inline-start" />
					Missions
				</TabsTrigger>
				<TabsTrigger value="providers">
					<UsersIcon data-icon="inline-start" />
					Providers
				</TabsTrigger>
				<TabsTrigger value="billing">
					<ReceiptIcon data-icon="inline-start" />
					Billing
				</TabsTrigger>
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
	),
};

export const WithDisabled: Story = {
	render: () => (
		<Tabs defaultValue="missions" className="w-96">
			<TabsList>
				<TabsTrigger value="missions">Missions</TabsTrigger>
				<TabsTrigger value="providers" disabled>
					Providers
				</TabsTrigger>
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
	),
};
