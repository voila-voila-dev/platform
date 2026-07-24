import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@voila.dev/ui/components/sheet";

const meta = {
	title: "UI/Sheet",
	component: Sheet,
	tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open project details
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Project details</SheetTitle>
					<SheetDescription>
						Landing page redesign for the spring product launch.
					</SheetDescription>
				</SheetHeader>
				<div className="grid gap-2 px-4 text-sm">
					<p>Client: Northwind Studio</p>
					<p>Kickoff: Saturday, June 14 - 2:00 PM</p>
					<p>Rate: 45 USD / hour</p>
				</div>
				<SheetFooter>
					<Button>Confirm engagement</Button>
					<SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};

export const Sides: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["top", "right", "bottom", "left"] as const).map((side) => (
				<Sheet key={side}>
					<SheetTrigger render={<Button variant="outline" />}>
						{side}
					</SheetTrigger>
					<SheetContent side={side}>
						<SheetHeader>
							<SheetTitle>Project details</SheetTitle>
							<SheetDescription>
								This sheet opens from the {side} side.
							</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			))}
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["sm", "default", "lg", "xl", "full"] as const).map((size) => (
				<Sheet key={size}>
					<SheetTrigger render={<Button variant="outline" />}>
						{size}
					</SheetTrigger>
					<SheetContent size={size}>
						<SheetHeader>
							<SheetTitle>Project details</SheetTitle>
							<SheetDescription>
								This right sheet uses the {size} size.
							</SheetDescription>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			))}
		</div>
	),
};

export const WithoutCloseButton: Story = {
	render: () => (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>
				Open without close button
			</SheetTrigger>
			<SheetContent showCloseButton={false}>
				<SheetHeader>
					<SheetTitle>Project details</SheetTitle>
					<SheetDescription>
						Dismiss this sheet from the footer action.
					</SheetDescription>
				</SheetHeader>
				<SheetFooter>
					<SheetClose render={<Button variant="outline" />}>Close</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	),
};
