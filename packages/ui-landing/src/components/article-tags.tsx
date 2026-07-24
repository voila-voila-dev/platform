import { cn } from "@voila.dev/ui/lib/utils";

/** Tag chip row for blog articles. */

function Root({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="article-tags"
			className={cn("flex flex-wrap gap-2", className)}
			{...props}
		/>
	);
}

function Tag({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			data-slot="article-tag"
			className={cn(
				"inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand transition-colors",
				className,
			)}
			{...props}
		/>
	);
}

export const ArticleTags = {
	Root,
	Tag,
};
