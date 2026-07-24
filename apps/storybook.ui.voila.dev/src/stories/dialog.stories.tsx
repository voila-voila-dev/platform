import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@voila.dev/ui/components/dialog";

const meta = {
	title: "UI/Dialog",
	component: Dialog,
	tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Invite a freelancer
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite a freelancer</DialogTitle>
					<DialogDescription>
						Send an invitation to a freelancer so they can apply to your team's
						projects.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Cancel
					</DialogClose>
					<Button>Send invitation</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

export const DefaultOpen: Story = {
	render: () => (
		<Dialog defaultOpen>
			<DialogTrigger render={<Button variant="outline" />}>
				Cancel project
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Cancel this project?</DialogTitle>
					<DialogDescription>
						The assigned freelancer will be notified immediately. This action
						cannot be undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose render={<Button variant="outline" />}>
						Keep project
					</DialogClose>
					<Button variant="destructive">Cancel project</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

export const WithoutCloseButton: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Open dialog
			</DialogTrigger>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Review the report</DialogTitle>
					<DialogDescription>
						Confirm the project report before releasing the payment.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter closeLabel="Close">
					<Button>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap gap-4">
			{(["sm", "default", "lg", "xl"] as const).map((size) => (
				<Dialog key={size}>
					<DialogTrigger render={<Button variant="outline" />}>
						{size}
					</DialogTrigger>
					<DialogContent size={size}>
						<DialogHeader>
							<DialogTitle>Project details</DialogTitle>
							<DialogDescription>
								This dialog uses the {size} size.
							</DialogDescription>
						</DialogHeader>
					</DialogContent>
				</Dialog>
			))}
		</div>
	),
};

export const LongContent: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Open terms
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Terms of service</DialogTitle>
					<DialogDescription>
						Read the full terms before accepting the project.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-2">
					{Array.from({ length: 30 }, (_, index) => (
						<p key={String(index)}>
							Clause {index + 1}: the freelancer commits to delivering the
							agreed work by each milestone date and to carrying valid
							professional liability insurance for the full duration of the
							project.
						</p>
					))}
				</div>
				<DialogFooter closeLabel="Decline">
					<Button>Accept</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
