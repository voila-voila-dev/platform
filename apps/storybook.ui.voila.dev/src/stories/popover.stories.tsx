import { XIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { Input } from "@voila.dev/ui/components/input";
import { Label } from "@voila.dev/ui/components/label";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "@voila.dev/ui/components/popover";
import { useState } from "react";

const meta = {
	title: "UI/Popover",
	component: Popover,
	tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger
				render={<Button variant="outline">Mission details</Button>}
			/>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Saturday match coverage</PopoverTitle>
					<PopoverDescription>
						Stade Rennais — June 14, from 14:00 to 18:00.
					</PopoverDescription>
				</PopoverHeader>
				<p className="text-muted-foreground">
					A physiotherapist is needed pitch-side for the senior rugby team.
				</p>
			</PopoverContent>
		</Popover>
	),
};

export const WithForm: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger render={<Button variant="outline">Edit rate</Button>} />
			<PopoverContent className="w-64">
				<PopoverHeader>
					<PopoverTitle>Hourly rate</PopoverTitle>
					<PopoverDescription>
						Update the rate offered for this mission.
					</PopoverDescription>
				</PopoverHeader>
				<div className="grid gap-2">
					<Label htmlFor="hourly-rate">Rate (EUR)</Label>
					<Input id="hourly-rate" type="number" defaultValue="45" />
					<Button size="sm">Save</Button>
				</div>
			</PopoverContent>
		</Popover>
	),
};

export const WithCloseButton: Story = {
	render: () => (
		<Popover>
			<PopoverTrigger
				render={<Button variant="outline">Mission details</Button>}
			/>
			<PopoverContent>
				<PopoverHeader>
					<PopoverTitle>Saturday match coverage</PopoverTitle>
					<PopoverDescription>
						Stade Rennais — June 14, from 14:00 to 18:00.
					</PopoverDescription>
				</PopoverHeader>
				<PopoverClose
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
				</PopoverClose>
			</PopoverContent>
		</Popover>
	),
};

export const Placement: Story = {
	render: () => (
		<div className="flex min-h-64 items-center justify-center gap-3">
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Popover key={side}>
					<PopoverTrigger render={<Button variant="outline" />}>
						{side}
					</PopoverTrigger>
					<PopoverContent side={side} className="w-56">
						<PopoverHeader>
							<PopoverTitle>Opens to the {side}</PopoverTitle>
							<PopoverDescription>
								Side and align forward to the Positioner.
							</PopoverDescription>
						</PopoverHeader>
					</PopoverContent>
				</Popover>
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
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger
					render={<Button variant="outline">Mission details</Button>}
				/>
				<PopoverContent>
					<PopoverHeader>
						<PopoverTitle>Controlled open state</PopoverTitle>
						<PopoverDescription>
							Driven by the parent component's state.
						</PopoverDescription>
					</PopoverHeader>
					<PopoverClose render={<Button size="sm">Done</Button>} />
				</PopoverContent>
			</Popover>
		</div>
	);
}

export const Controlled: Story = {
	render: () => <ControlledPopover />,
};
