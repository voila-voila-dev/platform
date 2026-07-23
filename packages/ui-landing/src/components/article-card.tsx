import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "@voila.dev/ui/lib/utils";

import { ArticleTags } from "#/components/article-tags.tsx";

/**
 * Blog article card.
 * Compose: Root (anchor) > Frame > Image | ImageFallback + Content (Tags,
 * Title, Description, Meta > MetaItem…/Arrow).
 */

/** The clickable wrapper — an anchor by default; pass `render` for a router Link. */
function Root({ className, render, ...props }: useRender.ComponentProps<"a">) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn("group block", className),
			},
			props,
		),
		render,
		state: {
			slot: "article-card",
		},
	});
}

/** The card surface (Astro `Card` default/none/lift as `article`). */
function Frame({ className, ...props }: React.ComponentProps<"article">) {
	return (
		<article
			data-slot="article-card-frame"
			className={cn(
				"rounded-lg border border-border bg-card text-card-foreground transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
				className,
			)}
			{...props}
		/>
	);
}

interface ArticleCardImageProps extends React.ComponentProps<"img"> {
	alt: string;
}

function Image({ className, alt, ...props }: ArticleCardImageProps) {
	return (
		<div
			data-slot="article-card-image"
			className="relative aspect-video overflow-hidden rounded-t-lg"
		>
			<img
				alt={alt}
				loading="lazy"
				className={cn(
					"h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
					className,
				)}
				{...props}
			/>
			<div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
		</div>
	);
}

/** Gradient placeholder shown when the article has no cover image. */
function ImageFallback({
	className,
	children,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="article-card-image-fallback"
			className={cn(
				"relative aspect-video overflow-hidden rounded-t-lg bg-linear-to-br from-provider/20 to-organization/20",
				className,
			)}
			{...props}
		>
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-6xl opacity-30">{children ?? "📝"}</span>
			</div>
		</div>
	);
}

function Content({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="article-card-content"
			className={cn("p-5", className)}
			{...props}
		/>
	);
}

function Tags({ className, ...props }: React.ComponentProps<"div">) {
	return <ArticleTags.Root className={cn("mb-3", className)} {...props} />;
}

function Title({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="article-card-title"
			className={cn(
				"mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-provider",
				className,
			)}
			{...props}
		/>
	);
}

function Description({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="article-card-description"
			className={cn(
				"mb-4 line-clamp-2 text-sm text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function Meta({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="article-card-meta"
			className={cn(
				"flex items-center justify-between text-xs text-muted-foreground",
				className,
			)}
			{...props}
		/>
	);
}

function MetaItems({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="article-card-meta-items"
			className={cn("flex items-center gap-3", className)}
			{...props}
		/>
	);
}

/** Date / reading-time entry — icon child + text. */
function MetaItem({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="article-card-meta-item"
			className={cn(
				"flex items-center gap-1 [&_svg]:h-3.5 [&_svg]:w-3.5",
				className,
			)}
			{...props}
		/>
	);
}

function Arrow({
	className,
	...props
}: React.ComponentProps<typeof ArrowUpRightIcon>) {
	return (
		<ArrowUpRightIcon
			data-slot="article-card-arrow"
			className={cn(
				"h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
				className,
			)}
			{...props}
		/>
	);
}

export const ArticleCard = {
	Root,
	Frame,
	Image,
	ImageFallback,
	Content,
	Tags,
	Title,
	Description,
	Meta,
	MetaItems,
	MetaItem,
	Arrow,
};

export type { ArticleCardImageProps };
export { ArticleTags };
