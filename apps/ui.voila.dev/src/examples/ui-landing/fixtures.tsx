import { LightningIcon, PathIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/utils";

/**
 * Shared fixtures, trimmed down from the Storybook set: the previews here are a
 * few hundred pixels wide, so three stats and two panels read better than the
 * full marketing copy.
 */
export function BrandLogo({ className }: { className?: string }) {
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

export function partnerLogoDataUri(name: string): string {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="48"><rect width="160" height="48" rx="8" fill="#e2e8f0"/><text x="80" y="30" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569" text-anchor="middle">${name}</text></svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function IllustrationPlaceholder({ label }: { label: string }) {
	return (
		<div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-border border-dashed bg-muted/50">
			<span className="text-muted-foreground text-sm">{label}</span>
		</div>
	);
}

export const stats = [
	{ value: "20K+", label: "Active members" },
	{ value: "2000+", label: "Vetted freelancers" },
	{ value: "700+", label: "Projects delivered" },
];

export const values = [
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
