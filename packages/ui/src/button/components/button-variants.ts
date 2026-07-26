import { cva, type VariantProps } from "#/lib/cva.ts";

export const buttonVariants = cva({
	base: "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
			primary: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
			secondary:
				"bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			brand: "bg-brand text-brand-foreground [a]:hover:bg-brand/90",
			highlight:
				"bg-highlight text-highlight-foreground [a]:hover:bg-highlight/90",
			outline:
				"border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			ghost:
				"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive:
				"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "border-transparent text-primary underline-offset-4 hover:underline",
		},
		size: {
			default:
				"h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-11 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
			icon: "size-8",
			"icon-xs":
				"size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
			"icon-sm":
				"size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
			"icon-lg": "size-9",
		},
		shape: {
			default: "",
			pill: "rounded-full",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
		shape: "default",
	},
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

/**
 * The semantic variant names - keep in sync with the `variant` axis above.
 * Exported (like `badgeColors`) so stories and form builders can iterate the
 * set instead of hand-copying it.
 */
export const buttonVariantOptions = [
	"default",
	"primary",
	"secondary",
	"brand",
	"highlight",
	"outline",
	"ghost",
	"destructive",
	"link",
] as const satisfies readonly NonNullable<ButtonVariants["variant"]>[];

export type ButtonVariant = (typeof buttonVariantOptions)[number];

/**
 * The size names, ordered smallest to largest (text sizes then icon sizes) -
 * keep in sync with the `size` axis above. The scale is xs < sm < default < lg,
 * with `default` (h-8) as the unmarked middle.
 */
export const buttonSizeOptions = [
	"xs",
	"sm",
	"default",
	"lg",
	"icon-xs",
	"icon-sm",
	"icon",
	"icon-lg",
] as const satisfies readonly NonNullable<ButtonVariants["size"]>[];

export type ButtonSize = (typeof buttonSizeOptions)[number];
