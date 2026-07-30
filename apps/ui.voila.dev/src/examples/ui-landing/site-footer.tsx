import { EnvelopeSimpleIcon, LinkedinLogoIcon } from "@phosphor-icons/react";
import { SiteFooter } from "@voila.dev/ui/landing";
import { BrandLogo } from "./fixtures";

export function SiteFooterExample() {
	return (
		<SiteFooter.Root>
			<SiteFooter.Columns>
				<SiteFooter.Brand>
					<BrandLogo className="mb-4 block" />
					<SiteFooter.BrandDescription>
						Client teams and independent freelancers, brought together around
						the same projects.
					</SiteFooter.BrandDescription>
					<SiteFooter.SocialLinks>
						<SiteFooter.SocialLink href="#" aria-label="LinkedIn">
							<LinkedinLogoIcon />
						</SiteFooter.SocialLink>
						<SiteFooter.SocialLink
							href="mailto:contact@acme.dev"
							aria-label="Email"
						>
							<EnvelopeSimpleIcon />
						</SiteFooter.SocialLink>
					</SiteFooter.SocialLinks>
				</SiteFooter.Brand>
				<SiteFooter.Column>
					<SiteFooter.ColumnTitle>Platform</SiteFooter.ColumnTitle>
					<SiteFooter.ColumnList>
						<SiteFooter.ColumnLink href="#">How it works</SiteFooter.ColumnLink>
						<SiteFooter.ColumnLink href="#">For clients</SiteFooter.ColumnLink>
					</SiteFooter.ColumnList>
				</SiteFooter.Column>
				<SiteFooter.Column>
					<SiteFooter.ColumnTitle>Legal</SiteFooter.ColumnTitle>
					<SiteFooter.ColumnList>
						<SiteFooter.ColumnLink href="#">Legal notice</SiteFooter.ColumnLink>
						<SiteFooter.ColumnLink href="#">Terms</SiteFooter.ColumnLink>
					</SiteFooter.ColumnList>
				</SiteFooter.Column>
			</SiteFooter.Columns>
			<SiteFooter.Bottom>
				<SiteFooter.BottomText>
					© 2026 acme.dev. All rights reserved.
				</SiteFooter.BottomText>
			</SiteFooter.Bottom>
		</SiteFooter.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Sections                                                                   */
/* -------------------------------------------------------------------------- */
