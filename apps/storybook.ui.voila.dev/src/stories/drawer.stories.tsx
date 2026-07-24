import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@voila.dev/ui/components/drawer";
import { useState } from "react";

const meta = {
	title: "UI/Drawer",
	component: Drawer,
	tags: ["autodocs"],
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">View project details</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Landing page redesign</DrawerTitle>
					<DrawerDescription>
						Remote, kickoff Monday at 14:00. One product designer requested.
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-4 text-sm text-muted-foreground">
					The freelancer should join the kickoff call a few minutes early and
					log any blockers in the project report after each milestone.
				</div>
				<DrawerFooter>
					<Button>Apply to this project</Button>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};

export const FromRight: Story = {
	render: () => (
		<Drawer direction="right">
			<DrawerTrigger asChild>
				<Button variant="outline">Open side drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Freelancer profile</DrawerTitle>
					<DrawerDescription>
						Nathan Guyot — Product designer, available part-time.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Book freelancer</Button>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};

export const FromLeft: Story = {
	render: () => (
		<Drawer direction="left">
			<DrawerTrigger asChild>
				<Button variant="outline">Open navigation drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Workspace menu</DrawerTitle>
					<DrawerDescription>
						Browse projects, freelancers and billing for your workspace.
					</DrawerDescription>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	),
};

export const FromTop: Story = {
	render: () => (
		<Drawer direction="top">
			<DrawerTrigger asChild>
				<Button variant="outline">Open top drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>New project published</DrawerTitle>
					<DrawerDescription>
						A client is looking for a product designer starting this week.
					</DrawerDescription>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	),
};

export const ScrollableContent: Story = {
	render: () => (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">Read project brief</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Project brief</DrawerTitle>
					<DrawerDescription>
						Everything to know before the kickoff call.
					</DrawerDescription>
				</DrawerHeader>
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
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
};

export const SnapPoints: Story = {
	render: function SnapPointsStory() {
		const [activeSnapPoint, setActiveSnapPoint] = useState<
			number | string | null
		>(0.5);
		return (
			<Drawer
				snapPoints={[0.5, 1]}
				activeSnapPoint={activeSnapPoint}
				setActiveSnapPoint={setActiveSnapPoint}
			>
				<DrawerTrigger asChild>
					<Button variant="outline">Open snap drawer</Button>
				</DrawerTrigger>
				<DrawerContent className="h-full data-[vaul-drawer-direction=bottom]:max-h-full">
					<DrawerHeader>
						<DrawerTitle>Open projects</DrawerTitle>
						<DrawerDescription>
							Drag the handle up to expand the list.
						</DrawerDescription>
					</DrawerHeader>
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
				</DrawerContent>
			</Drawer>
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
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle>Application sent</DrawerTitle>
							<DrawerDescription>
								The client will get back to you within 48 hours.
							</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter>
							<Button onClick={() => setOpen(false)}>Got it</Button>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>
		);
	},
};
