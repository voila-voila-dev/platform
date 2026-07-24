import { CaretDownIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@voila.dev/ui/components/collapsible";
import { useState } from "react";

const meta = {
	title: "UI/Collapsible",
	component: Collapsible,
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
} satisfies Meta<typeof Collapsible>;

export default meta;

type Story = StoryObj<typeof meta>;

function TriggerIcon() {
	return (
		<CaretDownIcon className="transition-transform duration-200 group-aria-expanded/collapsible-trigger:rotate-180 motion-reduce:transition-none" />
	);
}

export const Default: Story = {
	render: (args) => (
		<Collapsible {...args} className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">
					3 freelancers applied to this project
				</h4>
				<CollapsibleTrigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle applications"
				>
					<TriggerIcon />
				</CollapsibleTrigger>
			</div>
			<div className="rounded-lg border px-3 py-2 text-sm">
				Camille Dubois — Designer
			</div>
			<CollapsibleContent className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Lea Martin — Developer
				</div>
				<div className="rounded-lg border px-3 py-2 text-sm">
					Hugo Bernard — Copywriter
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Collapsible defaultOpen className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">Upcoming projects</h4>
				<CollapsibleTrigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle projects"
				>
					<TriggerIcon />
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Website redesign — June 20
				</div>
				<div className="rounded-lg border px-3 py-2 text-sm">
					Brand refresh — June 27
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

function ControlledExample() {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex w-80 flex-col gap-4">
			<Button variant="outline" size="sm" onClick={() => setOpen(!open)}>
				{open ? "Hide" : "Show"} project details from outside
			</Button>
			<Collapsible
				open={open}
				onOpenChange={setOpen}
				className="flex flex-col gap-2"
			>
				<div className="flex items-center justify-between gap-4 px-1">
					<h4 className="text-sm font-medium">Project details</h4>
					<CollapsibleTrigger
						render={<Button variant="ghost" size="icon-sm" />}
						className="group/collapsible-trigger"
						aria-label="Toggle project details"
					>
						<TriggerIcon />
					</CollapsibleTrigger>
				</div>
				<CollapsibleContent className="flex flex-col gap-2">
					<div className="rounded-lg border px-3 py-2 text-sm">
						Northwind — Design engagement, June 20
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledExample />,
};

export const Disabled: Story = {
	render: () => (
		<Collapsible disabled className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">Archived applications</h4>
				<CollapsibleTrigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle archived applications"
				>
					<TriggerIcon />
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Locked while the project is under review.
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};

export const KeepMounted: Story = {
	render: () => (
		<Collapsible className="flex w-80 flex-col gap-2">
			<div className="flex items-center justify-between gap-4 px-1">
				<h4 className="text-sm font-medium">
					Project brief (kept in the DOM when closed)
				</h4>
				<CollapsibleTrigger
					render={<Button variant="ghost" size="icon-sm" />}
					className="group/collapsible-trigger"
					aria-label="Toggle project brief"
				>
					<TriggerIcon />
				</CollapsibleTrigger>
			</div>
			<CollapsibleContent keepMounted className="flex flex-col gap-2">
				<div className="rounded-lg border px-3 py-2 text-sm">
					Content stays mounted while hidden — useful for SEO or measuring
					layout before opening.
				</div>
			</CollapsibleContent>
		</Collapsible>
	),
};
