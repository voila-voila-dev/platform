/**
 * Shared "tone" axis for landing sections. A tone maps the brand roles from
 * `@voila.dev/ui/styles/themes/default.css` onto the coordinated class sets marketing sections
 * need (tinted chip, solid badge, connector line…). Class strings are full
 * literals — never composed at runtime — so Tailwind's scanner sees them.
 */

export const toneOptions = [
	"primary",
	"brand",
	"highlight",
	"destructive",
	"muted",
] as const;

export type Tone = (typeof toneOptions)[number];

export const toneTextClass: Record<Tone, string> = {
	primary: "text-primary",
	brand: "text-brand",
	highlight: "text-highlight",
	destructive: "text-destructive",
	muted: "text-muted-foreground",
};

export const toneTintBackgroundClass: Record<Tone, string> = {
	primary: "bg-primary/10",
	brand: "bg-brand/10",
	highlight: "bg-highlight/10",
	destructive: "bg-destructive/10",
	muted: "bg-muted",
};

export const toneSolidBackgroundClass: Record<Tone, string> = {
	primary: "bg-primary",
	brand: "bg-brand",
	highlight: "bg-highlight",
	destructive: "bg-destructive",
	muted: "bg-muted-foreground",
};

export const toneSolidClass: Record<Tone, string> = {
	primary: "bg-primary text-primary-foreground",
	brand: "bg-brand text-brand-foreground",
	highlight: "bg-highlight text-highlight-foreground",
	destructive: "bg-destructive text-white",
	muted: "bg-muted text-muted-foreground",
};

export const toneConnectorLineClass: Record<Tone, string> = {
	primary: "bg-gradient-to-b from-primary via-primary/40 to-primary/10",
	brand: "bg-gradient-to-b from-brand via-brand/40 to-brand/10",
	highlight: "bg-gradient-to-b from-highlight via-highlight/40 to-highlight/10",
	destructive:
		"bg-gradient-to-b from-destructive via-destructive/40 to-destructive/10",
	muted: "bg-gradient-to-b from-border via-border/40 to-border/10",
};

export const toneHoverBorderClass: Record<Tone, string> = {
	primary: "hover:border-primary/40",
	brand: "hover:border-brand/40",
	highlight: "hover:border-highlight/40",
	destructive: "hover:border-destructive/40",
	muted: "hover:border-border",
};

export const tonePanelClass: Record<Tone, string> = {
	primary: "border-primary/20 bg-primary/5",
	brand: "border-brand/20 bg-brand/5",
	highlight: "border-highlight/20 bg-highlight/5",
	destructive: "border-destructive/20 bg-destructive/5",
	muted: "border-border bg-muted/50",
};

/*
 * Accent classes for marketing highlights - built on the brand roles from
 * `@voila.dev/ui/styles/themes/default.css` so a rebrand is a token change, not a find-and-replace.
 */

export const accentHighlightTintClass = "bg-highlight/10 text-highlight";
export const accentHighlightStarClass = "fill-highlight text-highlight";
export const accentHighlightBlobClass = "bg-highlight/20";
export const brandGradientClass = "bg-gradient-to-br from-primary to-brand";
