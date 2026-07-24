import {
	ArrowRightIcon,
	BellIcon,
	BriefcaseIcon,
	BuildingsIcon,
	CalendarBlankIcon,
	ChartBarIcon,
	CheckCircleIcon,
	CurrencyDollarIcon,
	EnvelopeIcon,
	EnvelopeSimpleIcon,
	FileTextIcon,
	HandHeartIcon,
	LightningIcon,
	LinkedinLogoIcon,
	PackageIcon,
	PathIcon,
	RocketLaunchIcon,
	TrophyIcon,
	UserCheckIcon,
} from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import { cn } from "@voila.dev/ui/lib/utils";
import {
	ArticleCard,
	ArticleTags as ArticleTagsParts,
} from "@voila.dev/ui-landing/components/article-card";
import { BentoGrid } from "@voila.dev/ui-landing/components/bento-grid";
import { ComparisonSection } from "@voila.dev/ui-landing/components/comparison-section";
import { ContactCards } from "@voila.dev/ui-landing/components/contact-cards";
import { Container } from "@voila.dev/ui-landing/components/container";
import { CtaBanner } from "@voila.dev/ui-landing/components/cta-banner";
import { Eyebrow as EyebrowParts } from "@voila.dev/ui-landing/components/eyebrow";
import { FeatureGrid } from "@voila.dev/ui-landing/components/feature-grid";
import { Heading as HeadingComponent } from "@voila.dev/ui-landing/components/heading";
import { LandingHero } from "@voila.dev/ui-landing/components/landing-hero";
import { LogoMarquee } from "@voila.dev/ui-landing/components/logo-marquee";
import { NumberedCards } from "@voila.dev/ui-landing/components/numbered-cards";
import { PageHeader } from "@voila.dev/ui-landing/components/page-header";
import { ProseArticle as ProseArticleComponent } from "@voila.dev/ui-landing/components/prose-article";
import {
	Section as SectionComponent,
	sectionBackgroundOptions,
} from "@voila.dev/ui-landing/components/section";
import { SectionIntro as SectionIntroParts } from "@voila.dev/ui-landing/components/section-intro";
import { SiteFooter } from "@voila.dev/ui-landing/components/site-footer";
import { SiteHeader } from "@voila.dev/ui-landing/components/site-header";
import { StatsRow } from "@voila.dev/ui-landing/components/stats-row";
import { StepTracks } from "@voila.dev/ui-landing/components/step-tracks";
import { TestimonialGrid } from "@voila.dev/ui-landing/components/testimonial-grid";
import { Text as TextComponent } from "@voila.dev/ui-landing/components/text";
import { Fragment } from "react";

/**
 * Shared fixtures, trimmed down from the Storybook set: the previews here are a
 * few hundred pixels wide, so three stats and two panels read better than the
 * full marketing copy.
 */

function BrandLogo({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"font-heading font-bold text-primary text-xl tracking-tight",
				className,
			)}
		>
			acme.dev
		</span>
	);
}

function partnerLogoDataUri(name: string): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><rect width="160" height="48" rx="8" fill="#e2e8f0"/><text x="80" y="30" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569" text-anchor="middle">${name}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const partnerNames = ["Northwind", "Globex", "Initech", "Contoso"];

function IllustrationPlaceholder({ label }: { label: string }) {
	return (
		<div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-border border-dashed bg-muted/50">
			<span className="text-muted-foreground text-sm">{label}</span>
		</div>
	);
}

const stats = [
	{ value: "20K+", label: "Active members" },
	{ value: "2000+", label: "Vetted freelancers" },
	{ value: "700+", label: "Projects delivered" },
];

const mainNavigation = [
	{ title: "How it works", href: "#how-it-works" },
	{ title: "For clients", href: "#client-benefits" },
	{ title: "For freelancers", href: "#freelancer-benefits" },
];

/* -------------------------------------------------------------------------- */
/* Layout primitives                                                          */
/* -------------------------------------------------------------------------- */

export function ContainerExample() {
	return (
		<Container size="md">
			<div className="rounded-lg border border-border border-dashed bg-muted/40 p-6 text-muted-foreground text-sm">
				max-width md
			</div>
		</Container>
	);
}

export function SectionExample() {
	return (
		<div className="w-full">
			{sectionBackgroundOptions.map((background) => (
				<SectionComponent key={background} spacing="sm" background={background}>
					<Container>
						<TextComponent weight="medium">{background}</TextComponent>
					</Container>
				</SectionComponent>
			))}
		</div>
	);
}

export function Heading() {
	return (
		<div className="space-y-4">
			<HeadingComponent level="h1">
				Find a <span className="text-brand">trusted freelancer</span> for your{" "}
				<span className="text-highlight">next project</span>
			</HeadingComponent>
			<HeadingComponent level="h3">Two journeys, one match</HeadingComponent>
		</div>
	);
}

export function Text() {
	return (
		<div className="space-y-4">
			<TextComponent variant="lead">
				The platform that connects client teams with independent freelancers.
			</TextComponent>
			<TextComponent variant="muted">
				Let's build better projects, together.
			</TextComponent>
		</div>
	);
}

export function Eyebrow() {
	return (
		<div className="flex flex-wrap gap-4">
			<EyebrowParts.Root tone="brand">
				<EyebrowParts.Dot pulse />
				<EyebrowParts.Label>New platform</EyebrowParts.Label>
			</EyebrowParts.Root>
			<EyebrowParts.Root tone="highlight">
				<EyebrowParts.Icon>
					<BuildingsIcon />
				</EyebrowParts.Icon>
				<EyebrowParts.Label>For client teams</EyebrowParts.Label>
			</EyebrowParts.Root>
		</div>
	);
}

export function SectionIntro() {
	return (
		<SectionIntroParts.Root>
			<EyebrowParts.Root tone="primary" className="mb-4">
				<EyebrowParts.Label>How it works</EyebrowParts.Label>
			</EyebrowParts.Root>
			<SectionIntroParts.Title>
				Two journeys, one <span className="text-primary">match</span>
			</SectionIntroParts.Title>
			<SectionIntroParts.Description>
				Staff your project as a client, find your next engagement as a
				freelancer: three steps are enough.
			</SectionIntroParts.Description>
		</SectionIntroParts.Root>
	);
}

export function PageHeaderExample() {
	return (
		<PageHeader.Root>
			<PageHeader.Title>Contact</PageHeader.Title>
			<PageHeader.Lead>
				A question, a request, an idea? Write to us and we will get back to you
				quickly.
			</PageHeader.Lead>
		</PageHeader.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Page chrome                                                                */
/* -------------------------------------------------------------------------- */

export function SiteHeaderExample() {
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

export function Hero() {
	return (
		<LandingHero.Root>
			<LandingHero.Content>
				<EyebrowParts.Root tone="brand" className="mb-6">
					<EyebrowParts.Dot pulse />
					<EyebrowParts.Label>New platform</EyebrowParts.Label>
				</EyebrowParts.Root>
				<LandingHero.Title>
					Find a{" "}
					<LandingHero.Highlight tone="brand">
						trusted freelancer
					</LandingHero.Highlight>{" "}
					for your{" "}
					<LandingHero.Highlight tone="highlight">
						next project
					</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead>
					The platform that connects client teams with independent freelancers.
				</LandingHero.Lead>
				<LandingHero.Actions>
					<Button size="lg" variant="highlight">
						<BuildingsIcon /> I'm a client
					</Button>
					<Button size="lg" variant="brand">
						<BriefcaseIcon /> I'm a freelancer
					</Button>
				</LandingHero.Actions>
				<StatsRow.Root>
					{stats.map((stat, index) => (
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
				<IllustrationPlaceholder label="Illustration (app-side)" />
			</LandingHero.Media>
		</LandingHero.Root>
	);
}

export function HeroCentered() {
	return (
		<LandingHero.Root layout="centered" background="gradient-primary">
			<LandingHero.Content className="text-center">
				<LandingHero.Title>
					Join the{" "}
					<LandingHero.Highlight tone="primary">movement</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead className="mx-auto">
					Client or freelancer, there is a place for you.
				</LandingHero.Lead>
				<LandingHero.Actions className="justify-center">
					<Button size="lg" variant="primary">
						Get started
					</Button>
				</LandingHero.Actions>
			</LandingHero.Content>
		</LandingHero.Root>
	);
}

export function StatsRowExample() {
	return (
		<StatsRow.Root>
			{stats.map((stat, index) => (
				<Fragment key={stat.label}>
					{index > 0 ? <StatsRow.Divider /> : null}
					<StatsRow.Item>
						<StatsRow.Value>{stat.value}</StatsRow.Value>
						<StatsRow.Label>{stat.label}</StatsRow.Label>
					</StatsRow.Item>
				</Fragment>
			))}
		</StatsRow.Root>
	);
}

const features = [
	{
		icon: CurrencyDollarIcon,
		title: "Agency rates run high",
		description:
			"Hiring an agency for every small task drains the budget of growing teams.",
	},
	{
		icon: PackageIcon,
		title: "Skills always missing",
		description:
			"The expertise you need is never in-house at the moment you need it.",
	},
];

export function FeatureGridExample() {
	return (
		<FeatureGrid.Root tone="destructive" columns="2">
			{features.map((feature) => {
				const Icon = feature.icon;
				return (
					<FeatureGrid.Card key={feature.title}>
						<FeatureGrid.CardIcon>
							<Icon />
						</FeatureGrid.CardIcon>
						<FeatureGrid.CardTitle>{feature.title}</FeatureGrid.CardTitle>
						<FeatureGrid.CardDescription>
							{feature.description}
						</FeatureGrid.CardDescription>
					</FeatureGrid.Card>
				);
			})}
		</FeatureGrid.Root>
	);
}

const values = [
	{
		icon: LightningIcon,
		title: "Responsiveness",
		description:
			"Tailored matches that fill the gaps in your delivery pipeline.",
	},
	{
		icon: PathIcon,
		title: "Simplicity",
		description:
			"From the first search to the final invoice, we handle the whole process.",
	},
];

export function BentoGridExample() {
	return (
		<BentoGrid.Root>
			<BentoGrid.FeaturedItem>
				<BentoGrid.FeaturedContent>
					<BentoGrid.FeaturedIcon>
						<HandHeartIcon />
					</BentoGrid.FeaturedIcon>
					<BentoGrid.FeaturedLabel>Our mantra</BentoGrid.FeaturedLabel>
					<BentoGrid.FeaturedTitle>CRAFT</BentoGrid.FeaturedTitle>
				</BentoGrid.FeaturedContent>
				<BentoGrid.FeaturedDescription>
					Taking care of everyone who ships great work, at every step.
				</BentoGrid.FeaturedDescription>
			</BentoGrid.FeaturedItem>
			{values.map((value, index) => {
				const Icon = value.icon;
				return (
					<BentoGrid.Item key={value.title} wide={index === values.length - 1}>
						<BentoGrid.ItemLayout>
							<BentoGrid.ItemIcon>
								<Icon />
							</BentoGrid.ItemIcon>
							<BentoGrid.ItemBody>
								<BentoGrid.ItemTitle>{value.title}</BentoGrid.ItemTitle>
								<BentoGrid.ItemDescription>
									{value.description}
								</BentoGrid.ItemDescription>
							</BentoGrid.ItemBody>
						</BentoGrid.ItemLayout>
					</BentoGrid.Item>
				);
			})}
		</BentoGrid.Root>
	);
}

const orderSteps = [
	{
		icon: EnvelopeIcon,
		title: "Send your brief",
		description: "Describe your needs: we prepare a tailored quote.",
	},
	{
		icon: FileTextIcon,
		title: "Approve the quote",
		description: "A clear, detailed offer, with no commitment, within 48 h.",
	},
	{
		icon: RocketLaunchIcon,
		title: "Kick off the project",
		description: "A vetted freelancer starts, with full progress tracking.",
	},
];

export function NumberedCardsExample() {
	return (
		<NumberedCards.Root tone="highlight">
			{orderSteps.map((step, index) => {
				const Icon = step.icon;
				return (
					<NumberedCards.Card key={step.title}>
						<NumberedCards.CardHeader>
							<NumberedCards.CardIcon>
								<Icon />
							</NumberedCards.CardIcon>
							<NumberedCards.CardLabel>
								Step {index + 1}
							</NumberedCards.CardLabel>
						</NumberedCards.CardHeader>
						<NumberedCards.CardTitle>{step.title}</NumberedCards.CardTitle>
						<NumberedCards.CardDescription>
							{step.description}
						</NumberedCards.CardDescription>
					</NumberedCards.Card>
				);
			})}
		</NumberedCards.Root>
	);
}

const withoutItems = [
	"Weeks lost sourcing candidates for one task",
	"A contractor found in a rush, never vetted",
	"No follow-up once the work is delivered",
];

const withItems = [
	"A verified freelancer ready when the project starts",
	"A complete, professional toolkit from day one",
	"Zero overhead on contracts or invoicing",
];

export function ComparisonSectionExample() {
	return (
		<ComparisonSection.Root tone="highlight" background="muted">
			<ComparisonSection.Content>
				<EyebrowParts.Root tone="highlight" className="mb-4">
					<EyebrowParts.Icon>
						<BuildingsIcon />
					</EyebrowParts.Icon>
					<EyebrowParts.Label>For client teams</EyebrowParts.Label>
				</EyebrowParts.Root>
				<HeadingComponent className="mb-8">
					Your roadmap keeps moving.{" "}
					<span className="text-highlight">Hiring shouldn't slow it.</span>
				</HeadingComponent>
				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							Traditional hiring
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{withoutItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
					<ComparisonSection.Panel variant="with">
						<ComparisonSection.PanelTitle>
							With Acme
						</ComparisonSection.PanelTitle>
						<ComparisonSection.PanelList>
							{withItems.map((item) => (
								<ComparisonSection.PanelItem key={item}>
									{item}
								</ComparisonSection.PanelItem>
							))}
						</ComparisonSection.PanelList>
					</ComparisonSection.Panel>
				</ComparisonSection.Panels>
				<ComparisonSection.TagList>
					{["Design", "Development", "Copywriting"].map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>
				<Button size="lg" variant="highlight">
					Find a freelancer <ArrowRightIcon />
				</Button>
			</ComparisonSection.Content>
			<ComparisonSection.Media>
				<IllustrationPlaceholder label="Illustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	);
}

const clientSteps = [
	{
		icon: FileTextIcon,
		title: "Post your project",
		description: "Scope, budget, timeline and the profile you're looking for.",
	},
	{
		icon: UserCheckIcon,
		title: "Select your freelancer",
		description: "Choose your expert among the profiles that applied.",
	},
	{
		icon: CheckCircleIcon,
		title: "Receive the deliverable",
		description: "Get the project report and sign off on the work.",
	},
];

const freelancerSteps = [
	{
		icon: BellIcon,
		title: "Stay in the loop",
		description:
			"Get a targeted alert and apply if the project appeals to you.",
	},
	{
		icon: TrophyIcon,
		title: "Deliver the work",
		description: "Join the adventure and do what you do best.",
	},
	{
		icon: ChartBarIcon,
		title: "Track your engagements",
		description: "Invoicing and analytics: the admin work is simplified.",
	},
];

export function StepTracksExample() {
	return (
		<StepTracks.Root>
			<StepTracks.Track tone="highlight">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<BuildingsIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>Client</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							You're staffing a project
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{clientSteps.map((step, index) => {
						const Icon = step.icon;
						return (
							<StepTracks.Step key={step.title}>
								<StepTracks.StepIcon number={index + 1}>
									<Icon />
								</StepTracks.StepIcon>
								<StepTracks.Body>
									<StepTracks.BodyTitle>{step.title}</StepTracks.BodyTitle>
									<StepTracks.BodyDescription>
										{step.description}
									</StepTracks.BodyDescription>
								</StepTracks.Body>
							</StepTracks.Step>
						);
					})}
				</StepTracks.Steps>
			</StepTracks.Track>
			<StepTracks.Track tone="brand">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<BriefcaseIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>
							Independent freelancer
						</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							You work as a freelancer
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{freelancerSteps.map((step, index) => {
						const Icon = step.icon;
						return (
							<StepTracks.Step key={step.title}>
								<StepTracks.StepIcon number={index + 1}>
									<Icon />
								</StepTracks.StepIcon>
								<StepTracks.Body>
									<StepTracks.BodyTitle>{step.title}</StepTracks.BodyTitle>
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
	);
}

const testimonials = [
	{
		quote:
			"Finding a designer for our launches used to be an obstacle course. Now we post our brief and hear back within the day.",
		name: "Head of product",
		role: "SaaS startup",
		accent: "primary",
	},
	{
		quote:
			"I work on projects that match my skills, with a clear framework. Acme helped me grow my independent practice.",
		name: "Freelance product designer",
		role: "Network member",
		accent: "highlight",
	},
] as const;

export function TestimonialGridExample() {
	return (
		<TestimonialGrid.Root>
			{testimonials.map((testimonial) => (
				<TestimonialGrid.Item key={testimonial.name}>
					<TestimonialGrid.QuoteIcon />
					<TestimonialGrid.Quote>{testimonial.quote}</TestimonialGrid.Quote>
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
	);
}

export function LogoMarqueeExample() {
	return (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Trusted by teams at</LogoMarquee.Title>
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
	);
}

export function LogoMarqueeStatic() {
	return (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Reference brands</LogoMarquee.Title>
			<LogoMarquee.StaticTrack>
				{partnerNames.map((name) => (
					<LogoMarquee.Item
						key={name}
						src={partnerLogoDataUri(name)}
						alt={name}
					/>
				))}
			</LogoMarquee.StaticTrack>
		</LogoMarquee.Root>
	);
}

export function CtaBannerExample() {
	return (
		<CtaBanner.Root>
			<CtaBanner.Title>Join the Acme adventure</CtaBanner.Title>
			<CtaBanner.Description>
				Client or freelancer: let's build better projects, together.
			</CtaBanner.Description>
			<CtaBanner.Actions>
				<Button size="lg" variant="secondary">
					I'm a client <ArrowRightIcon />
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

export function ContactCardsExample() {
	return (
		<ContactCards.Root>
			<ContactCards.Card>
				<ContactCards.CardTitle>By email</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					For any question about the platform or a partnership.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="mailto:contact@acme.dev">contact@acme.dev</a>}
				/>
			</ContactCards.Card>
			<ContactCards.Card>
				<ContactCards.CardTitle>By phone</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Monday to Friday, from 9 am to 6 pm.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="tel:+15550100100">+1 (555) 010-0100</a>}
				/>
			</ContactCards.Card>
		</ContactCards.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Blog                                                                       */
/* -------------------------------------------------------------------------- */

export function ArticleCardExample() {
	return (
		<div className="max-w-md">
			<ArticleCard.Root href="#">
				<ArticleCard.Frame>
					<ArticleCard.Image
						src={partnerLogoDataUri("Cover")}
						alt="Article cover"
					/>
					<ArticleCard.Content>
						<ArticleCard.Tags>
							<ArticleTagsParts.Tag>Remote work</ArticleTagsParts.Tag>
							<ArticleTagsParts.Tag>Product design</ArticleTagsParts.Tag>
						</ArticleCard.Tags>
						<ArticleCard.Title>
							Why every launch deserves a dedicated freelancer
						</ArticleCard.Title>
						<ArticleCard.Description>
							Every week, thousands of product launches ship without any
							dedicated design support.
						</ArticleCard.Description>
						<ArticleCard.Meta>
							<ArticleCard.MetaItems>
								<ArticleCard.MetaItem>
									<CalendarBlankIcon />
									July 12, 2026
								</ArticleCard.MetaItem>
							</ArticleCard.MetaItems>
							<ArticleCard.Arrow />
						</ArticleCard.Meta>
					</ArticleCard.Content>
				</ArticleCard.Frame>
			</ArticleCard.Root>
		</div>
	);
}

export function ArticleCardFallback() {
	return (
		<div className="max-w-md">
			<ArticleCard.Root href="#">
				<ArticleCard.Frame>
					<ArticleCard.ImageFallback />
					<ArticleCard.Content>
						<ArticleCard.Title>An article without a visual</ArticleCard.Title>
						<ArticleCard.Description>
							The card keeps the same layout, with a flat fill in place of the
							image.
						</ArticleCard.Description>
						<ArticleCard.Meta>
							<ArticleCard.MetaItems>
								<ArticleCard.MetaItem>
									<CalendarBlankIcon />
									July 12, 2026
								</ArticleCard.MetaItem>
							</ArticleCard.MetaItems>
							<ArticleCard.Arrow />
						</ArticleCard.Meta>
					</ArticleCard.Content>
				</ArticleCard.Frame>
			</ArticleCard.Root>
		</div>
	);
}

export function ArticleTags() {
	return (
		<ArticleTagsParts.Root>
			<ArticleTagsParts.Tag>Remote work</ArticleTagsParts.Tag>
			<ArticleTagsParts.Tag>Product design</ArticleTagsParts.Tag>
			<ArticleTagsParts.Tag>Freelancing</ArticleTagsParts.Tag>
		</ArticleTagsParts.Root>
	);
}

/**
 * The quick-start's 3-minute win: a complete section, composed from the
 * layout primitives and one content grid.
 */
export function QuickStartWin() {
	return (
		<SectionComponent spacing="sm" background="muted">
			<Container size="md">
				<SectionIntroParts.Root>
					<SectionIntroParts.Title>
						Why choose <span className="text-primary">Acme</span>?
					</SectionIntroParts.Title>
					<SectionIntroParts.Description>
						Two reasons are enough to get started.
					</SectionIntroParts.Description>
				</SectionIntroParts.Root>
				<FeatureGrid.Root tone="primary" columns="2" className="mt-10">
					{values.map((value) => {
						const Icon = value.icon;
						return (
							<FeatureGrid.Card key={value.title}>
								<FeatureGrid.CardIcon>
									<Icon />
								</FeatureGrid.CardIcon>
								<FeatureGrid.CardTitle>{value.title}</FeatureGrid.CardTitle>
								<FeatureGrid.CardDescription>
									{value.description}
								</FeatureGrid.CardDescription>
							</FeatureGrid.Card>
						);
					})}
				</FeatureGrid.Root>
			</Container>
		</SectionComponent>
	);
}

export function ProseArticle() {
	return (
		<ProseArticleComponent>
			<h2>Why every launch deserves a dedicated freelancer</h2>
			<p>
				Every week, thousands of product launches ship without any dedicated
				support. Yet having an <strong>independent expert</strong> alongside the
				team changes everything.
			</p>
			<blockquote>
				<p>
					Working with a dedicated freelancer through the quarter changed
					everything: fewer reworks, and the feeling of finally shipping on
					time.
				</p>
			</blockquote>
			<h3>What good delivery looks like</h3>
			<ul>
				<li>Scoping the work before the sprint</li>
				<li>Hands-on support during the build</li>
				<li>Follow-up and continuity after the launch</li>
			</ul>
		</ProseArticleComponent>
	);
}
