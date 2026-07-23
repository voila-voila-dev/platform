/**
 * Shared "tone" axis for landing sections. A tone maps the brand roles from
 * `@voila.dev/ui-tokens` onto the coordinated class sets marketing sections
 * need (tinted chip, solid badge, connector line…). Class strings are full
 * literals — never composed at runtime — so Tailwind's scanner sees them.
 */

export const toneOptions = [
	"primary",
	"provider",
	"organization",
	"destructive",
	"muted",
] as const;

export type Tone = (typeof toneOptions)[number];

export const toneTextClass: Record<Tone, string> = {
	primary: "text-primary",
	provider: "text-provider",
	organization: "text-organization",
	destructive: "text-destructive",
	muted: "text-muted-foreground",
};

export const toneTintBackgroundClass: Record<Tone, string> = {
	primary: "bg-primary/10",
	provider: "bg-provider/10",
	organization: "bg-organization/10",
	destructive: "bg-destructive/10",
	muted: "bg-muted",
};

export const toneSolidBackgroundClass: Record<Tone, string> = {
	primary: "bg-primary",
	provider: "bg-provider",
	organization: "bg-organization",
	destructive: "bg-destructive",
	muted: "bg-muted-foreground",
};

export const toneSolidClass: Record<Tone, string> = {
	primary: "bg-primary text-primary-foreground",
	provider: "bg-provider text-provider-foreground",
	organization: "bg-organization text-organization-foreground",
	destructive: "bg-destructive text-white",
	muted: "bg-muted text-muted-foreground",
};

export const toneConnectorLineClass: Record<Tone, string> = {
	primary: "bg-gradient-to-b from-primary via-primary/40 to-primary/10",
	provider: "bg-gradient-to-b from-provider via-provider/40 to-provider/10",
	organization:
		"bg-gradient-to-b from-organization via-organization/40 to-organization/10",
	destructive:
		"bg-gradient-to-b from-destructive via-destructive/40 to-destructive/10",
	muted: "bg-gradient-to-b from-border via-border/40 to-border/10",
};

export const toneHoverBorderClass: Record<Tone, string> = {
	primary: "hover:border-primary/40",
	provider: "hover:border-provider/40",
	organization: "hover:border-organization/40",
	destructive: "hover:border-destructive/40",
	muted: "hover:border-border",
};

export const tonePanelClass: Record<Tone, string> = {
	primary: "border-primary/20 bg-primary/5",
	provider: "border-provider/20 bg-provider/5",
	organization: "border-organization/20 bg-organization/5",
	destructive: "border-destructive/20 bg-destructive/5",
	muted: "border-border bg-muted/50",
};

/*
 * Accent literals carried over from the Astro marketing site for pixel
 * parity. TODO: promote to named tokens in @voila.dev/ui-tokens once the
 * rebuild has shipped (they are close to, but not equal to, the brand roles).
 */

export const accentOrangeTintClass = "bg-[#FA8424]/10 text-[#FA8424]";
export const accentOrangeStarClass = "fill-[#FA8424] text-[#FA8424]";
export const accentOrangeBlobClass = "bg-[#FA8424]/20";
export const brandGradientClass = "bg-gradient-to-br from-primary to-[#3b5bff]";
