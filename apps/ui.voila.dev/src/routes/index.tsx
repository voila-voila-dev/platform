import {
	ArrowRightIcon,
	CheckIcon,
	CopyIcon,
	FileTsIcon,
	MagicWandIcon,
	PackageIcon,
	PuzzlePieceIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import { Input } from "@voila.dev/ui/components/input";
import { Label } from "@voila.dev/ui/components/label";
import { Switch } from "@voila.dev/ui/components/switch";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@voila.dev/ui/components/tabs";
import { Eyebrow } from "@voila.dev/ui-landing/components/eyebrow";
import { FeatureGrid } from "@voila.dev/ui-landing/components/feature-grid";
import { LandingHero } from "@voila.dev/ui-landing/components/landing-hero";
import { SectionIntro } from "@voila.dev/ui-landing/components/section-intro";
import { StatsRow } from "@voila.dev/ui-landing/components/stats-row";
import { Fragment, useState } from "react";
import { SiteHeader } from "@/components/docs/site-header";
import { Wordmark } from "@/components/docs/wordmark";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "ui.voila.dev — the component system you can actually read" },
		],
	}),
	component: Home,
});

const stats = [
	{ value: "85+", label: "Components" },
	{ value: "11", label: "Packages" },
	{ value: "1", label: "Version, lockstep" },
	{ value: "100%", label: "Shipped as source" },
];

const features = [
	{
		icon: FileTsIcon,
		title: "Ships as source",
		description:
			"Packages contain .tsx files, not dist/. Tree-shaking, source maps and stepping into a component in the debugger all just work.",
	},
	{
		icon: MagicWandIcon,
		title: "Yours to rebrand",
		description:
			"Every colour, radius and font is a CSS custom property. Override the handful you care about and the whole system follows.",
	},
	{
		icon: PuzzlePieceIcon,
		title: "Built on Base UI",
		description:
			"Accessibility, focus management and keyboard behaviour come from Base UI. The components add styling, composition and defaults.",
	},
	{
		icon: PackageIcon,
		title: "Pick what you need",
		description:
			"The core is deliberately lean. Maps, data grids, charts, filters and landing sections are separate packages you add when you use them.",
	},
];

const packages: { name: string; slug: string; blurb: string }[] = [
	{
		name: "ui",
		slug: "/ui/quick-start",
		blurb: "The core: ~85 components, from Button to Sidebar.",
	},
	{
		name: "ui-tokens",
		slug: "/ui-tokens/quick-start",
		blurb: "The design tokens, as plain CSS custom properties.",
	},
	{
		name: "ui-chart",
		slug: "/ui-chart/quick-start",
		blurb: "Composable SVG charts, no charting library underneath.",
	},
	{
		name: "ui-spreadsheet",
		slug: "/ui-spreadsheet/quick-start",
		blurb: "A virtualized, keyboard-driven editable table.",
	},
	{
		name: "ui-datatable",
		slug: "/ui-datatable/quick-start",
		blurb: "DataTable with sorting, selection and pagination.",
	},
	{
		name: "ui-map",
		slug: "/ui-map/quick-start",
		blurb: "A lazy-loaded MapLibre GL map view.",
	},
	{
		name: "ui-filter",
		slug: "/ui-filter/quick-start",
		blurb: "A filter toolbar and pager for list pages.",
	},
	{
		name: "ui-icon",
		slug: "/ui-icon/quick-start",
		blurb: "The icon registry behind pickers and dynamic icons.",
	},
	{
		name: "ui-landing",
		slug: "/ui-landing/quick-start",
		blurb: "Marketing sections: heroes, grids, testimonials, footers.",
	},
	{
		name: "ui-email-block-editor",
		slug: "/ui-email-block-editor/quick-start",
		blurb: "A drag-and-drop block editor for marketing emails.",
	},
];

function InstallSnippet() {
	const command = "bun add @voila.dev/ui @voila.dev/ui-tokens";
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			aria-label="Copy install command"
			onClick={() => {
				navigator.clipboard?.writeText(command).then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				});
			}}
			className="group mx-auto flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
		>
			<span aria-hidden className="select-none text-primary/60">
				$
			</span>
			{command}
			{copied ? (
				<CheckIcon aria-hidden className="size-4 text-primary" />
			) : (
				<CopyIcon
					aria-hidden
					className="size-4 opacity-40 transition-opacity group-hover:opacity-100"
				/>
			)}
		</button>
	);
}

/** Real components from the library, not screenshots. */
function LiveDemo() {
	const [notifications, setNotifications] = useState(true);
	return (
		<div className="preview mx-auto max-w-3xl text-left">
			<p className="preview__label">Live — rendered by the library itself</p>
			<Tabs defaultValue="buttons">
				<TabsList>
					<TabsTrigger value="buttons">Buttons</TabsTrigger>
					<TabsTrigger value="badges">Badges</TabsTrigger>
					<TabsTrigger value="form">Form</TabsTrigger>
				</TabsList>
				<TabsContent value="buttons" className="pt-4">
					<div className="flex flex-wrap items-center gap-3">
						<Button>Default</Button>
						<Button variant="secondary">Secondary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="ghost">Ghost</Button>
						<Button variant="destructive">Destructive</Button>
						<Button loading>Saving…</Button>
					</div>
				</TabsContent>
				<TabsContent value="badges" className="pt-4">
					<div className="flex flex-wrap items-center gap-2">
						<Badge>Default</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="outline">Outline</Badge>
						<Badge variant="destructive">Destructive</Badge>
					</div>
				</TabsContent>
				<TabsContent value="form" className="pt-4">
					<div className="grid max-w-sm gap-4">
						<div className="grid gap-2">
							<Label htmlFor="home-demo-email">Email</Label>
							<Input
								id="home-demo-email"
								type="email"
								placeholder="ada@example.com"
							/>
						</div>
						<div className="flex items-center gap-3">
							<Switch
								id="home-demo-notifications"
								checked={notifications}
								onCheckedChange={setNotifications}
							/>
							<Label htmlFor="home-demo-notifications">
								Email me about releases
							</Label>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

function Home() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<SiteHeader />
			<main>
				<LandingHero.Root layout="centered" background="gradient-primary">
					<LandingHero.Content className="text-center">
						<Eyebrow.Root tone="primary" className="mx-auto mb-6">
							<Eyebrow.Dot pulse />
							<Eyebrow.Label>
								Source-shipped · React 19 · Tailwind 4
							</Eyebrow.Label>
						</Eyebrow.Root>
						<LandingHero.Title>
							The component system you can{" "}
							<LandingHero.Highlight tone="primary">
								actually read
							</LandingHero.Highlight>
						</LandingHero.Title>
						<LandingHero.Lead className="mx-auto">
							No build step, no compiled bundle, no black box — you get the .tsx
							files and your bundler does the rest. Cmd+click any component and
							land in the code that renders it.
						</LandingHero.Lead>
						<LandingHero.Actions className="justify-center">
							<Button
								size="lg"
								nativeButton={false}
								render={<Link to={"/start/introduction" as string} />}
							>
								Get started <ArrowRightIcon />
							</Button>
							<Button
								size="lg"
								variant="outline"
								nativeButton={false}
								render={
									// biome-ignore lint/a11y/useAnchorContent: Button injects the label as children.
									<a href="https://storybook.ui.voila.dev" />
								}
							>
								Browse the Storybook
							</Button>
						</LandingHero.Actions>
						<div className="mt-8">
							<InstallSnippet />
						</div>
						<StatsRow.Root className="mt-12 justify-center">
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
				</LandingHero.Root>

				<section className="px-6 pb-20">
					<LiveDemo />
				</section>

				<section className="border-t border-border bg-muted/30 px-6 py-20">
					<SectionIntro.Root>
						<SectionIntro.Title>Why source, not a bundle</SectionIntro.Title>
						<SectionIntro.Description>
							A compiled component library is a wall: you can style around it,
							but you cannot see what it does, and the day you need a variant it
							does not have, you are stuck. Shipping source removes the wall.
						</SectionIntro.Description>
					</SectionIntro.Root>
					<div className="mx-auto mt-10 max-w-5xl">
						<FeatureGrid.Root tone="primary" columns="2">
							{features.map((feature) => {
								const Icon = feature.icon;
								return (
									<FeatureGrid.Card key={feature.title}>
										<FeatureGrid.CardIcon>
											<Icon />
										</FeatureGrid.CardIcon>
										<FeatureGrid.CardTitle>
											{feature.title}
										</FeatureGrid.CardTitle>
										<FeatureGrid.CardDescription>
											{feature.description}
										</FeatureGrid.CardDescription>
									</FeatureGrid.Card>
								);
							})}
						</FeatureGrid.Root>
					</div>
				</section>

				<section className="px-6 py-20">
					<SectionIntro.Root>
						<SectionIntro.Title>The packages</SectionIntro.Title>
						<SectionIntro.Description>
							All published in lockstep at one version, so cross-package
							versions always line up.
						</SectionIntro.Description>
					</SectionIntro.Root>
					<div className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{packages.map((pkg) => (
							<Link
								key={pkg.name}
								to={pkg.slug}
								className="group rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
							>
								<p className="font-mono text-sm font-semibold text-foreground">
									@voila.dev/{pkg.name}
								</p>
								<p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
									{pkg.blurb}
								</p>
								<p className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100 dark:text-primary-foreground">
									Read the docs <ArrowRightIcon aria-hidden />
								</p>
							</Link>
						))}
					</div>
				</section>

				<section className="px-6 pb-20">
					{/* Quiet CTA on the site's own surfaces — the stock ui-landing
					    brand gradient shouts too loudly against this page. */}
					<div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-border bg-card px-6 py-14 text-center sm:px-12">
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 bg-[radial-gradient(36rem_16rem_at_50%_-4rem,color-mix(in_oklab,var(--primary)_14%,transparent),transparent)] dark:bg-[radial-gradient(36rem_16rem_at_50%_-4rem,color-mix(in_oklab,var(--primary)_30%,transparent),transparent)]"
						/>
						<div className="relative mx-auto max-w-2xl">
							<h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">
								Read the code, then keep it
							</h2>
							<p className="mt-3 text-muted-foreground">
								Install the packages, copy the tokens, and every component is
								yours to open, step through and rebrand.
							</p>
							<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
								<Button
									size="lg"
									nativeButton={false}
									render={<Link to={"/start/installation" as string} />}
								>
									Install in two minutes
								</Button>
								<Button
									size="lg"
									variant="outline"
									nativeButton={false}
									render={
										// biome-ignore lint/a11y/useAnchorContent: Button injects the label as children.
										<a href="https://github.com/voila-voila-dev/ui" />
									}
								>
									Star it on GitHub
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>

			<footer className="border-t border-border px-6 py-10">
				<div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
					<Wordmark />
					<p className="text-sm text-muted-foreground">
						MIT — built with its own components.
					</p>
				</div>
			</footer>
		</div>
	);
}
