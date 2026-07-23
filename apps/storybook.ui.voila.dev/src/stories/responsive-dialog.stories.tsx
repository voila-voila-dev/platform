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
				Invite a provider
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Invite a provider</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						Send an invitation to a healthcare provider so they can apply to
						your club's missions. Resize the viewport below 768px to get the
						bottom drawer.
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
				Cancel mission
			</ResponsiveDialogTrigger>
			<ResponsiveDialogContent>
				<ResponsiveDialogHeader>
					<ResponsiveDialogTitle>Cancel this mission?</ResponsiveDialogTitle>
					<ResponsiveDialogDescription>
						The assigned provider will be notified immediately.
					</ResponsiveDialogDescription>
				</ResponsiveDialogHeader>
				<ResponsiveDialogBody>
					<p>
						Refunds follow the escrow cancellation policy: the held payment is
						returned to the club's wallet once the cancellation is confirmed.
					</p>
				</ResponsiveDialogBody>
				<ResponsiveDialogFooter>
					<ResponsiveDialogClose render={<Button variant="outline" />}>
						Keep mission
					</ResponsiveDialogClose>
					<Button variant="destructive">Cancel mission</Button>
				</ResponsiveDialogFooter>
			</ResponsiveDialogContent>
		</ResponsiveDialog>
	),
};
