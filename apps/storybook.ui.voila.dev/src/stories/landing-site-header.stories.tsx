import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { SiteHeader } from "@voila.dev/ui-landing/components/site-header";
import { BrandLogo, mainNavigation } from "./landing-fixtures";

const meta = {
	title: "Landing/SiteHeader",
	component: SiteHeader.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SiteHeader.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

function HeaderExample() {
	return (
		<SiteHeader.Root>
			<SiteHeader.Bar>
				<SiteHeader.Brand href="/" aria-label="acme.dev">
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
						<Button size="sm" variant="provider">
							Je suis professionnel de santé
						</Button>
						<Button size="sm" variant="organization">
							Je suis un club
						</Button>
					</SiteHeader.Actions>
				</SiteHeader.Nav>

				<SiteHeader.MobileToggle aria-label="Ouvrir ou fermer le menu" />
			</SiteHeader.Bar>

			<SiteHeader.MobileMenu>
				{mainNavigation.map((item) => (
					<SiteHeader.MobileNavItem key={item.href} href={item.href}>
						{item.title}
					</SiteHeader.MobileNavItem>
				))}
				<SiteHeader.MobileActions>
					<Button variant="provider" className="w-full">
						Je suis professionnel de santé
					</Button>
					<Button variant="organization" className="w-full">
						Je suis un club
					</Button>
				</SiteHeader.MobileActions>
			</SiteHeader.MobileMenu>
		</SiteHeader.Root>
	);
}

/** Reproduces the original Astro site's `layout/header.astro`. Resize below `md` to use the burger menu. */
export const Default: Story = {
	render: () => (
		<div className="min-h-75">
			<HeaderExample />
			<div className="p-8 text-sm text-muted-foreground">
				Contenu de page — l'en-tête reste collé en haut avec un flou
				d'arrière-plan.
			</div>
		</div>
	),
};
