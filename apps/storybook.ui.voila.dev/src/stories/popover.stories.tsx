import { XIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";
import { Popover } from "@voila.dev/ui/popover";
import { useState } from "react";

const meta = {
	title: "UI/Popover",
	component: Popover.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Popover.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Popover.Root>
			<Popover.Trigger
				render={<Button variant="outline">Project details</Button>}
			/>
			<Popover.Content>
				<Popover.Header>
					<Popover.Title>Landing page redesign</Popover.Title>
					<Popover.Description>
						Acme Labs — June 14, kickoff from 14:00 to 18:00.
					</Popover.Description>
				</Popover.Header>
				<p className="text-muted-foreground">
					A product designer is needed to lead the marketing site refresh.
				</p>
			</Popover.Content>
		</Popover.Root>
	),
};

export const WithForm: Story = {
	render: () => (
		<Popover.Root>
			<Popover.Trigger render={<Button variant="outline">Edit rate</Button>} />
			<Popover.Content className="w-64">
				<Popover.Header>
					<Popover.Title>Hourly rate</Popover.Title>
					<Popover.Description>
						Update the rate offered for this project.
					</Popover.Description>
				</Popover.Header>
				<div className="grid gap-2">
					<Label htmlFor="hourly-rate">Rate (USD)</Label>
					<Input id="hourly-rate" type="number" defaultValue="45" />
					<Button size="sm">Save</Button>
				</div>
			</Popover.Content>
		</Popover.Root>
	),
};

export const WithCloseButton: Story = {
	render: () => (
		<Popover.Root>
			<Popover.Trigger
				render={<Button variant="outline">Project details</Button>}
			/>
			<Popover.Content>
				<Popover.Header>
					<Popover.Title>Landing page redesign</Popover.Title>
					<Popover.Description>
						Acme Labs — June 14, kickoff from 14:00 to 18:00.
					</Popover.Description>
				</Popover.Header>
				<Popover.Close
					render={
						<Button
							variant="ghost"
							size="icon-sm"
							className="absolute top-1.5 right-1.5"
						/>
					}
				>
					<XIcon />
					<span className="sr-only">Close</span>
				</Popover.Close>
			</Popover.Content>
		</Popover.Root>
	),
};

export const Placement: Story = {
	render: () => (
		<div className="flex min-h-64 items-center justify-center gap-3">
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Popover.Root key={side}>
					<Popover.Trigger render={<Button variant="outline" />}>
						{side}
					</Popover.Trigger>
					<Popover.Content side={side} className="w-56">
						<Popover.Header>
							<Popover.Title>Opens to the {side}</Popover.Title>
							<Popover.Description>
								Side and align forward to the Positioner.
							</Popover.Description>
						</Popover.Header>
					</Popover.Content>
				</Popover.Root>
			))}
		</div>
	),
};

function ControlledPopover() {
	const [open, setOpen] = useState(false);
	return (
		<div className="flex flex-col items-start gap-3">
			<Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
				Toggle externally ({open ? "open" : "closed"})
			</Button>
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger
					render={<Button variant="outline">Project details</Button>}
				/>
				<Popover.Content>
					<Popover.Header>
						<Popover.Title>Controlled open state</Popover.Title>
						<Popover.Description>
							Driven by the parent component's state.
						</Popover.Description>
					</Popover.Header>
					<Popover.Close render={<Button size="sm">Done</Button>} />
				</Popover.Content>
			</Popover.Root>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledPopover />,
};
