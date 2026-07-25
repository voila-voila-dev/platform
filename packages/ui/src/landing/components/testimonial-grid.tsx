import { QuotesIcon, StarIcon } from "@phosphor-icons/react";
import {
	accentHighlightStarClass,
	accentHighlightTintClass,
} from "#/landing/lib/tones.ts";
import { cva, type VariantProps } from "#/lib/cva.ts";
import { cn } from "#/lib/utils.ts";

/**
 * Testimonial figure cards (quote, avatar initial, star rating). Compose: Root > Item >
 * QuoteIcon + Quote + Footer (Avatar + Author > AuthorName/AuthorRole +
 * Rating).
 */

function Root({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="testimonial-grid"
			className={cn("grid gap-6 md:grid-cols-3", className)}
			{...props}
		/>
	);
}

function Item({ className, ...props }: React.ComponentProps<"figure">) {
	return (
		<figure
			data-slot="testimonial-item"
			className={cn(
				"animate-fade-up flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md lg:p-8",
				className,
			)}
			{...props}
		/>
	);
}

function QuoteIcon({
	className,
	...props
}: React.ComponentProps<typeof QuotesIcon>) {
	return (
		<QuotesIcon
			data-slot="testimonial-quote-icon"
			className={cn("mb-4 h-8 w-8 text-primary/30", className)}
			{...props}
		/>
	);
}

function Quote({
	className,
	children,
	...props
}: React.ComponentProps<"blockquote">) {
	return (
		<blockquote
			data-slot="testimonial-quote"
			className={cn("flex-1 text-foreground", className)}
			{...props}
		>
			<p className="leading-relaxed">{children}</p>
		</blockquote>
	);
}

function Footer({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="testimonial-footer"
			className={cn(
				"mt-6 flex flex-wrap items-center gap-3 border-t border-border/60 pt-5",
				className,
			)}
			{...props}
		/>
	);
}

const testimonialAvatarVariants = cva({
	base: "flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold",
	variants: {
		accent: {
			primary: "bg-primary/10 text-primary",
			highlight: accentHighlightTintClass,
		},
	},
	defaultVariants: {
		accent: "primary",
	},
});

type TestimonialAvatarVariants = VariantProps<typeof testimonialAvatarVariants>;

const testimonialAvatarAccentOptions = [
	"primary",
	"highlight",
] as const satisfies readonly NonNullable<
	TestimonialAvatarVariants["accent"]
>[];

interface TestimonialAvatarProps
	extends React.ComponentProps<"span">,
		TestimonialAvatarVariants {}

/** Initial-letter avatar disc. */
function Avatar({ accent, className, ...props }: TestimonialAvatarProps) {
	return (
		<span
			data-slot="testimonial-avatar"
			className={cn(testimonialAvatarVariants({ accent }), className)}
			{...props}
		/>
	);
}

function Author({ className, ...props }: React.ComponentProps<"figcaption">) {
	return (
		<figcaption
			data-slot="testimonial-author"
			className={cn("min-w-0", className)}
			{...props}
		/>
	);
}

function AuthorName({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="testimonial-author-name"
			className={cn("text-sm font-semibold text-foreground", className)}
			{...props}
		/>
	);
}

function AuthorRole({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="testimonial-author-role"
			className={cn("text-xs text-muted-foreground", className)}
			{...props}
		/>
	);
}

interface TestimonialRatingProps extends React.ComponentProps<"div"> {
	count?: number;
}

function Rating({ count = 5, className, ...props }: TestimonialRatingProps) {
	return (
		<div
			data-slot="testimonial-rating"
			className={cn("ml-auto flex shrink-0 gap-0.5", className)}
			{...props}
		>
			{Array.from({ length: count }, (_, index) => (
				<StarIcon
					// Stars are a static decorative sequence — the index is the identity.
					key={index}
					weight="fill"
					className={cn("h-3.5 w-3.5", accentHighlightStarClass)}
				/>
			))}
		</div>
	);
}

export const TestimonialGrid = {
	Root,
	Item,
	QuoteIcon,
	Quote,
	Footer,
	Avatar,
	Author,
	AuthorName,
	AuthorRole,
	Rating,
};

export type { TestimonialAvatarProps, TestimonialRatingProps };
export { testimonialAvatarAccentOptions, testimonialAvatarVariants };
