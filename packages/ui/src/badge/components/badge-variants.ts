import { cva, type VariantProps } from "#/lib/cva.ts";

export const badgeVariants = cva({
	base: "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
	variants: {
		/**
		 * Semantic intent, for **status**: pending, failed, verified. For an
		 * arbitrary category — a tag, a skill, a department — use `color`.
		 */
		variant: {
			default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
			secondary:
				"bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
			brand: "bg-brand text-brand-foreground [a]:hover:bg-brand/90",
			highlight:
				"bg-highlight text-highlight-foreground [a]:hover:bg-highlight/90",
			destructive:
				"bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
			outline:
				"border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
			ghost:
				"hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
			link: "text-primary underline-offset-4 hover:underline",
		},
		/**
		 * Catalogue palette, for **category** rather than status. Overrides
		 * `variant` when both are set.
		 */
		color: {
			slate:
				"bg-badge-slate text-badge-slate-foreground [a]:hover:bg-badge-slate/90",
			gray: "bg-badge-gray text-badge-gray-foreground [a]:hover:bg-badge-gray/90",
			zinc: "bg-badge-zinc text-badge-zinc-foreground [a]:hover:bg-badge-zinc/90",
			red: "bg-badge-red text-badge-red-foreground [a]:hover:bg-badge-red/90",
			orange:
				"bg-badge-orange text-badge-orange-foreground [a]:hover:bg-badge-orange/90",
			amber:
				"bg-badge-amber text-badge-amber-foreground [a]:hover:bg-badge-amber/90",
			yellow:
				"bg-badge-yellow text-badge-yellow-foreground [a]:hover:bg-badge-yellow/90",
			lime: "bg-badge-lime text-badge-lime-foreground [a]:hover:bg-badge-lime/90",
			green:
				"bg-badge-green text-badge-green-foreground [a]:hover:bg-badge-green/90",
			emerald:
				"bg-badge-emerald text-badge-emerald-foreground [a]:hover:bg-badge-emerald/90",
			teal: "bg-badge-teal text-badge-teal-foreground [a]:hover:bg-badge-teal/90",
			cyan: "bg-badge-cyan text-badge-cyan-foreground [a]:hover:bg-badge-cyan/90",
			sky: "bg-badge-sky text-badge-sky-foreground [a]:hover:bg-badge-sky/90",
			blue: "bg-badge-blue text-badge-blue-foreground [a]:hover:bg-badge-blue/90",
			indigo:
				"bg-badge-indigo text-badge-indigo-foreground [a]:hover:bg-badge-indigo/90",
			violet:
				"bg-badge-violet text-badge-violet-foreground [a]:hover:bg-badge-violet/90",
			purple:
				"bg-badge-purple text-badge-purple-foreground [a]:hover:bg-badge-purple/90",
			fuchsia:
				"bg-badge-fuchsia text-badge-fuchsia-foreground [a]:hover:bg-badge-fuchsia/90",
			pink: "bg-badge-pink text-badge-pink-foreground [a]:hover:bg-badge-pink/90",
			rose: "bg-badge-rose text-badge-rose-foreground [a]:hover:bg-badge-rose/90",
		},
		/**
		 * Fill style for the palette colors. `solid` is the classic filled chip;
		 * `soft` keeps the same hue as a ~15% tinted background with a text tone
		 * mixed from the hue and the theme foreground, so the pastel stays
		 * legible in light and dark mode without any per-hue soft tokens. Only
		 * meaningful together with `color` (compound variants below).
		 */
		appearance: {
			solid: "",
			soft: "",
		},
		/** `sm` for dense surfaces such as table cells. Below that, use text. */
		size: {
			default:
				"h-5 gap-1 px-2 py-0.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
			sm: "h-4 gap-0.5 px-1.5 py-0 text-[10px] has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg:not([class*='size-'])]:size-2.5",
		},
	},
	compoundVariants: [
		{
			color: "slate",
			appearance: "soft",
			className:
				"bg-badge-slate/15 dark:bg-badge-slate/25 text-[color-mix(in_oklab,var(--color-badge-slate)_55%,var(--color-foreground))] [a]:hover:bg-badge-slate/25",
		},
		{
			color: "gray",
			appearance: "soft",
			className:
				"bg-badge-gray/15 dark:bg-badge-gray/25 text-[color-mix(in_oklab,var(--color-badge-gray)_55%,var(--color-foreground))] [a]:hover:bg-badge-gray/25",
		},
		{
			color: "zinc",
			appearance: "soft",
			className:
				"bg-badge-zinc/15 dark:bg-badge-zinc/25 text-[color-mix(in_oklab,var(--color-badge-zinc)_55%,var(--color-foreground))] [a]:hover:bg-badge-zinc/25",
		},
		{
			color: "red",
			appearance: "soft",
			className:
				"bg-badge-red/15 dark:bg-badge-red/25 text-[color-mix(in_oklab,var(--color-badge-red)_55%,var(--color-foreground))] [a]:hover:bg-badge-red/25",
		},
		{
			color: "orange",
			appearance: "soft",
			className:
				"bg-badge-orange/15 dark:bg-badge-orange/25 text-[color-mix(in_oklab,var(--color-badge-orange)_55%,var(--color-foreground))] [a]:hover:bg-badge-orange/25",
		},
		{
			color: "amber",
			appearance: "soft",
			className:
				"bg-badge-amber/15 dark:bg-badge-amber/25 text-[color-mix(in_oklab,var(--color-badge-amber)_55%,var(--color-foreground))] [a]:hover:bg-badge-amber/25",
		},
		{
			color: "yellow",
			appearance: "soft",
			className:
				"bg-badge-yellow/15 dark:bg-badge-yellow/25 text-[color-mix(in_oklab,var(--color-badge-yellow)_55%,var(--color-foreground))] [a]:hover:bg-badge-yellow/25",
		},
		{
			color: "lime",
			appearance: "soft",
			className:
				"bg-badge-lime/15 dark:bg-badge-lime/25 text-[color-mix(in_oklab,var(--color-badge-lime)_55%,var(--color-foreground))] [a]:hover:bg-badge-lime/25",
		},
		{
			color: "green",
			appearance: "soft",
			className:
				"bg-badge-green/15 dark:bg-badge-green/25 text-[color-mix(in_oklab,var(--color-badge-green)_55%,var(--color-foreground))] [a]:hover:bg-badge-green/25",
		},
		{
			color: "emerald",
			appearance: "soft",
			className:
				"bg-badge-emerald/15 dark:bg-badge-emerald/25 text-[color-mix(in_oklab,var(--color-badge-emerald)_55%,var(--color-foreground))] [a]:hover:bg-badge-emerald/25",
		},
		{
			color: "teal",
			appearance: "soft",
			className:
				"bg-badge-teal/15 dark:bg-badge-teal/25 text-[color-mix(in_oklab,var(--color-badge-teal)_55%,var(--color-foreground))] [a]:hover:bg-badge-teal/25",
		},
		{
			color: "cyan",
			appearance: "soft",
			className:
				"bg-badge-cyan/15 dark:bg-badge-cyan/25 text-[color-mix(in_oklab,var(--color-badge-cyan)_55%,var(--color-foreground))] [a]:hover:bg-badge-cyan/25",
		},
		{
			color: "sky",
			appearance: "soft",
			className:
				"bg-badge-sky/15 dark:bg-badge-sky/25 text-[color-mix(in_oklab,var(--color-badge-sky)_55%,var(--color-foreground))] [a]:hover:bg-badge-sky/25",
		},
		{
			color: "blue",
			appearance: "soft",
			className:
				"bg-badge-blue/15 dark:bg-badge-blue/25 text-[color-mix(in_oklab,var(--color-badge-blue)_55%,var(--color-foreground))] [a]:hover:bg-badge-blue/25",
		},
		{
			color: "indigo",
			appearance: "soft",
			className:
				"bg-badge-indigo/15 dark:bg-badge-indigo/25 text-[color-mix(in_oklab,var(--color-badge-indigo)_55%,var(--color-foreground))] [a]:hover:bg-badge-indigo/25",
		},
		{
			color: "violet",
			appearance: "soft",
			className:
				"bg-badge-violet/15 dark:bg-badge-violet/25 text-[color-mix(in_oklab,var(--color-badge-violet)_55%,var(--color-foreground))] [a]:hover:bg-badge-violet/25",
		},
		{
			color: "purple",
			appearance: "soft",
			className:
				"bg-badge-purple/15 dark:bg-badge-purple/25 text-[color-mix(in_oklab,var(--color-badge-purple)_55%,var(--color-foreground))] [a]:hover:bg-badge-purple/25",
		},
		{
			color: "fuchsia",
			appearance: "soft",
			className:
				"bg-badge-fuchsia/15 dark:bg-badge-fuchsia/25 text-[color-mix(in_oklab,var(--color-badge-fuchsia)_55%,var(--color-foreground))] [a]:hover:bg-badge-fuchsia/25",
		},
		{
			color: "pink",
			appearance: "soft",
			className:
				"bg-badge-pink/15 dark:bg-badge-pink/25 text-[color-mix(in_oklab,var(--color-badge-pink)_55%,var(--color-foreground))] [a]:hover:bg-badge-pink/25",
		},
		{
			color: "rose",
			appearance: "soft",
			className:
				"bg-badge-rose/15 dark:bg-badge-rose/25 text-[color-mix(in_oklab,var(--color-badge-rose)_55%,var(--color-foreground))] [a]:hover:bg-badge-rose/25",
		},
	],
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;

/** The catalog palette names - keep in sync with the `color` variant above. */
export const badgeColors = [
	"slate",
	"gray",
	"zinc",
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
] as const satisfies readonly NonNullable<BadgeVariants["color"]>[];

export type BadgeColor = (typeof badgeColors)[number];

/**
 * Static lookup for the palette background utilities. Consumers (e.g. the
 * color picker) must use this instead of composing `bg-badge-${name}` at
 * runtime, which would silently break if these literals stopped being
 * scanned by Tailwind.
 */
export const badgeColorBackgroundClass: Record<BadgeColor, string> = {
	slate: "bg-badge-slate",
	gray: "bg-badge-gray",
	zinc: "bg-badge-zinc",
	red: "bg-badge-red",
	orange: "bg-badge-orange",
	amber: "bg-badge-amber",
	yellow: "bg-badge-yellow",
	lime: "bg-badge-lime",
	green: "bg-badge-green",
	emerald: "bg-badge-emerald",
	teal: "bg-badge-teal",
	cyan: "bg-badge-cyan",
	sky: "bg-badge-sky",
	blue: "bg-badge-blue",
	indigo: "bg-badge-indigo",
	violet: "bg-badge-violet",
	purple: "bg-badge-purple",
	fuchsia: "bg-badge-fuchsia",
	pink: "bg-badge-pink",
	rose: "bg-badge-rose",
};

/** Static lookup for the contrast-aware palette foreground utilities. */
export const badgeColorForegroundClass: Record<BadgeColor, string> = {
	slate: "text-badge-slate-foreground",
	gray: "text-badge-gray-foreground",
	zinc: "text-badge-zinc-foreground",
	red: "text-badge-red-foreground",
	orange: "text-badge-orange-foreground",
	amber: "text-badge-amber-foreground",
	yellow: "text-badge-yellow-foreground",
	lime: "text-badge-lime-foreground",
	green: "text-badge-green-foreground",
	emerald: "text-badge-emerald-foreground",
	teal: "text-badge-teal-foreground",
	cyan: "text-badge-cyan-foreground",
	sky: "text-badge-sky-foreground",
	blue: "text-badge-blue-foreground",
	indigo: "text-badge-indigo-foreground",
	violet: "text-badge-violet-foreground",
	purple: "text-badge-purple-foreground",
	fuchsia: "text-badge-fuchsia-foreground",
	pink: "text-badge-pink-foreground",
	rose: "text-badge-rose-foreground",
};

/** The semantic variant names - keep in sync with the `variant` axis above. */
export const badgeVariantOptions = [
	"default",
	"secondary",
	"brand",
	"highlight",
	"destructive",
	"outline",
	"ghost",
	"link",
] as const satisfies readonly NonNullable<BadgeVariants["variant"]>[];

export type BadgeVariant = (typeof badgeVariantOptions)[number];
