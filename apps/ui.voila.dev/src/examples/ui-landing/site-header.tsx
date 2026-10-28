import { Button } from "@voila.dev/ui/button";
import { SiteHeader } from "@voila.dev/ui/landing";
import { BrandLogo } from "./fixtures";

const mainNavigation = [
	{ title: "How it works", href: "#how-it-works" },
	{ title: "For clients", href: "#client-benefits" },
	{ title: "For freelancers", href: "#freelancer-benefits" },
];

/* -------------------------------------------------------------------------- */
/* Layout primitives                                                          */
/* -------------------------------------------------------------------------- */

export function Default() {
	return (
		<div className="min-h-52 w-full">
			<SiteHeader.Root>
				<SiteHeader.Bar>
					<SiteHeader.Brand href="#" aria-label="acme.dev">
						<BrandLogo />
					</SiteHeader.Brand>
					<SiteHeader.Nav>
						<SiteHeader.NavList>
							{mainNavigation.map((item) => (
								<SiteHeader.NavItem key={item.href} href={item.href}>
									{item.title}
								</SiteHeader.NavItem>
							))}
						</SiteHeader.NavList>
						<SiteHeader.Actions>
							<Button size="sm" variant="highlight">
								I'm a client
							</Button>
						</SiteHeader.Actions>
					</SiteHeader.Nav>
					<SiteHeader.MobileToggle aria-label="Open or close the menu" />
				</SiteHeader.Bar>
				<SiteHeader.MobileMenu>
					{mainNavigation.map((item) => (
						<SiteHeader.MobileNavItem key={item.href} href={item.href}>
							{item.title}
						</SiteHeader.MobileNavItem>
					))}
					<SiteHeader.MobileActions>
						<Button variant="highlight" className="w-full">
							I'm a client
						</Button>
					</SiteHeader.MobileActions>
				</SiteHeader.MobileMenu>
			</SiteHeader.Root>
			<div className="p-6 text-muted-foreground text-sm">
				The header stays pinned to the top, with a backdrop blur.
			</div>
		</div>
	);
}
