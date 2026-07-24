import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@voila.dev/ui/components/navigation-menu";

const meta = {
	title: "UI/NavigationMenu",
	component: NavigationMenu,
	tags: ["autodocs"],
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Projects</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-64 gap-1">
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Open projects</span>
										<span className="text-muted-foreground text-xs">
											Projects waiting for a freelancer.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">My engagements</span>
										<span className="text-muted-foreground text-xs">
											Confirmed projects and schedules.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Past reports</span>
										<span className="text-muted-foreground text-xs">
											Completed projects and deliverables.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Freelancers</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-56 gap-1">
							<li>
								<NavigationMenuLink href="#">Directory</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">Invitations</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink href="#" className={navigationMenuTriggerStyle()}>
						Billing
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	),
};
