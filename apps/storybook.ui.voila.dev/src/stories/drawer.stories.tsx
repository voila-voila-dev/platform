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
				<Button variant="outline">View mission details</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Match coverage — Saturday</DrawerTitle>
					<DrawerDescription>
						Stade Marcel Michelin, 14:00 to 18:00. One physiotherapist
						requested.
					</DrawerDescription>
				</DrawerHeader>
				<div className="px-4 text-sm text-muted-foreground">
					The provider should arrive 30 minutes before kickoff and report any
					incident in the follow-up sheet after the match.
				</div>
				<DrawerFooter>
					<Button>Apply to this mission</Button>
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
					<DrawerTitle>Provider profile</DrawerTitle>
					<DrawerDescription>
						Nathan Guyot — Physiotherapist, available on weekends.
					</DrawerDescription>
				</DrawerHeader>
				<DrawerFooter>
					<Button>Book provider</Button>
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
					<DrawerTitle>Club menu</DrawerTitle>
					<DrawerDescription>
						Browse missions, providers and billing for your club.
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
					<DrawerTitle>New mission published</DrawerTitle>
					<DrawerDescription>
						A club near you is looking for a physiotherapist this weekend.
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
				<Button variant="outline">Read mission briefing</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Mission briefing</DrawerTitle>
					<DrawerDescription>
						Everything to know before Saturday's match.
					</DrawerDescription>
				</DrawerHeader>
				<div className="overflow-y-auto px-4">
					{Array.from({ length: 30 }, (_, index) => (
						<p
							key={index.toString()}
							className="py-2 text-sm text-muted-foreground"
						>
							Briefing item {index + 1} — arrive early, check the first-aid kit,
							confirm the emergency exit routes with the venue staff.
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
						<DrawerTitle>Nearby missions</DrawerTitle>
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
								Mission {index + 1} — weekend match coverage.
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
								The club will get back to you within 48 hours.
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
