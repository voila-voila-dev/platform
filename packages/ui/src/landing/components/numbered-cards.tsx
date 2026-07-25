import { createContext, useContext } from "react";
import {
	type Tone,
	toneTextClass,
	toneTintBackgroundClass,
} from "#/landing/lib/tones.ts";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Grid of numbered step cards ("Step 1/2/3"). Compose: Root (tone, columns) > Card >
 * CardHeader (CardIcon + CardLabel) + CardTitle + CardDescription.
 */

const NumberedCardsToneContext = createContext<Tone>("primary");

const numberedCardsVariants = cva({
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

type NumberedCardsVariants = VariantProps<typeof numberedCardsVariants>;

const numberedCardsColumnsOptions = [
	"2",
	"3",
	"4",
] as const satisfies readonly NonNullable<NumberedCardsVariants["columns"]>[];

interface NumberedCardsRootProps
	extends React.ComponentProps<"div">,
		NumberedCardsVariants {
	tone?: Tone;
}

function Root({
	tone = "primary",
	columns,
	className,
	...props
}: NumberedCardsRootProps) {
	return (
		<NumberedCardsToneContext.Provider value={tone}>
			<div
				data-slot="numbered-cards"
				className={cn(numberedCardsVariants({ columns }), className)}
				{...props}
			/>
		</NumberedCardsToneContext.Provider>
	);
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="numbered-cards-card"
			className={cn(
				"animate-fade-up relative rounded-2xl border border-border bg-card p-8",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="numbered-cards-card-header"
			className={cn("mb-4 flex items-center gap-3", className)}
			{...props}
		/>
	);
}

function CardIcon({ className, ...props }: React.ComponentProps<"span">) {
	const tone = useContext(NumberedCardsToneContext);

	return (
		<span
			data-slot="numbered-cards-card-icon"
			className={cn(
				"flex h-12 w-12 items-center justify-center rounded-xl [&_svg]:h-6 [&_svg]:w-6",
				toneTintBackgroundClass[tone],
				toneTextClass[tone],
				className,
			)}
			{...props}
		/>
	);
}

/** The "Step N" label next to the icon. */
function CardLabel({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="numbered-cards-card-label"
			className={cn("text-sm font-semibold text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="numbered-cards-card-title"
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
			data-slot="numbered-cards-card-description"
			className={cn("text-sm leading-relaxed text-muted-foreground", className)}
			{...props}
		/>
	);
}

export const NumberedCards = {
	Root,
	Card,
	CardHeader,
	CardIcon,
	CardLabel,
	CardTitle,
	CardDescription,
};

export type { NumberedCardsRootProps, NumberedCardsVariants };
export { numberedCardsColumnsOptions, numberedCardsVariants };
