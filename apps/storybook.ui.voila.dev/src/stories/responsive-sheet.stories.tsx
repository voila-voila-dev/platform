import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { ResponsiveSheet } from "@voila.dev/ui/responsive-sheet";

const meta = {
	title: "UI/ResponsiveSheet",
	component: ResponsiveSheet.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof ResponsiveSheet.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ResponsiveSheet.Root>
			<ResponsiveSheet.Trigger render={<Button variant="outline" />}>
				Open email details
			</ResponsiveSheet.Trigger>
			<ResponsiveSheet.Content size="xl">
				<ResponsiveSheet.Header>
					<ResponsiveSheet.Title>Email details</ResponsiveSheet.Title>
					<ResponsiveSheet.Description>
						Resize the viewport below 768px to get the bottom drawer.
					</ResponsiveSheet.Description>
				</ResponsiveSheet.Header>
				<ResponsiveSheet.Body>
					<dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-sm">
						<dt className="text-muted-foreground">To</dt>
						<dd>camille@example.com</dd>
						<dt className="text-muted-foreground">Status</dt>
						<dd>Sent</dd>
						<dt className="text-muted-foreground">Sent at</dt>
						<dd>22 Jul 2026, 09:00</dd>
					</dl>
				</ResponsiveSheet.Body>
				<ResponsiveSheet.Footer>
					<Button>Resend</Button>
				</ResponsiveSheet.Footer>
			</ResponsiveSheet.Content>
		</ResponsiveSheet.Root>
	),
};
