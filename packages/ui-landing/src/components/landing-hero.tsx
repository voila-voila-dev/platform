import { cva, type VariantProps } from "@voila.dev/ui/cva";
import { cn } from "@voila.dev/ui/lib/utils";

import { Container } from "#/components/container.tsx";
import { Heading, type HeadingProps } from "#/components/heading.tsx";
import { Section, type SectionProps } from "#/components/section.tsx";
import { Text, type TextProps } from "#/components/text.tsx";
import { type Tone, toneTextClass } from "#/lib/tones.ts";

/**
 * Landing page hero. Split layout = content column + illustration/media
 * column; centered layout for
 * media-less heroes. Compose: Root > Content (Eyebrow, Title + Highlight,
 * Lead, Actions, StatsRow) + Media.
 */

const landingHeroLayoutVariants = cva({
	base: "grid items-center gap-12",
	variants: {
		layout: {
			split: "lg:grid-cols-2",
			centered: "justify-items-center text-center",
		},
	},
	defaultVariants: {
		layout: "split",
	},
});

type LandingHeroLayoutVariants = VariantProps<typeof landingHeroLayoutVariants>;

const landingHeroLayoutOptions = [
	"split",
	"centered",
] as const satisfies readonly NonNullable<
	LandingHeroLayoutVariants["layout"]
>[];

interface LandingHeroRootProps
	extends SectionProps,
		LandingHeroLayoutVariants {}

function Root({
	layout,
	spacing = "lg",
	background,
	className,
	children,
	...props
}: LandingHeroRootProps) {
	return (
		<Section
			spacing={spacing}
			background={background}
			className={cn("overflow-hidden", className)}
			{...props}
		>
			<Container>
				<div className={landingHeroLayoutVariants({ layout })}>{children}</div>
			</Container>
		</Section>
	);
}

function Content({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="landing-hero-content"
			className={cn("animate-fade-up max-w-2xl", className)}
			{...props}
		/>
	);
}

function Title({ className, ...props }: HeadingProps) {
	return <Heading level="h1" className={cn("mb-6", className)} {...props} />;
}

interface LandingHeroHighlightProps extends React.ComponentProps<"span"> {
	tone?: Tone;
}

/** Colored span inside the title — the multi-tone headline of the home hero. */
function Highlight({
	tone = "primary",
	className,
	...props
}: LandingHeroHighlightProps) {
	return (
		<span
			data-slot="landing-hero-highlight"
			className={cn(toneTextClass[tone], className)}
			{...props}
		/>
	);
}

function Lead({ className, ...props }: TextProps) {
	return (
		<Text
			variant="lead"
			className={cn("mb-8 max-w-xl", className)}
			{...props}
		/>
	);
}

function Actions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="landing-hero-actions"
			className={cn("flex flex-col gap-4 sm:flex-row", className)}
			{...props}
		/>
	);
}

/** Illustration column — hidden below `lg`, like the Astro heroes. */
function Media({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="landing-hero-media"
			className={cn("hidden lg:block", className)}
			{...props}
		/>
	);
}

export const LandingHero = {
	Root,
	Content,
	Title,
	Highlight,
	Lead,
	Actions,
	Media,
};

export type {
	LandingHeroHighlightProps,
	LandingHeroLayoutVariants,
	LandingHeroRootProps,
};
export { landingHeroLayoutOptions, landingHeroLayoutVariants };
