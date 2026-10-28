import { CaretDownIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Collapsible } from "@voila.dev/ui/collapsible";
import { useState } from "react";

const meta = {
	title: "UI/Collapsible",
	component: Collapsible.Root,
	tags: ["autodocs"],
	argTypes: {
		defaultOpen: {
			control: "boolean",
			description: "Whether the panel is initially open (uncontrolled).",
		},
		disabled: {
			control: "boolean",
			description: "Whether the trigger is disabled.",
		},
		open: {
			control: false,
			description: "Controlled open state, pair with onOpenChange.",
		},
		onOpenChange: { control: false },
	},
} satisfies Meta<typeof Collapsible.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function TriggerIcon() {
	return (
		<CaretDownIcon className="transition-transform duration-200 group-aria-expanded/collapsible-trigger:rotate-180 motion-reduce:transition-none" />
	);
}

export const Default: Story = {
	render: (args) => (
		<Collapsible.Root {...args} className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">
					3 freelancers applied to this project
				</h4>
				<Collapsible.Trigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle applications"
				>
					<TriggerIcon />
				</Collapsible.Trigger>
			</div>
			<div className="rounded-lg border px-3 py-2 text-sm">
				Camille Dubois — Designer
			</div>
			<Collapsible.Content className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Lea Martin — Developer
				</div>
				<div className="rounded-lg border px-3 py-2 text-sm">
					Hugo Bernard — Copywriter
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Collapsible.Root defaultOpen className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">Upcoming projects</h4>
				<Collapsible.Trigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle projects"
				>
					<TriggerIcon />
				</Collapsible.Trigger>
			</div>
			<Collapsible.Content className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Website redesign — June 20
				</div>
				<div className="rounded-lg border px-3 py-2 text-sm">
					Brand refresh — June 27
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	),
};

function ControlledExample() {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex w-80 flex-col gap-4">
			<Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
				{open ? "Hide" : "Show"} project details from outside
			</Button>
			<Collapsible.Root
				open={open}
				onOpenChange={setOpen}
				className="flex flex-col gap-2"
			>
				<div className="flex items-center justify-between gap-4 px-1">
					<h4 className="text-sm font-medium">Project details</h4>
					<Collapsible.Trigger
						render={<Button variant="ghost" size="icon-sm" />}
						className="group/collapsible-trigger"
						aria-label="Toggle project details"
					>
						<TriggerIcon />
					</Collapsible.Trigger>
				</div>
				<Collapsible.Content className="flex flex-col gap-2">
					<div className="rounded-lg border px-3 py-2 text-sm">
						Northwind — Design engagement, June 20
					</div>
				</Collapsible.Content>
			</Collapsible.Root>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledExample />,
};

export const Disabled: Story = {
	render: () => (
		<Collapsible.Root disabled className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">Archived applications</h4>
				<Collapsible.Trigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle archived applications"
				>
					<TriggerIcon />
				</Collapsible.Trigger>
			</div>
			<Collapsible.Content className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Locked while the project is under review.
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	),
};

export const KeepMounted: Story = {
	render: () => (
		<Collapsible.Root className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">
					Project brief (kept in the DOM when closed)
				</h4>
				<Collapsible.Trigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle project brief"
				>
					<TriggerIcon />
				</Collapsible.Trigger>
			</div>
			<Collapsible.Content keepMounted className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Content stays mounted while hidden — useful for SEO or measuring
					layout before opening.
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	),
};
