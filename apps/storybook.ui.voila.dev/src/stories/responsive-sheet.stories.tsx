import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	ResponsiveSheet,
	ResponsiveSheetBody,
	ResponsiveSheetContent,
	ResponsiveSheetDescription,
	ResponsiveSheetFooter,
	ResponsiveSheetHeader,
	ResponsiveSheetTitle,
	ResponsiveSheetTrigger,
} from "@voila.dev/ui/components/responsive-sheet";

const meta = {
	title: "UI/ResponsiveSheet",
	component: ResponsiveSheet,
	tags: ["autodocs"],
} satisfies Meta<typeof ResponsiveSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ResponsiveSheet>
			<ResponsiveSheetTrigger render={<Button variant="outline" />}>
				Open email details
			</ResponsiveSheetTrigger>
			<ResponsiveSheetContent size="xl">
				<ResponsiveSheetHeader>
					<ResponsiveSheetTitle>Email details</ResponsiveSheetTitle>
					<ResponsiveSheetDescription>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveSheetDescription>
				</ResponsiveSheetHeader>
				<ResponsiveSheetBody>
					<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
						<dt className="text-muted-foreground">To</dt>
						<dd>camille@example.com</dd>
						<dt className="text-muted-foreground">Status</dt>
						<dd>Sent</dd>
						<dt className="text-muted-foreground">Sent at</dt>
						<dd>22 Jul 2026, 09:00</dd>
					</dl>
				</ResponsiveSheetBody>
				<ResponsiveSheetFooter>
					<Button>Resend</Button>
				</ResponsiveSheetFooter>
			</ResponsiveSheetContent>
		</ResponsiveSheet>
	),
};
