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
					<NavigationMenuTrigger>Missions</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-64 gap-1">
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Open missions</span>
										<span className="text-muted-foreground text-xs">
											Missions waiting for a provider.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">My bookings</span>
										<span className="text-muted-foreground text-xs">
											Confirmed missions and schedules.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
							<li>
								<NavigationMenuLink href="#">
									<div className="flex flex-col gap-0.5">
										<span className="font-medium">Past reports</span>
										<span className="text-muted-foreground text-xs">
											Completed missions and follow-up sheets.
										</span>
									</div>
								</NavigationMenuLink>
							</li>
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Providers</NavigationMenuTrigger>
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
