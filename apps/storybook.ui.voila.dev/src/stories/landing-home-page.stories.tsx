import {
	ArrowRightIcon,
	BellIcon,
	BuildingsIcon,
	ChartBarIcon,
	EnvelopeSimpleIcon,
	FacebookLogoIcon,
	FileTextIcon,
	HeartbeatIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
	StethoscopeIcon,
	TrophyIcon,
	UserCheckIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/components/button";
import { ComparisonSection } from "@voila.dev/ui-landing/components/comparison-section";
import { Container } from "@voila.dev/ui-landing/components/container";
import { CtaBanner } from "@voila.dev/ui-landing/components/cta-banner";
import { Eyebrow } from "@voila.dev/ui-landing/components/eyebrow";
import { Heading } from "@voila.dev/ui-landing/components/heading";
import { LandingHero } from "@voila.dev/ui-landing/components/landing-hero";
import { LogoMarquee } from "@voila.dev/ui-landing/components/logo-marquee";
import { Section } from "@voila.dev/ui-landing/components/section";
import { SectionIntro } from "@voila.dev/ui-landing/components/section-intro";
import { SiteFooter } from "@voila.dev/ui-landing/components/site-footer";
import { SiteHeader } from "@voila.dev/ui-landing/components/site-header";
import { StatsRow } from "@voila.dev/ui-landing/components/stats-row";
import { StepTracks } from "@voila.dev/ui-landing/components/step-tracks";
import { TestimonialGrid } from "@voila.dev/ui-landing/components/testimonial-grid";
import { Text } from "@voila.dev/ui-landing/components/text";
import { Fragment } from "react";
import {
	BrandLogo,
	ctaBanner,
	footerNavigation,
	helperBenefits,
	helperTrack,
	heroCopy,
	IllustrationPlaceholder,
	mainNavigation,
	organizationBenefits,
	partnerLogoDataUri,
	partnerNames,
	performerTrack,
	testimonials,
} from "./landing-fixtures";

/**
 * The full home page of acme.dev recomposed from @voila.dev/ui-landing —
 * the 1:1 validation artifact against http://localhost:4002 (Astro site).
 */
const meta = {
	title: "Landing/Pages/Home",
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const performerIcons = [FileTextIcon, UserCheckIcon, HeartbeatIcon];
const helperIcons = [BellIcon, TrophyIcon, ChartBarIcon];

function CtaBannerBlock() {
	return (
		<CtaBanner.Root>
			<CtaBanner.Title>{ctaBanner.title}</CtaBanner.Title>
			<CtaBanner.Description>{ctaBanner.description}</CtaBanner.Description>
			<CtaBanner.Actions>
				<Button size="lg" variant="secondary" className="group">
					Je suis un club
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
				>
					Je suis professionnel de santé
				</Button>
			</CtaBanner.Actions>
		</CtaBanner.Root>
	);
}

export const Home: Story = {
	render: () => (
		<div className="bg-background font-sans text-foreground">
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
				</SiteHeader.MobileMenu>
			</SiteHeader.Root>

			<main>
				{/* Hero */}
				<LandingHero.Root>
					<LandingHero.Content>
						<Eyebrow.Root tone="provider" className="mb-6">
							<Eyebrow.Dot pulse />
							<Eyebrow.Label>{heroCopy.badge}</Eyebrow.Label>
						</Eyebrow.Root>
						<LandingHero.Title>
							{heroCopy.titleStart}{" "}
							<LandingHero.Highlight tone="provider">
								{heroCopy.titleHighlight}
							</LandingHero.Highlight>{" "}
							{heroCopy.titleMiddle}{" "}
							<LandingHero.Highlight tone="organization">
								{heroCopy.titleHighlightEnd}
							</LandingHero.Highlight>{" "}
							{heroCopy.titleEnd}
						</LandingHero.Title>
						<LandingHero.Lead>{heroCopy.description}</LandingHero.Lead>
						<LandingHero.Actions>
							<Button size="lg" variant="organization" className="group">
								<BuildingsIcon className="h-5 w-5" />
								{heroCopy.ctaClub}
								<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>
							<Button size="lg" variant="provider" className="group">
								<StethoscopeIcon className="h-5 w-5" />
								{heroCopy.ctaHealthPro}
								<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>
						</LandingHero.Actions>
						<StatsRow.Root>
							{heroCopy.stats.map((stat, index) => (
								<Fragment key={stat.label}>
									{index > 0 ? <StatsRow.Divider /> : null}
									<StatsRow.Item>
										<StatsRow.Value>{stat.value}</StatsRow.Value>
										<StatsRow.Label>{stat.label}</StatsRow.Label>
									</StatsRow.Item>
								</Fragment>
							))}
						</StatsRow.Root>
					</LandingHero.Content>
					<LandingHero.Media>
						<IllustrationPlaceholder label="HeroIllustration (app-side)" />
					</LandingHero.Media>
				</LandingHero.Root>

				{/* Clients bar */}
				<LogoMarquee.Root>
					<LogoMarquee.Title>Ils nous font confiance</LogoMarquee.Title>
					<LogoMarquee.Viewport>
						<LogoMarquee.Track>
							{partnerNames.map((name) => (
								<LogoMarquee.Item
									key={name}
									src={partnerLogoDataUri(name)}
									alt={name}
								/>
							))}
						</LogoMarquee.Track>
					</LogoMarquee.Viewport>
				</LogoMarquee.Root>

				{/* How it works */}
				<Section id="how-it-works" spacing="lg">
					<Container>
						<SectionIntro.Root>
							<Eyebrow.Root tone="primary" className="mb-4">
								<Eyebrow.Label>Comment ça marche ?</Eyebrow.Label>
							</Eyebrow.Root>
							<SectionIntro.Title>
								Deux parcours, une rencontre
							</SectionIntro.Title>
							<SectionIntro.Description>
								Staffez votre événement côté club, trouvez vos missions côté
								professionnel de santé : trois étapes suffisent.
							</SectionIntro.Description>
						</SectionIntro.Root>

						<StepTracks.Root>
							<StepTracks.Track tone="organization">
								<StepTracks.Header>
									<StepTracks.HeaderIcon>
										<BuildingsIcon />
									</StepTracks.HeaderIcon>
									<StepTracks.HeaderText>
										<StepTracks.HeaderTitle>
											{performerTrack.label}
										</StepTracks.HeaderTitle>
										<StepTracks.HeaderSubtitle>
											{performerTrack.subtitle}
										</StepTracks.HeaderSubtitle>
									</StepTracks.HeaderText>
								</StepTracks.Header>
								<StepTracks.Steps>
									{performerTrack.steps.map((step, index) => {
										const Icon = performerIcons[index] ?? FileTextIcon;
										return (
											<StepTracks.Step
												key={step.title}
												style={{ animationDelay: `${index * 0.1}s` }}
											>
												<StepTracks.StepIcon number={index + 1}>
													<Icon />
												</StepTracks.StepIcon>
												<StepTracks.Body>
													<StepTracks.BodyTitle>
														{step.title}
													</StepTracks.BodyTitle>
													<StepTracks.BodyDescription>
														{step.description}
													</StepTracks.BodyDescription>
												</StepTracks.Body>
											</StepTracks.Step>
										);
									})}
								</StepTracks.Steps>
							</StepTracks.Track>

							<StepTracks.Track
								tone="provider"
								style={{ animationDelay: "0.15s" }}
							>
								<StepTracks.Header>
									<StepTracks.HeaderIcon>
										<StethoscopeIcon />
									</StepTracks.HeaderIcon>
									<StepTracks.HeaderText>
										<StepTracks.HeaderTitle>
											{helperTrack.label}
										</StepTracks.HeaderTitle>
										<StepTracks.HeaderSubtitle>
											{helperTrack.subtitle}
										</StepTracks.HeaderSubtitle>
									</StepTracks.HeaderText>
								</StepTracks.Header>
								<StepTracks.Steps>
									{helperTrack.steps.map((step, index) => {
										const Icon = helperIcons[index] ?? BellIcon;
										return (
											<StepTracks.Step
												key={step.title}
												style={{ animationDelay: `${(3 + index) * 0.1}s` }}
											>
												<StepTracks.StepIcon number={index + 1}>
													<Icon />
												</StepTracks.StepIcon>
												<StepTracks.Body>
													<StepTracks.BodyTitle>
														{step.title}
													</StepTracks.BodyTitle>
													<StepTracks.BodyDescription>
														{step.description}
													</StepTracks.BodyDescription>
												</StepTracks.Body>
											</StepTracks.Step>
										);
									})}
								</StepTracks.Steps>
							</StepTracks.Track>
						</StepTracks.Root>
					</Container>
				</Section>

				<CtaBannerBlock />

				{/* Organization benefits */}
				<ComparisonSection.Root
					tone="organization"
					background="muted"
					id="club-benefits"
				>
					<ComparisonSection.Content>
						<Eyebrow.Root tone="organization" className="mb-4">
							<Eyebrow.Icon>
								<BuildingsIcon />
							</Eyebrow.Icon>
							<Eyebrow.Label>{organizationBenefits.badge}</Eyebrow.Label>
						</Eyebrow.Root>
						<Heading className="mb-8">
							{organizationBenefits.titleStart}{" "}
							<span className="text-organization">
								{organizationBenefits.titleHighlight}
							</span>
						</Heading>
						<ComparisonSection.Panels>
							<ComparisonSection.Panel variant="without">
								<ComparisonSection.PanelTitle>
									{organizationBenefits.withoutTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{organizationBenefits.withoutItems.map((item, index) => (
										<ComparisonSection.PanelItem
											key={item}
											style={{ animationDelay: `${index * 0.08}s` }}
										>
											{item}
										</ComparisonSection.PanelItem>
									))}
								</ComparisonSection.PanelList>
							</ComparisonSection.Panel>
							<ComparisonSection.Panel
								variant="with"
								style={{ animationDelay: "0.3s" }}
							>
								<ComparisonSection.PanelTitle>
									{organizationBenefits.withTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{organizationBenefits.withItems.map((item, index) => (
										<ComparisonSection.PanelItem
											key={item}
											style={{ animationDelay: `${0.3 + index * 0.08}s` }}
										>
											{item}
										</ComparisonSection.PanelItem>
									))}
								</ComparisonSection.PanelList>
							</ComparisonSection.Panel>
						</ComparisonSection.Panels>
						<ComparisonSection.TagList>
							{organizationBenefits.tags.map((tag) => (
								<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
							))}
						</ComparisonSection.TagList>
						<Button
							size="lg"
							variant="organization"
							className="group h-auto min-h-11 max-w-full whitespace-normal py-2 text-center"
						>
							{organizationBenefits.cta}
							<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</ComparisonSection.Content>
					<ComparisonSection.Media>
						<IllustrationPlaceholder label="OrganizationDashboardIllustration (app-side)" />
					</ComparisonSection.Media>
				</ComparisonSection.Root>

				{/* Helper benefits */}
				<ComparisonSection.Root tone="provider" id="health-pro-benefits">
					<ComparisonSection.Content>
						<Eyebrow.Root tone="provider" className="mb-4">
							<Eyebrow.Icon>
								<StethoscopeIcon />
							</Eyebrow.Icon>
							<Eyebrow.Label>{helperBenefits.badge}</Eyebrow.Label>
						</Eyebrow.Root>
						<Heading className="mb-4">
							{helperBenefits.titleStart}{" "}
							<span className="text-provider lg:block">
								{helperBenefits.titleHighlight}
							</span>
						</Heading>
						<Text variant="lead" className="mb-8">
							{helperBenefits.lead}
						</Text>
						<ComparisonSection.Panels>
							<ComparisonSection.Panel variant="without">
								<ComparisonSection.PanelTitle>
									{helperBenefits.withoutTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{helperBenefits.withoutItems.map((item) => (
										<ComparisonSection.PanelItem key={item}>
											{item}
										</ComparisonSection.PanelItem>
									))}
								</ComparisonSection.PanelList>
							</ComparisonSection.Panel>
							<ComparisonSection.Panel variant="with">
								<ComparisonSection.PanelTitle>
									{helperBenefits.withTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{helperBenefits.withItems.map((item) => (
										<ComparisonSection.PanelItem key={item}>
											{item}
										</ComparisonSection.PanelItem>
									))}
								</ComparisonSection.PanelList>
							</ComparisonSection.Panel>
						</ComparisonSection.Panels>
						<ComparisonSection.TagList>
							{helperBenefits.tags.map((tag) => (
								<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
							))}
						</ComparisonSection.TagList>
						<Button size="lg" variant="provider" className="group">
							{helperBenefits.cta}
							<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</ComparisonSection.Content>
					<ComparisonSection.Media>
						<IllustrationPlaceholder label="HelperProfileIllustration (app-side)" />
					</ComparisonSection.Media>
				</ComparisonSection.Root>

				{/* Testimonials */}
				<Section id="testimonials" spacing="lg">
					<Container>
						<SectionIntro.Root>
							<Eyebrow.Root tone="primary" className="mb-4">
								<Eyebrow.Label>Ils en parlent</Eyebrow.Label>
							</Eyebrow.Root>
							<SectionIntro.Title>
								Une communauté engagée autour d'une{" "}
								<span className="text-primary">même conviction</span>
							</SectionIntro.Title>
							<SectionIntro.Description>
								Clubs, sportifs et professionnels sont réunis autour d'une
								vision commune : créer un écosystème plus sûr, plus performant
								et plus durable.
							</SectionIntro.Description>
						</SectionIntro.Root>

						<TestimonialGrid.Root>
							{testimonials.map((testimonial, index) => (
								<TestimonialGrid.Item
									key={testimonial.name}
									style={{ animationDelay: `${index * 0.1}s` }}
								>
									<TestimonialGrid.QuoteIcon />
									<TestimonialGrid.Quote>
										{testimonial.quote}
									</TestimonialGrid.Quote>
									<TestimonialGrid.Footer>
										<TestimonialGrid.Avatar accent={testimonial.accent}>
											{testimonial.name.charAt(0)}
										</TestimonialGrid.Avatar>
										<TestimonialGrid.Author>
											<TestimonialGrid.AuthorName>
												{testimonial.name}
											</TestimonialGrid.AuthorName>
											<TestimonialGrid.AuthorRole>
												{testimonial.role}
											</TestimonialGrid.AuthorRole>
										</TestimonialGrid.Author>
										<TestimonialGrid.Rating />
									</TestimonialGrid.Footer>
								</TestimonialGrid.Item>
							))}
						</TestimonialGrid.Root>
					</Container>
				</Section>

				<CtaBannerBlock />
			</main>

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
		</div>
	),
};
