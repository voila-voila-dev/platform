import {
	EnvelopeSimpleIcon,
	FacebookLogoIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { SiteFooter } from "@voila.dev/ui-landing/components/site-footer";
import { BrandLogo, footerNavigation } from "./landing-fixtures";

const meta = {
	title: "Landing/SiteFooter",
	component: SiteFooter.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SiteFooter.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the original Astro site's `layout/footer.astro`. */
export const Default: Story = {
	render: () => (
		<SiteFooter.Root>
			<SiteFooter.Columns>
				<SiteFooter.Brand>
					<BrandLogo className="mb-4 block" />
					<SiteFooter.BrandDescription>
						Plateforme qui met en relation clubs de sport et professionnels de
						santé pour des événements sportifs de qualité.
					</SiteFooter.BrandDescription>
					<SiteFooter.SocialLinks>
						<SiteFooter.SocialLink href="#" aria-label="Facebook">
							<FacebookLogoIcon />
						</SiteFooter.SocialLink>
						<SiteFooter.SocialLink href="#" aria-label="LinkedIn">
							<LinkedinLogoIcon />
						</SiteFooter.SocialLink>
						<SiteFooter.SocialLink href="#" aria-label="Instagram">
							<InstagramLogoIcon />
						</SiteFooter.SocialLink>
						<SiteFooter.SocialLink
							href="mailto:contact@acme.dev"
							aria-label="Email"
						>
							<EnvelopeSimpleIcon />
						</SiteFooter.SocialLink>
					</SiteFooter.SocialLinks>
				</SiteFooter.Brand>

				{footerNavigation.map((section) => (
					<SiteFooter.Column key={section.title}>
						<SiteFooter.ColumnTitle>{section.title}</SiteFooter.ColumnTitle>
						<SiteFooter.ColumnList>
							{section.items.map((item) => (
								<SiteFooter.ColumnLink key={item.href} href={item.href}>
									{item.title}
								</SiteFooter.ColumnLink>
							))}
						</SiteFooter.ColumnList>
					</SiteFooter.Column>
				))}
			</SiteFooter.Columns>

			<SiteFooter.Bottom>
				<SiteFooter.BottomText>
					© 2026 acme.dev. Tous droits réservés.
				</SiteFooter.BottomText>
				<SiteFooter.BottomText>
					Fait avec ❤️ pour le sport et la santé
				</SiteFooter.BottomText>
			</SiteFooter.Bottom>
		</SiteFooter.Root>
	),
};
