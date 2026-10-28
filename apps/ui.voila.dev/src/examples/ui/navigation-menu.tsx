import { NavigationMenu } from "@voila.dev/ui/navigation-menu";

export function Default() {
	return (
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
			</NavigationMenu.List>
		</NavigationMenu.Root>
	);
}
