import { cn } from "@voila.dev/ui/lib/utils";

import { accentOrangeBlobClass, brandGradientClass } from "#/lib/tones.ts";

/**
 * Bento grid with a featured gradient tile. Compose: Root > FeaturedItem (FeaturedContent >
 * FeaturedIcon/FeaturedLabel/FeaturedTitle + FeaturedDescription) + Item
 * (ItemIcon + ItemBody > ItemTitle/ItemDescription).
 */

function Root({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="bento-grid"
			className={cn("grid gap-6 lg:grid-cols-3", className)}
			{...props}
		/>
	);
}

/** The gradient hero tile — spans two rows on desktop, owns the blur blobs. */
function FeaturedItem({
	className,
	children,
	...props
}: React.ComponentProps<"article">) {
	return (
		<article
			data-slot="bento-featured-item"
			className={cn(
				"animate-fade-up relative flex flex-col justify-between overflow-hidden rounded-2xl p-8 text-primary-foreground shadow-xl lg:row-span-2",
				brandGradientClass,
				className,
			)}
			{...props}
		>
			<div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
			<div
				className={cn(
					"pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full blur-3xl",
					accentOrangeBlobClass,
				)}
			/>
			{children}
		</article>
	);
}

function FeaturedContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="bento-featured-content"
			className={cn("relative", className)}
			{...props}
		/>
	);
}

function FeaturedIcon({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="bento-featured-icon"
			className={cn(
				"mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur [&_svg]:h-7 [&_svg]:w-7",
				className,
			)}
			{...props}
		/>
	);
}

function FeaturedLabel({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="bento-featured-label"
			className={cn(
				"mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70",
				className,
			)}
			{...props}
		/>
	);
}

function FeaturedTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="bento-featured-title"
			className={cn(
				"font-heading text-5xl font-bold tracking-tight",
				className,
			)}
			{...props}
		/>
	);
}

function FeaturedDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="bento-featured-description"
			className={cn(
				"relative mt-6 text-base leading-relaxed text-white/90",
				className,
			)}
			{...props}
		/>
	);
}

interface BentoGridItemProps extends React.ComponentProps<"article"> {
	/** Spans two columns on desktop (the last tile of an odd set). */
	wide?: boolean;
}

function Item({ wide = false, className, ...props }: BentoGridItemProps) {
	return (
		<article
			data-slot="bento-item"
			className={cn(
				"animate-fade-up group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-md lg:p-8",
				wide && "lg:col-span-2",
				className,
			)}
			{...props}
		/>
	);
}

/** Icon tile + text laid out side by side. */
function ItemLayout({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="bento-item-layout"
			className={cn("flex items-start gap-4", className)}
			{...props}
		/>
	);
}

function ItemIcon({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="bento-item-icon"
			className={cn(
				"flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15 [&_svg]:h-6 [&_svg]:w-6",
				className,
			)}
			{...props}
		/>
	);
}

function ItemBody({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="bento-item-body" className={className} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="bento-item-title"
			className={cn("mb-2 font-heading text-xl font-semibold", className)}
			{...props}
		/>
	);
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="bento-item-description"
			className={cn("text-sm leading-relaxed text-muted-foreground", className)}
			{...props}
		/>
	);
}

export const BentoGrid = {
	Root,
	FeaturedItem,
	FeaturedContent,
	FeaturedIcon,
	FeaturedLabel,
	FeaturedTitle,
	FeaturedDescription,
	Item,
	ItemLayout,
	ItemIcon,
	ItemBody,
	ItemTitle,
	ItemDescription,
};

export type { BentoGridItemProps };
