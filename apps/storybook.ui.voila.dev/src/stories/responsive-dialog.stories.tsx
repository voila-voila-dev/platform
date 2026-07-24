import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle,
	ResponsiveDialogTrigger,
} from "@voila.dev/ui/components/responsive-dialog";

const meta = {
	title: "UI/ResponsiveDialog",
	component: ResponsiveDialog,
	tags: ["autodocs"],
} satisfies Meta<typeof ResponsiveDialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger render={<Button variant="outline" />}>
				Invite a freelancer
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Invite a freelancer</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Send an invitation to a freelancer so they can apply to your team's
						projects. Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogFooter closeLabel="Cancel">
					<Button>Send invitation</Button>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	),
};

export const WithBody: Story = {
	render: () => (
		<ResponsiveDialog>
			<ResponsiveDialogTrigger render={<Button variant="outline" />}>
				Cancel project
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Cancel this project?</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						The assigned freelancer will be notified immediately.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogBody>
					<p>
						Refunds follow the escrow cancellation policy: the held payment is
						returned to the client's wallet once the cancellation is confirmed.
					</p>
				</ResponsiveDialogBody>
				<ResponsiveDialogFooter>
					<ResponsiveDialogClose render={<Button variant="outline" />}>
						Keep project
					</ResponsiveDialogClose>
					<Button variant="destructive">Cancel project</Button>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	),
};
