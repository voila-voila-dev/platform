import { cn } from "@voila.dev/ui/lib/utils";

/**
 * Shared fixtures for the Landing stories: marketing copy for Acme (clients
 * post projects, independent freelancers deliver them) so the stories read
 * like the real site, plus placeholder assets for app-owned images (logos,
 * illustrations).
 */

export function BrandLogo({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"font-heading text-xl font-bold tracking-tight text-primary",
				className,
			)}
		>
			acme.dev
		</span>
	);
}

export function partnerLogoDataUri(name: string): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><rect width="160" height="48" rx="8" fill="#e2e8f0"/><text x="80" y="30" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569" text-anchor="middle">${name}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const partnerNames = [
	"Northwind",
	"Lumon Labs",
	"Brightloop",
	"Fjord & Co",
	"Hexlab",
	"Marigold",
];

/** Stand-in for the app-owned hero/dashboard illustrations. */
export function IllustrationPlaceholder({ label }: { label: string }) {
	return (
		<div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-dashed border-border bg-muted/50">
			<span className="text-sm text-muted-foreground">{label}</span>
		</div>
	);
}

export const heroCopy = {
	badge: "New platform",
	titleStart: "Find a",
	titleHighlight: "trusted freelancer",
	titleMiddle: "for your",
	titleHighlightEnd: "next projects",
	titleEnd: "right from our app",
	description:
		"The platform that connects client teams with independent freelancers to scope, staff and deliver projects wherever the work happens.",
	ctaClient: "I'm a client",
	ctaFreelancer: "I'm a freelancer",
	stats: [
		{ value: "20K+", label: "Active members" },
		{ value: "2000+", label: "Vetted freelancers" },
		{ value: "700+", label: "Projects delivered" },
	],
};

export const performerTrack = {
	label: "Client",
	subtitle: "You have a project to deliver",
	steps: [
		{
			title: "Post your project",
			description: (
				<>
					Create a detailed brief for your need -{" "}
					<strong>brand refresh, web app, launch campaign, audit</strong>:
					scope, timeline, budget and the type of expert you're after.
				</>
			),
		},
		{
			title: "Pick your freelancer",
			description: (
				<>
					Thanks to tailored <strong>smart matching</strong>, choose your expert
					among the profiles that applied.
				</>
			),
		},
		{
			title: "Enjoy the follow-through",
			description: (
				<>
					Receive a report of the work delivered and keep{" "}
					<strong>full continuity</strong> across your projects.
				</>
			),
		},
	],
};

export const helperTrack = {
	label: "Freelancer",
	subtitle: "You work as an independent expert",
	steps: [
		{
			title: "Stay in the loop",
			description: (
				<>
					Get a targeted alert, review the project details and{" "}
					<strong>apply</strong> if it fits.
				</>
			),
		},
		{
			title: "Deliver the work",
			description: (
				<>
					<strong>Join</strong> the project and focus on the craft you do best.
				</>
			),
		},
		{
			title: "Track your engagements",
			description: (
				<>
					Invoicing, analytics and much more: we{" "}
					<strong>take care of the entire admin side</strong>.
				</>
			),
		},
	],
};

export const clientBenefits = {
	badge: "For client teams",
	titleStart: "Your roadmap moves fast.",
	titleHighlight: "Your hiring shouldn't lag.",
	withoutTitle: "Hiring the old way",
	withoutItems: [
		"Launches shipped without expert support - too slow to hire",
		"A freelancer found in a rush through cold outreach",
		"Scope managed with vague briefs and email threads",
		"No follow-up once the invoice is paid",
		"No specialists available for niche skills",
	],
	withTitle: "With Acme",
	withItems: [
		"A vetted freelancer ready when your project kicks off",
		"Clear briefs, milestones and deliverables in one place",
		"Your projects delivered and documented",
		"Zero sourcing or agency overhead",
		"Vetted experts across every discipline and region",
	],
	tags: ["Design", "Development", "Data", "Content", "Marketing"],
	cta: "Find a freelancer for my team",
};

export const freelancerBenefits = {
	badge: "For freelancers",
	titleStart: "Your craft all week.",
	titleHighlight: "New projects every quarter.",
	lead: "Acme grew out of a community of 40,000+ independents who love their craft. People like you.",
	withoutTitle: "Without a network",
	withoutItems: [
		"Projects found through word of mouth only",
		"Hours spent pitching clients with no reply",
		"No network (yet) among the teams that hire",
		"Going fully independent stays a distant dream",
	],
	withTitle: "With Acme",
	withItems: [
		"Projects that match your skills, in a few clicks",
		"You choose when and with whom you work",
		"A verified profile that clients trust",
		"A network that grows with every project",
	],
	tags: [
		"Designer",
		"Developer",
		"Data analyst",
		"Copywriter",
		"Consultant",
		"Translator",
	],
	cta: "Join the movement",
};

export const testimonials = [
	{
		quote:
			"Finding a designer for our launches used to be an obstacle course. Now we post the brief and get called back the same day.",
		name: "Head of product",
		role: "SaaS startup",
		accent: "primary",
	},
	{
		quote:
			"I take on projects that fit my skills, with a clear scope. Acme let me grow my independent practice with confidence.",
		name: "Brand designer",
		role: "Network member",
		accent: "highlight",
	},
	{
		quote:
			"Having an expert embedded all quarter changed everything: fewer reworks, and the feeling of finally being taken seriously.",
		name: "Marketing lead",
		role: "Client team",
		accent: "primary",
	},
] as const;

export const values = [
	{
		title: "Responsiveness",
		description:
			"Close to you and your teams, we react fast to target and answer your needs precisely. Tailored offers to build real momentum around independent work and close the gaps in how projects get staffed and delivered.",
	},
	{
		title: "Simplicity",
		description:
			"Hiring independents is a maze. By handling the introduction, we manage every part of the process. From search to invoicing, through smart matching and all of the admin in between.",
	},
	{
		title: "Loyalty",
		description:
			"We see you as true partners and care deeply about building a solid, lasting relationship of trust.",
	},
];

export const ctaBanner = {
	title: "Join the Acme adventure",
	description:
		"Client or freelancer: let's build a way of working together that is fairer, better supported and built to last.",
};

export const mainNavigation = [
	{ title: "How it works", href: "/#how-it-works" },
	{ title: "For clients", href: "/#client-benefits" },
	{ title: "For freelancers", href: "/#freelancer-benefits" },
	{ title: "Shop", href: "https://shop.acme.dev" },
];

export const footerNavigation = [
	{
		title: "Platform",
		items: [
			{ title: "How it works", href: "/#how-it-works" },
			{ title: "For clients", href: "/#client-benefits" },
			{ title: "For freelancers", href: "/#freelancer-benefits" },
			{ title: "Shop", href: "https://shop.acme.dev" },
		],
	},
	{
		title: "Resources",
		items: [
			{ title: "Blog", href: "/blog" },
			{ title: "About", href: "/about" },
			{ title: "Contact", href: "/contact" },
		],
	},
	{
		title: "Legal",
		items: [
			{ title: "Legal notice", href: "/legal" },
			{ title: "Privacy policy", href: "/privacy" },
			{ title: "Terms of service", href: "/terms" },
		],
	},
	{
		title: "Contact",
		items: [
			{ title: "contact@acme.dev", href: "mailto:contact@acme.dev" },
			{ title: "+1 (555) 010-3345", href: "tel:+15550103345" },
		],
	},
];
