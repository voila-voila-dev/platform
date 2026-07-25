import { createContext, useContext } from "react";
import {
	type Tone,
	toneTextClass,
	toneTintBackgroundClass,
} from "#/landing/lib/tones.ts";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Grid of icon cards (pain points, benefits, product highlights). Compose: Root (tone,
 * columns) > Card > CardIcon + CardTitle + CardDescription.
 */

const FeatureGridToneContext = createContext<Tone>("primary");

const featureGridVariants = cva({
	base: "grid gap-6",
	variants: {
		columns: {
			"2": "md:grid-cols-2",
			"3": "md:grid-cols-3",
			"4": "md:grid-cols-2 lg:grid-cols-4",
		},
	},
	defaultVariants: {
		columns: "3",
	},
});

type FeatureGridVariants = VariantProps<typeof featureGridVariants>;

const featureGridColumnsOptions = [
	"2",
	"3",
	"4",
] as const satisfies readonly NonNullable<FeatureGridVariants["columns"]>[];

interface FeatureGridRootProps
	extends React.ComponentProps<"div">,
		FeatureGridVariants {
	tone?: Tone;
}

function Root({
	tone = "primary",
	columns,
	className,
	...props
}: FeatureGridRootProps) {
	return (
		<FeatureGridToneContext.Provider value={tone}>
			<div
				data-slot="feature-grid"
				className={cn(featureGridVariants({ columns }), className)}
				{...props}
			/>
		</FeatureGridToneContext.Provider>
	);
}

const featureGridCardVariants = cva({
	base: "h-full rounded-2xl bg-card text-card-foreground transition-all duration-200",
	variants: {
		variant: {
			elevated: "border border-transparent p-8 shadow-lg",
			outline: "border border-border p-8",
		},
	},
	defaultVariants: {
		variant: "elevated",
	},
});

type FeatureGridCardVariants = VariantProps<typeof featureGridCardVariants>;

const featureGridCardVariantOptions = [
	"elevated",
	"outline",
] as const satisfies readonly NonNullable<FeatureGridCardVariants["variant"]>[];

interface FeatureGridCardProps
	extends React.ComponentProps<"div">,
		FeatureGridCardVariants {}

function Card({ variant, className, ...props }: FeatureGridCardProps) {
	return (
		<div
			data-slot="feature-grid-card"
			className={cn(featureGridCardVariants({ variant }), className)}
			{...props}
		/>
	);
}

interface FeatureGridCardIconProps extends React.ComponentProps<"span"> {
	tone?: Tone;
}

function CardIcon({ tone, className, ...props }: FeatureGridCardIconProps) {
	const inheritedTone = useContext(FeatureGridToneContext);
	const resolvedTone = tone ?? inheritedTone;

	return (
		<span
			data-slot="feature-grid-card-icon"
			className={cn(
				"mb-4 flex h-12 w-12 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
				toneTintBackgroundClass[resolvedTone],
				toneTextClass[resolvedTone],
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="feature-grid-card-title"
			className={cn(
				"mb-2 font-heading text-xl font-bold tracking-tight text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="feature-grid-card-description"
			className={cn("text-sm leading-relaxed text-muted-foreground", className)}
			{...props}
		/>
	);
}

export const FeatureGrid = {
	Root,
	Card,
	CardIcon,
	CardTitle,
	CardDescription,
};

export type {
	FeatureGridCardIconProps,
	FeatureGridCardProps,
	FeatureGridCardVariants,
	FeatureGridRootProps,
	FeatureGridVariants,
};
export {
	featureGridCardVariantOptions,
	featureGridCardVariants,
	featureGridColumnsOptions,
	featureGridVariants,
};
