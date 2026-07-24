import {
	ArrowRightIcon,
	BellIcon,
	BuildingsIcon,
	CalendarBlankIcon,
	ChartBarIcon,
	CurrencyEurIcon,
	EnvelopeIcon,
	EnvelopeSimpleIcon,
	FileTextIcon,
	HandHeartIcon,
	HeartbeatIcon,
	LightningIcon,
	LinkedinLogoIcon,
	PackageIcon,
	PathIcon,
	StethoscopeIcon,
	TrophyIcon,
	TruckIcon,
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

const partnerNames = ["AS Vitré", "CJF Fleury", "FC Nantes", "RC Vannes"];

function IllustrationPlaceholder({ label }: { label: string }) {
	return (
		<div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-border border-dashed bg-muted/50">
			<span className="text-muted-foreground text-sm">{label}</span>
		</div>
	);
}

const stats = [
	{ value: "20K+", label: "Membres engagés" },
	{ value: "2000+", label: "Professionnels référencés" },
	{ value: "700+", label: "Prestations effectuées" },
];

const mainNavigation = [
	{ title: "Comment ça marche ?", href: "#how-it-works" },
	{ title: "Pour les clubs", href: "#club-benefits" },
	{ title: "Pour les pros", href: "#health-pro-benefits" },
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
				Trouvez un <span className="text-provider">pro de santé</span> pour vos{" "}
				<span className="text-organization">événements sportifs</span>
			</HeadingComponent>
			<HeadingComponent level="h3">
				Deux parcours, une rencontre
			</HeadingComponent>
		</div>
	);
}

export function Text() {
	return (
		<div className="space-y-4">
			<TextComponent variant="lead">
				La plateforme qui met en relation clubs de sport et professionnels de
				santé.
			</TextComponent>
			<TextComponent variant="muted">
				Construisons ensemble un sport amateur mieux accompagné.
			</TextComponent>
		</div>
	);
}

export function Eyebrow() {
	return (
		<div className="flex flex-wrap gap-4">
			<EyebrowParts.Root tone="provider">
				<EyebrowParts.Dot pulse />
				<EyebrowParts.Label>Nouvelle plateforme</EyebrowParts.Label>
			</EyebrowParts.Root>
			<EyebrowParts.Root tone="organization">
				<EyebrowParts.Icon>
					<BuildingsIcon />
				</EyebrowParts.Icon>
				<EyebrowParts.Label>Pour les clubs de sport</EyebrowParts.Label>
			</EyebrowParts.Root>
		</div>
	);
}

export function SectionIntro() {
	return (
		<SectionIntroParts.Root>
			<EyebrowParts.Root tone="primary" className="mb-4">
				<EyebrowParts.Label>Comment ça marche ?</EyebrowParts.Label>
			</EyebrowParts.Root>
			<SectionIntroParts.Title>
				Deux parcours, une <span className="text-primary">rencontre</span>
			</SectionIntroParts.Title>
			<SectionIntroParts.Description>
				Staffez votre événement côté club, trouvez vos missions côté
				professionnel de santé : trois étapes suffisent.
			</SectionIntroParts.Description>
		</SectionIntroParts.Root>
	);
}

export function PageHeaderExample() {
	return (
		<PageHeader.Root>
			<PageHeader.Title>Contact</PageHeader.Title>
			<PageHeader.Lead>
				Une question, un besoin, une idée ? Écrivez-nous, on vous répond
				rapidement.
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
						<Button variant="organization" className="w-full">
							Je suis un club
						</Button>
					</SiteHeader.MobileActions>
				</SiteHeader.MobileMenu>
			</SiteHeader.Root>
			<div className="p-6 text-muted-foreground text-sm">
				L'en-tête reste collé en haut, avec un flou d'arrière-plan.
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
						Clubs de sport et professionnels de santé, réunis autour des mêmes
						événements.
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
					<SiteFooter.ColumnTitle>Plateforme</SiteFooter.ColumnTitle>
					<SiteFooter.ColumnList>
						<SiteFooter.ColumnLink href="#">
							Comment ça marche ?
						</SiteFooter.ColumnLink>
						<SiteFooter.ColumnLink href="#">
							Pour les clubs
						</SiteFooter.ColumnLink>
					</SiteFooter.ColumnList>
				</SiteFooter.Column>
				<SiteFooter.Column>
					<SiteFooter.ColumnTitle>Légal</SiteFooter.ColumnTitle>
					<SiteFooter.ColumnList>
						<SiteFooter.ColumnLink href="#">
							Mentions légales
						</SiteFooter.ColumnLink>
						<SiteFooter.ColumnLink href="#">CGU</SiteFooter.ColumnLink>
					</SiteFooter.ColumnList>
				</SiteFooter.Column>
			</SiteFooter.Columns>
			<SiteFooter.Bottom>
				<SiteFooter.BottomText>
					© 2026 acme.dev. Tous droits réservés.
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
				<EyebrowParts.Root tone="provider" className="mb-6">
					<EyebrowParts.Dot pulse />
					<EyebrowParts.Label>Nouvelle plateforme</EyebrowParts.Label>
				</EyebrowParts.Root>
				<LandingHero.Title>
					Trouvez un{" "}
					<LandingHero.Highlight tone="provider">
						pro de santé
					</LandingHero.Highlight>{" "}
					pour vos{" "}
					<LandingHero.Highlight tone="organization">
						événements sportifs
					</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead>
					La plateforme qui met en relation clubs de sport et professionnels de
					santé.
				</LandingHero.Lead>
				<LandingHero.Actions>
					<Button size="lg" variant="organization">
						<BuildingsIcon /> Je suis un club
					</Button>
					<Button size="lg" variant="provider">
						<StethoscopeIcon /> Je suis professionnel de santé
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
					Rejoignez le{" "}
					<LandingHero.Highlight tone="primary">
						mouvement
					</LandingHero.Highlight>
				</LandingHero.Title>
				<LandingHero.Lead className="mx-auto">
					Club ou professionnel de santé, il y a une place pour vous.
				</LandingHero.Lead>
				<LandingHero.Actions className="justify-center">
					<Button size="lg" variant="primary">
						Commencer
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
		icon: CurrencyEurIcon,
		title: "Des prix pharmacie élevés",
		description:
			"Le matériel acheté à l'unité grève le budget des clubs amateurs.",
	},
	{
		icon: PackageIcon,
		title: "Des trousses incomplètes",
		description: "Il manque toujours l'essentiel au moment où on en a besoin.",
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
		title: "Réactivité",
		description:
			"Des offres sur-mesure pour combler les manques du suivi médical sportif.",
	},
	{
		icon: PathIcon,
		title: "Simplicité",
		description:
			"De la recherche à la facturation, nous gérons tout le processus.",
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
					<BentoGrid.FeaturedLabel>Notre mantra</BentoGrid.FeaturedLabel>
					<BentoGrid.FeaturedTitle>CARE</BentoGrid.FeaturedTitle>
				</BentoGrid.FeaturedContent>
				<BentoGrid.FeaturedDescription>
					Prendre soin de l'ensemble des acteurs du sport, à chaque étape.
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
		title: "Envoyez votre demande",
		description: "Décrivez vos besoins : nous préparons un devis adapté.",
	},
	{
		icon: FileTextIcon,
		title: "Validez le devis",
		description: "Une offre claire et détaillée, sans engagement, sous 48 h.",
	},
	{
		icon: TruckIcon,
		title: "Recevez votre matériel",
		description: "Livraison directe au club, avec un suivi complet.",
	},
];

export function NumberedCardsExample() {
	return (
		<NumberedCards.Root tone="organization">
			{orderSteps.map((step, index) => {
				const Icon = step.icon;
				return (
					<NumberedCards.Card key={step.title}>
						<NumberedCards.CardHeader>
							<NumberedCards.CardIcon>
								<Icon />
							</NumberedCards.CardIcon>
							<NumberedCards.CardLabel>
								Étape {index + 1}
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
	"Départ sans staff médical, trop cher à déplacer",
	"Un professionnel cherché en urgence, sur place",
	"Aucun suivi médical après le match",
];

const withItems = [
	"Un professionnel vérifié vous attend sur le lieu du match",
	"Matériel professionnel complet sur place",
	"Zéro frais de transport ou d'hébergement",
];

export function ComparisonSectionExample() {
	return (
		<ComparisonSection.Root tone="organization" background="muted">
			<ComparisonSection.Content>
				<EyebrowParts.Root tone="organization" className="mb-4">
					<EyebrowParts.Icon>
						<BuildingsIcon />
					</EyebrowParts.Icon>
					<EyebrowParts.Label>Pour les clubs de sport</EyebrowParts.Label>
				</EyebrowParts.Root>
				<HeadingComponent className="mb-8">
					Vos sportifs se déplacent.{" "}
					<span className="text-organization">Pas votre staff médical.</span>
				</HeadingComponent>
				<ComparisonSection.Panels>
					<ComparisonSection.Panel variant="without">
						<ComparisonSection.PanelTitle>
							Déplacement classique
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
							Avec Acme
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
					{["Football", "Rugby", "Basketball"].map((tag) => (
						<ComparisonSection.Tag key={tag}>{tag}</ComparisonSection.Tag>
					))}
				</ComparisonSection.TagList>
				<Button size="lg" variant="organization">
					Trouver un professionnel <ArrowRightIcon />
				</Button>
			</ComparisonSection.Content>
			<ComparisonSection.Media>
				<IllustrationPlaceholder label="Illustration (app-side)" />
			</ComparisonSection.Media>
		</ComparisonSection.Root>
	);
}

const clubSteps = [
	{
		icon: FileTextIcon,
		title: "Publiez votre annonce",
		description: "Date, lieu, horaires et type de professionnel recherché.",
	},
	{
		icon: UserCheckIcon,
		title: "Sélectionnez votre professionnel",
		description: "Choisissez votre praticien parmi les profils intéressés.",
	},
	{
		icon: HeartbeatIcon,
		title: "Profitez du suivi médical",
		description: "Recevez la liste des interventions réalisées.",
	},
];

const proSteps = [
	{
		icon: BellIcon,
		title: "Restez informé",
		description:
			"Recevez une alerte ciblée et postulez si la mission vous plaît.",
	},
	{
		icon: TrophyIcon,
		title: "Réalisez votre intervention",
		description: "Participez à l'aventure et profitez du terrain.",
	},
	{
		icon: ChartBarIcon,
		title: "Suivez vos prestations",
		description: "Facturation et analytics : l'administratif est simplifié.",
	},
];

export function StepTracksExample() {
	return (
		<StepTracks.Root>
			<StepTracks.Track tone="organization">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<BuildingsIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>Club</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							Vous organisez un événement sportif
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{clubSteps.map((step, index) => {
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
			<StepTracks.Track tone="provider">
				<StepTracks.Header>
					<StepTracks.HeaderIcon>
						<StethoscopeIcon />
					</StepTracks.HeaderIcon>
					<StepTracks.HeaderText>
						<StepTracks.HeaderTitle>
							Professionnel de santé
						</StepTracks.HeaderTitle>
						<StepTracks.HeaderSubtitle>
							Vous êtes professionnel de santé
						</StepTracks.HeaderSubtitle>
					</StepTracks.HeaderText>
				</StepTracks.Header>
				<StepTracks.Steps>
					{proSteps.map((step, index) => {
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
			"Trouver un kiné pour nos matchs relevait du parcours du combattant. Aujourd'hui, on publie notre besoin et on est rappelés dans la journée.",
		name: "Responsable de club",
		role: "Football amateur",
		accent: "primary",
	},
	{
		quote:
			"J'interviens sur des événements près de chez moi, avec un cadre clair. Acme m'a permis de développer mon activité dans le sport.",
		name: "Kinésithérapeute du sport",
		role: "Membre du réseau",
		accent: "orange",
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
	);
}

export function LogoMarqueeStatic() {
	return (
		<LogoMarquee.Root>
			<LogoMarquee.Title>Des marques de référence</LogoMarquee.Title>
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
			<CtaBanner.Title>Rejoignez l'aventure Acme</CtaBanner.Title>
			<CtaBanner.Description>
				Club ou professionnel de santé : construisons ensemble un sport amateur
				mieux accompagné.
			</CtaBanner.Description>
			<CtaBanner.Actions>
				<Button size="lg" variant="secondary">
					Je suis un club <ArrowRightIcon />
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

export function ContactCardsExample() {
	return (
		<ContactCards.Root>
			<ContactCards.Card>
				<ContactCards.CardTitle>Par email</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Pour toute question sur la plateforme ou un partenariat.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="mailto:contact@acme.dev">contact@acme.dev</a>}
				/>
			</ContactCards.Card>
			<ContactCards.Card>
				<ContactCards.CardTitle>Par téléphone</ContactCards.CardTitle>
				<ContactCards.CardDescription>
					Du lundi au vendredi, de 9h à 18h.
				</ContactCards.CardDescription>
				<Button
					variant="outline"
					render={<a href="tel:+33647672472">+33 6 47 67 24 72</a>}
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
						src={partnerLogoDataUri("Couverture")}
						alt="Couverture de l'article"
					/>
					<ArticleCard.Content>
						<ArticleCard.Tags>
							<ArticleTagsParts.Tag>Prévention</ArticleTagsParts.Tag>
							<ArticleTagsParts.Tag>Kiné du sport</ArticleTagsParts.Tag>
						</ArticleCard.Tags>
						<ArticleCard.Title>
							Pourquoi médicaliser les événements sportifs amateurs ?
						</ArticleCard.Title>
						<ArticleCard.Description>
							Chaque week-end, des milliers de matchs amateurs se jouent sans
							aucun encadrement médical.
						</ArticleCard.Description>
						<ArticleCard.Meta>
							<ArticleCard.MetaItems>
								<ArticleCard.MetaItem>
									<CalendarBlankIcon />
									12 juillet 2026
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
						<ArticleCard.Title>Un article sans visuel</ArticleCard.Title>
						<ArticleCard.Description>
							La carte garde le même gabarit, avec un aplat à la place de
							l'image.
						</ArticleCard.Description>
						<ArticleCard.Meta>
							<ArticleCard.MetaItems>
								<ArticleCard.MetaItem>
									<CalendarBlankIcon />
									12 juillet 2026
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
			<ArticleTagsParts.Tag>Prévention</ArticleTagsParts.Tag>
			<ArticleTagsParts.Tag>Kiné du sport</ArticleTagsParts.Tag>
			<ArticleTagsParts.Tag>Terrain</ArticleTagsParts.Tag>
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
						Pourquoi choisir <span className="text-primary">Acme</span> ?
					</SectionIntroParts.Title>
					<SectionIntroParts.Description>
						Deux raisons suffisent pour commencer.
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
			<h2>Pourquoi médicaliser les événements sportifs amateurs ?</h2>
			<p>
				Chaque week-end, des milliers de matchs amateurs se jouent sans aucun
				encadrement médical. Pourtant, la présence d'un{" "}
				<strong>professionnel de santé</strong> au bord du terrain change tout.
			</p>
			<blockquote>
				<p>
					Être suivi par un pro pendant la saison a tout changé : moins de
					blessures, et le sentiment d'être enfin pris au sérieux.
				</p>
			</blockquote>
			<h3>Ce que dit la réglementation</h3>
			<ul>
				<li>Prévention des blessures avant l'effort</li>
				<li>Prise en charge immédiate sur le terrain</li>
				<li>Suivi et continuité médicale après l'événement</li>
			</ul>
		</ProseArticleComponent>
	);
}
