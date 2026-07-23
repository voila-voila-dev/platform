import { cva, type VariantProps } from "#/lib/cva.ts";

/**
 * The single canonical badge cva - base, variants, palette and sizes - shared
 * by `Badge` and `Chip`. Like `button-variants.ts`/`menu-variants.ts`, the
 * recipe lives in a React-free module so it stays importable from non-React
 * surfaces and cross-component without pulling the component in.
 */
export const badgeVariants = cva({
	base: "group/badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden rounded-4xl border border-transparent font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg:not([class*='size-'])]:size-3",
	variants: {
		// Solid variants only hover when rendered as an anchor ([a]:hover) -
		// static chips should stay inert - while `ghost` and `link` exist for
		// interactive use and hover unconditionally.
		variant: {
			default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
			secondary:
				"bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
			provider: "bg-provider text-provider-foreground [a]:hover:bg-provider/90",
			organization:
				"bg-organization text-organization-foreground [a]:hover:bg-organization/90",
			destructive:
				"bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
			outline:
				"border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
			ghost:
				"hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
			link: "text-primary underline-offset-4 hover:underline",
		},
		// Catalog palette. Declared after `variant` so its bg/text win conflicts
		// via tailwind-merge when both a `variant` and a `color` are passed. Keep
		// in sync with `BadgeColorEnum` in the domain and the `--badge-*` tokens.
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
		size: {
			default:
				"h-5 gap-1 px-2 py-0.5 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
			sm: "h-4 gap-0.5 px-1.5 py-0 text-[10px] has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 [&>svg:not([class*='size-'])]:size-2.5",
		},
	},
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
	"provider",
	"organization",
	"destructive",
	"outline",
	"ghost",
	"link",
] as const satisfies readonly NonNullable<BadgeVariants["variant"]>[];

export type BadgeVariant = (typeof badgeVariantOptions)[number];
