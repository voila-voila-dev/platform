import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import { Drawer } from "@voila.dev/ui/drawer";
import { useState } from "react";

const meta = {
	title: "UI/Drawer",
	component: Drawer.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Drawer.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger asChild>
				<Button variant="outline">View project details</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Landing page redesign</Drawer.Title>
					<Drawer.Description>
						Remote, kickoff Monday at 14:00. One product designer requested.
					</Drawer.Description>
				</Drawer.Header>
				<div className="px-4 text-sm text-muted-foreground">
					The freelancer should join the kickoff call a few minutes early and
					log any blockers in the project report after each milestone.
				</div>
				<Drawer.Footer>
					<Button>Apply to this project</Button>
					<Drawer.Close asChild>
						<Button variant="outline">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	),
};

export const FromRight: Story = {
	render: () => (
		<Drawer.Root direction="right">
			<Drawer.Trigger asChild>
				<Button variant="outline">Open side drawer</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Freelancer profile</Drawer.Title>
					<Drawer.Description>
						Nathan Guyot — Product designer, available part-time.
					</Drawer.Description>
				</Drawer.Header>
				<Drawer.Footer>
					<Button>Book freelancer</Button>
					<Drawer.Close asChild>
						<Button variant="outline">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	),
};

export const FromLeft: Story = {
	render: () => (
		<Drawer.Root direction="left">
			<Drawer.Trigger asChild>
				<Button variant="outline">Open navigation drawer</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Workspace menu</Drawer.Title>
					<Drawer.Description>
						Browse projects, freelancers and billing for your workspace.
					</Drawer.Description>
				</Drawer.Header>
			</Drawer.Content>
		</Drawer.Root>
	),
};

export const FromTop: Story = {
	render: () => (
		<Drawer.Root direction="top">
			<Drawer.Trigger asChild>
				<Button variant="outline">Open top drawer</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>New project published</Drawer.Title>
					<Drawer.Description>
						A client is looking for a product designer starting this week.
					</Drawer.Description>
				</Drawer.Header>
			</Drawer.Content>
		</Drawer.Root>
	),
};

export const ScrollableContent: Story = {
	render: () => (
		<Drawer.Root>
			<Drawer.Trigger asChild>
				<Button variant="outline">Read project brief</Button>
			</Drawer.Trigger>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Project brief</Drawer.Title>
					<Drawer.Description>
						Everything to know before the kickoff call.
					</Drawer.Description>
				</Drawer.Header>
				<div className="overflow-y-auto px-4">
					{Array.from({ length: 30 }, (_, index) => (
						<p
							key={index.toString()}
							className="py-2 text-sm text-muted-foreground"
						>
							Brief item {index + 1} — review the scope, check the shared
							assets, confirm the delivery checklist with the client team.
						</p>
					))}
				</div>
				<Drawer.Footer>
					<Drawer.Close asChild>
						<Button variant="outline">Close</Button>
					</Drawer.Close>
				</Drawer.Footer>
			</Drawer.Content>
		</Drawer.Root>
	),
};

export const SnapPoints: Story = {
	render: function SnapPointsStory() {
		const [activeSnapPoint, setActiveSnapPoint] = useState<
			number | string | null
		>(0.5);
		return (
			<Drawer.Root
				snapPoints={[0.5, 1]}
				activeSnapPoint={activeSnapPoint}
				setActiveSnapPoint={setActiveSnapPoint}
			>
				<Drawer.Trigger asChild>
					<Button variant="outline">Open snap drawer</Button>
				</Drawer.Trigger>
				<Drawer.Content className="h-full data-[vaul-drawer-direction=bottom]:max-h-full">
					<Drawer.Header>
						<Drawer.Title>Open projects</Drawer.Title>
						<Drawer.Description>
							Drag the handle up to expand the list.
						</Drawer.Description>
					</Drawer.Header>
					<div className="overflow-y-auto px-4">
						{Array.from({ length: 12 }, (_, index) => (
							<p
								key={index.toString()}
								className="py-2 text-sm text-muted-foreground"
							>
								Project {index + 1} — landing page redesign.
							</p>
						))}
					</div>
				</Drawer.Content>
			</Drawer.Root>
		);
	},
};

export const Controlled: Story = {
	render: function ControlledStory() {
		const [open, setOpen] = useState(false);
		return (
			<div className="flex flex-col items-start gap-2">
				<Button variant="outline" onClick={() => setOpen(true)}>
					Open from outside
				</Button>
				<Drawer.Root open={open} onOpenChange={setOpen}>
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>Application sent</Drawer.Title>
							<Drawer.Description>
								The client will get back to you within 48 hours.
							</Drawer.Description>
						</Drawer.Header>
						<Drawer.Footer>
							<Button onClick={() => setOpen(false)}>Got it</Button>
						</Drawer.Footer>
					</Drawer.Content>
				</Drawer.Root>
			</div>
		);
	},
};
