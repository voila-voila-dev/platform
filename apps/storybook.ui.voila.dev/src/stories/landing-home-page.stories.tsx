import {
	ArrowRightIcon,
	BellIcon,
	BuildingsIcon,
	ChartBarIcon,
	EnvelopeSimpleIcon,
	FacebookLogoIcon,
	FileTextIcon,
	InstagramLogoIcon,
	LinkedinLogoIcon,
	PenNibIcon,
	RocketLaunchIcon,
	TrophyIcon,
	UserCheckIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import {
	ComparisonSection,
	Container,
	CtaBanner,
	Eyebrow,
	Heading,
	LandingHero,
	LogoMarquee,
	Section,
	SectionIntro,
	SiteFooter,
	SiteHeader,
	StatsRow,
	StepTracks,
	TestimonialGrid,
	Text,
} from "@voila.dev/ui/landing";
import { Fragment } from "react";
import {
	BrandLogo,
	clientBenefits,
	ctaBanner,
	footerNavigation,
	freelancerBenefits,
	helperTrack,
	heroCopy,
	IllustrationPlaceholder,
	mainNavigation,
	partnerLogoDataUri,
	partnerNames,
	performerTrack,
	testimonials,
} from "./landing-fixtures";

/**
 * The full home page of acme.dev recomposed from @voila.dev/ui/landing —
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

const performerIcons = [FileTextIcon, UserCheckIcon, RocketLaunchIcon];
const helperIcons = [BellIcon, TrophyIcon, ChartBarIcon];

function CtaBannerBlock() {
	return (
		<CtaBanner.Root>
			<CtaBanner.Title>{ctaBanner.title}</CtaBanner.Title>
			<CtaBanner.Description>{ctaBanner.description}</CtaBanner.Description>
			<CtaBanner.Actions>
				<Button size="lg" variant="secondary" className="group">
					I'm a client
					<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
				</Button>
				<Button
					size="lg"
					variant="outline"
					className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
				>
					I'm a freelancer
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
							<Button size="sm" variant="brand">
								I'm a freelancer
							</Button>
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
				</SiteHeader.MobileMenu>
			</SiteHeader.Root>

			<main>
				{/* Hero */}
				<LandingHero.Root>
					<LandingHero.Content>
						<Eyebrow.Root tone="brand" className="mb-6">
							<Eyebrow.Dot pulse />
							<Eyebrow.Label>{heroCopy.badge}</Eyebrow.Label>
						</Eyebrow.Root>
						<LandingHero.Title>
							{heroCopy.titleStart}{" "}
							<LandingHero.Highlight tone="brand">
								{heroCopy.titleHighlight}
							</LandingHero.Highlight>{" "}
							{heroCopy.titleMiddle}{" "}
							<LandingHero.Highlight tone="highlight">
								{heroCopy.titleHighlightEnd}
							</LandingHero.Highlight>{" "}
							{heroCopy.titleEnd}
						</LandingHero.Title>
						<LandingHero.Lead>{heroCopy.description}</LandingHero.Lead>
						<LandingHero.Actions>
							<Button size="lg" variant="highlight" className="group">
								<BuildingsIcon className="h-5 w-5" />
								{heroCopy.ctaClient}
								<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
							</Button>
							<Button size="lg" variant="brand" className="group">
								<PenNibIcon className="h-5 w-5" />
								{heroCopy.ctaFreelancer}
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
					<LogoMarquee.Title>Trusted by teams like yours</LogoMarquee.Title>
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
								<Eyebrow.Label>How it works</Eyebrow.Label>
							</Eyebrow.Root>
							<SectionIntro.Title>
								Two journeys, one meeting point
							</SectionIntro.Title>
							<SectionIntro.Description>
								Staff your project on the client side, find your next
								engagements on the freelancer side: three steps is all it takes.
							</SectionIntro.Description>
						</SectionIntro.Root>

						<StepTracks.Root>
							<StepTracks.Track tone="highlight">
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
								tone="brand"
								style={{ animationDelay: "0.15s" }}
							>
								<StepTracks.Header>
									<StepTracks.HeaderIcon>
										<PenNibIcon />
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

				{/* Client benefits */}
				<ComparisonSection.Root
					tone="highlight"
					background="muted"
					id="client-benefits"
				>
					<ComparisonSection.Content>
						<Eyebrow.Root tone="highlight" className="mb-4">
							<Eyebrow.Icon>
								<BuildingsIcon />
							</Eyebrow.Icon>
							<Eyebrow.Label>{clientBenefits.badge}</Eyebrow.Label>
						</Eyebrow.Root>
						<Heading className="mb-8">
							{clientBenefits.titleStart}{" "}
							<span className="text-highlight">
								{clientBenefits.titleHighlight}
							</span>
						</Heading>
						<ComparisonSection.Panels>
							<ComparisonSection.Panel variant="without">
								<ComparisonSection.PanelTitle>
									{clientBenefits.withoutTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{clientBenefits.withoutItems.map((item, index) => (
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
									{clientBenefits.withTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{clientBenefits.withItems.map((item, index) => (
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
							{clientBenefits.tags.map((tag) => (
								<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
							))}
						</ComparisonSection.TagList>
						<Button
							size="lg"
							variant="highlight"
							className="group h-auto min-h-11 max-w-full whitespace-normal py-2 text-center"
						>
							{clientBenefits.cta}
							<ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</Button>
					</ComparisonSection.Content>
					<ComparisonSection.Media>
						<IllustrationPlaceholder label="ClientDashboardIllustration (app-side)" />
					</ComparisonSection.Media>
				</ComparisonSection.Root>

				{/* Helper benefits */}
				<ComparisonSection.Root tone="brand" id="freelancer-benefits">
					<ComparisonSection.Content>
						<Eyebrow.Root tone="brand" className="mb-4">
							<Eyebrow.Icon>
								<PenNibIcon />
							</Eyebrow.Icon>
							<Eyebrow.Label>{freelancerBenefits.badge}</Eyebrow.Label>
						</Eyebrow.Root>
						<Heading className="mb-4">
							{freelancerBenefits.titleStart}{" "}
							<span className="text-brand lg:block">
								{freelancerBenefits.titleHighlight}
							</span>
						</Heading>
						<Text variant="lead" className="mb-8">
							{freelancerBenefits.lead}
						</Text>
						<ComparisonSection.Panels>
							<ComparisonSection.Panel variant="without">
								<ComparisonSection.PanelTitle>
									{freelancerBenefits.withoutTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{freelancerBenefits.withoutItems.map((item) => (
										<ComparisonSection.PanelItem key={item}>
											{item}
										</ComparisonSection.PanelItem>
									))}
								</ComparisonSection.PanelList>
							</ComparisonSection.Panel>
							<ComparisonSection.Panel variant="with">
								<ComparisonSection.PanelTitle>
									{freelancerBenefits.withTitle}
								</ComparisonSection.PanelTitle>
								<ComparisonSection.PanelList>
									{freelancerBenefits.withItems.map((item) => (
										<ComparisonSection.PanelItem key={item}>
											{item}
										</ComparisonSection.PanelItem>
									))}
								</ComparisonSection.PanelList>
							</ComparisonSection.Panel>
						</ComparisonSection.Panels>
						<ComparisonSection.TagList>
							{freelancerBenefits.tags.map((tag) => (
								<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
							))}
						</ComparisonSection.TagList>
						<Button size="lg" variant="brand" className="group">
							{freelancerBenefits.cta}
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
								<Eyebrow.Label>In their words</Eyebrow.Label>
							</Eyebrow.Root>
							<SectionIntro.Title>
								A committed community around a{" "}
								<span className="text-primary">shared conviction</span>
							</SectionIntro.Title>
							<SectionIntro.Description>
								Clients, freelancers and partners are united around a common
								vision: building a way of working that is fairer, more effective
								and built to last.
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
							The platform that connects client teams and independent
							freelancers to deliver quality projects together.
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
						© 2026 acme.dev. All rights reserved.
					</SiteFooter.BottomText>
					<SiteFooter.BottomText>
						Made with ❤️ for independent work
					</SiteFooter.BottomText>
				</SiteFooter.Bottom>
			</SiteFooter.Root>
		</div>
	),
};
