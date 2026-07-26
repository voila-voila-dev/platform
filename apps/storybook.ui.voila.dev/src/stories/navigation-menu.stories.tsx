import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	NavigationMenu,
	navigationMenuTriggerStyle,
} from "@voila.dev/ui/navigation-menu";

const meta = {
	title: "UI/NavigationMenu",
	component: NavigationMenu.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Projects</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul className="grid w-64 gap-1">
							<li>
								<NavigationMenu.Link href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Open projects</span>
										<span className="text-muted-foreground text-xs">
											Projects waiting for a freelancer.
										</span>
									</div>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">My engagements</span>
										<span className="text-muted-foreground text-xs">
											Confirmed projects and schedules.
										</span>
									</div>
								</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Past reports</span>
										<span className="text-muted-foreground text-xs">
											Completed projects and deliverables.
										</span>
									</div>
								</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Freelancers</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul className="grid w-56 gap-1">
							<li>
								<NavigationMenu.Link href="#">Directory</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link href="#">Invitations</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Link
						href="#"
						className={navigationMenuTriggerStyle()}
					>
						Billing
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	),
};
