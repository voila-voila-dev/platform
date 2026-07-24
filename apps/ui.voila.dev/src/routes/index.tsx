import {
	ArrowDownIcon,
	ArrowRightIcon,
	CheckIcon,
	CopyIcon,
	FileTsIcon,
	MagicWandIcon,
	PackageIcon,
	PuzzlePieceIcon,
	RobotIcon,
	StackIcon,
	SwatchesIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import { Input } from "@voila.dev/ui/components/input";
import { Label } from "@voila.dev/ui/components/label";
import { Skeleton } from "@voila.dev/ui/components/skeleton";
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
import { GlobeView } from "@voila.dev/ui-map/components/globe-view";
import {
	Fragment,
	lazy,
	type ReactNode,
	Suspense,
	useEffect,
	useRef,
	useState,
} from "react";
import { SiteHeader } from "@/components/docs/site-header";
import { Wordmark } from "@/components/docs/wordmark";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Build your SaaS with AI — on components you actually own." },
		],
	}),
	component: Home,
});

// The editor pulls in dnd-kit, so its chunk only downloads once the section
// scrolls into view (see DeferredMount below).
const EmailEditorDemo = lazy(
	() => import("@/components/home/email-editor-demo"),
);

const stats = [
	{ value: "85+", label: "Components" },
	{ value: "11", label: "Packages" },
	{ value: "1", label: "Lockstep version" },
	{ value: "0", label: "Build steps" },
];

const featureCards = [
	{
		icon: PuzzlePieceIcon,
		title: "Built on Base UI",
		description:
			"Accessibility, focus management and keyboard behaviour come from Base UI. The components add styling, composition and defaults.",
	},
	{
		icon: MagicWandIcon,
		title: "Yours to rebrand",
		description:
			"Every colour, radius and font is a CSS custom property. Override the handful you care about and the whole system follows.",
	},
];

const aiCards = [
	{
		icon: RobotIcon,
		title: "Readable by agents",
		description:
			"The source sits in node_modules as .tsx. Cmd+click and your model both land on real code, so “make the checkout use our brand” actually works.",
	},
	{
		icon: StackIcon,
		title: "Predictable to generate against",
		description:
			"One convention across 85 components: Base UI underneath, cva variants on top. What the model learns from one file holds for all of them.",
	},
	{
		icon: SwatchesIcon,
		title: "Tokens as the contract",
		description:
			"Tell the AI to use --primary and the whole system follows. The tokens are plain CSS custom properties, not a theming API to hallucinate around.",
	},
];

/**
 * The packages grid, ordered by wow-factor; blurbs are the canonical taglines
 * from docs/writing-component-pages.md — change them there first.
 */
const packages: { name: string; slug: string; blurb: string }[] = [
	{
		name: "ui-email-block-editor",
		slug: "/ui-email-block-editor/quick-start",
		blurb:
			"The email template editor that lives in your app, not someone else's SaaS.",
	},
	{
		name: "ui-spreadsheet",
		slug: "/ui-spreadsheet/quick-start",
		blurb:
			"An editable, virtualized grid your users will mistake for a native app.",
	},
	{
		name: "ui-datatable",
		slug: "/ui-datatable/quick-start",
		blurb:
			"Sorting, pinning, CSV export — the table you keep rebuilding, finished.",
	},
	{
		name: "ui-chart",
		slug: "/ui-chart/quick-start",
		blurb:
			"Charts with zero charting library. SVG you can read, scales included.",
	},
	{
		name: "ui-map",
		slug: "/ui-map/quick-start",
		blurb: "Maps and a globe on free vector tiles. No API key, no bundle tax.",
	},
	{
		name: "ui-filter",
		slug: "/ui-filter/quick-start",
		blurb:
			"Composable filters that survive real product requirements — including geo.",
	},
	{
		name: "ui-landing",
		slug: "/ui-landing/quick-start",
		blurb: "Your marketing site, from the same system as your product.",
	},
	{
		name: "ui-icon",
		slug: "/ui-icon/quick-start",
		blurb: "Icons by name, safe by default — store a string, render an icon.",
	},
	{
		name: "ui-tokens",
		slug: "/ui-tokens/quick-start",
		blurb: "Your whole brand in one CSS file. Change it, everything follows.",
	},
	{
		name: "ui",
		slug: "/ui/quick-start",
		blurb:
			"…and the 85 components underneath it all. One convention, the floor everything else stands on.",
	},
];

const globeMarkers = [
	{ lngLat: [-122.4194, 37.7749] as const, pulse: true },
	{ lngLat: [2.3522, 48.8566] as const, pulse: true },
	{ lngLat: [139.6917, 35.6895] as const },
	{ lngLat: [-46.6333, -23.5505] as const, pulse: true },
	{ lngLat: [151.2093, -33.8688] as const },
	{ lngLat: [36.8219, -1.2921] as const },
];

function InstallSnippet({ command }: { command: string }) {
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

/**
 * Renders children only once the wrapper scrolls near the viewport, so the
 * heavy sections (the editor's dnd-kit chunk, the globe's MapLibre runtime)
 * never load for a visitor who stays above the fold.
 */
function DeferredMount({
	children,
	placeholder,
	className,
}: {
	children: ReactNode;
	placeholder?: ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const node = ref.current;
		if (node === null || visible) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "400px" },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [visible]);
	return (
		<div ref={ref} className={className}>
			{visible ? children : placeholder}
		</div>
	);
}

function EditorPlaceholder() {
	return (
		<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
			<Skeleton className="h-[32rem] w-full rounded-lg" />
			<Skeleton className="hidden h-[32rem] w-full rounded-lg lg:block" />
		</div>
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
								Source-shipped · React 19 · Tailwind 4 · AI-ready
							</Eyebrow.Label>
						</Eyebrow.Root>
						<LandingHero.Title>
							Build your SaaS with AI — on components you{" "}
							<LandingHero.Highlight tone="primary">
								actually own
							</LandingHero.Highlight>
						</LandingHero.Title>
						<LandingHero.Lead className="mx-auto">
							Every component ships as readable .tsx — install it as a
							dependency or copy it into your repo. Your bundler compiles it,
							your agent can read it, your brand can keep it.
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
									<a href="#email-editor" />
								}
							>
								Open the email editor <ArrowDownIcon />
							</Button>
						</LandingHero.Actions>
						<div className="mt-8">
							<InstallSnippet command="bun add @voila.dev/ui @voila.dev/ui-tokens" />
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

				<section id="email-editor" className="scroll-mt-16 px-6 py-20">
					<SectionIntro.Root>
						<SectionIntro.Title>
							An email editor. On your page. In your codebase.
						</SectionIntro.Title>
						<SectionIntro.Description>
							Stop paying rent for your own email templates. Drop the block
							editor into your app, let your users design emails, render the
							same document server-side. This one is live — drag something.
						</SectionIntro.Description>
					</SectionIntro.Root>
					<div className="mx-auto mt-10 max-w-5xl">
						<div className="preview text-left">
							<p className="preview__label">
								Live — this is the real component
							</p>
							<DeferredMount placeholder={<EditorPlaceholder />}>
								<Suspense fallback={<EditorPlaceholder />}>
									<EmailEditorDemo />
								</Suspense>
							</DeferredMount>
						</div>
						<div className="mt-6">
							<InstallSnippet command="bun add @voila.dev/ui-email-block-editor" />
						</div>
					</div>
				</section>

				<section className="border-t border-border px-6 py-20">
					<SectionIntro.Root>
						<SectionIntro.Title>Yes, even the globe.</SectionIntro.Title>
						<SectionIntro.Description>
							Maps and a 3D globe on free, key-less vector tiles. Lazy-loaded so
							your bundle never pays for it until it's on screen.
						</SectionIntro.Description>
					</SectionIntro.Root>
					<div className="mx-auto mt-10 max-w-4xl">
						<DeferredMount
							placeholder={
								<Skeleton className="mx-auto aspect-square w-full max-w-xl rounded-full" />
							}
						>
							<GlobeView
								spin={3}
								markers={globeMarkers}
								className="h-[32rem]"
								options={{ cooperativeGestures: true }}
							/>
						</DeferredMount>
					</div>
				</section>

				<section className="border-t border-border bg-muted/30 px-6 py-20">
					<SectionIntro.Root>
						<SectionIntro.Title>Own it, both ways</SectionIntro.Title>
						<SectionIntro.Description>
							Most kits make you choose on day one. Here it's the same source
							either way.
						</SectionIntro.Description>
					</SectionIntro.Root>
					<div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-2">
						<div className="rounded-2xl border border-primary/30 bg-card p-8">
							<PackageIcon aria-hidden className="mb-4 size-6 text-primary" />
							<h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
								As a dependency
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								One <span className="font-mono">bun add</span>, lockstep updates
								across 11 packages, your bundler compiles the source. The mode
								that scales: ship two, three, five products on the same
								components — one version bump updates every app, instead of
								maintaining N pasted copies of every button, table and email
								block.
							</p>
						</div>
						<div className="rounded-2xl border border-border bg-card p-8">
							<FileTsIcon aria-hidden className="mb-4 size-6 text-primary" />
							<h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
								As your code
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
								Copy any .tsx out of node_modules into your repo. Same file,
								zero ceremony — no CLI to run, no generated files to babysit, no
								registry to sync. Your package manager already is the registry.
							</p>
						</div>
					</div>
					<p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
						Copy-paste kits feel free until your second SaaS. Then every
						component is a fork you maintain everywhere it's pasted.
					</p>
					<div className="mx-auto mt-10 max-w-5xl">
						<FeatureGrid.Root tone="primary" columns="2">
							{featureCards.map((feature) => {
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
						<SectionIntro.Title>Built for the AI workflow</SectionIntro.Title>
						<SectionIntro.Description>
							A compiled bundle is a wall. Source is a door — for you and for
							the model doing the typing.
						</SectionIntro.Description>
					</SectionIntro.Root>
					<div className="mx-auto mt-10 max-w-5xl">
						<FeatureGrid.Root tone="primary" columns="3">
							{aiCards.map((card) => {
								const Icon = card.icon;
								return (
									<FeatureGrid.Card key={card.title} variant="outline">
										<FeatureGrid.CardIcon>
											<Icon />
										</FeatureGrid.CardIcon>
										<FeatureGrid.CardTitle>{card.title}</FeatureGrid.CardTitle>
										<FeatureGrid.CardDescription>
											{card.description}
										</FeatureGrid.CardDescription>
									</FeatureGrid.Card>
								);
							})}
						</FeatureGrid.Root>
					</div>
				</section>

				<section className="border-t border-border bg-muted/30 px-6 py-20">
					<SectionIntro.Root>
						<SectionIntro.Title>Beyond primitives</SectionIntro.Title>
						<SectionIntro.Description>
							Buttons and dialogs are table stakes. These are the product-level
							surfaces a SaaS actually needs — published in lockstep at one
							version.
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
								<p className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
									Read the docs <ArrowRightIcon aria-hidden />
								</p>
							</Link>
						))}
					</div>
				</section>

				<section className="px-6 py-20">
					<LiveDemo />
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
