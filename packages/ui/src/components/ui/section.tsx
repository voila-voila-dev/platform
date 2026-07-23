import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "#/lib/utils.ts";

/**
 * Vertical rhythm wrapper for an in-page section - heading row + content with
 * consistent spacing, the `PageHeader` anatomy one level down. Renders a
 * `section` by default - pass `render` for a plain `div` when the landmark
 * is unwanted.
 */
function Section({
	className,
	render,
	...props
}: useRender.ComponentProps<"section">) {
	return useRender({
		defaultTagName: "section",
		props: mergeProps<"section">(
			{
				className: cn("flex flex-col gap-4", className),
			},
			props,
		),
		render,
		state: {
			slot: "section",
		},
	});
}

function SectionHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="section-header"
			className={cn("flex items-center justify-between gap-4", className)}
			{...props}
		/>
	);
}

function SectionHeading({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="section-heading"
			className={cn("flex min-w-0 flex-col gap-1", className)}
			{...props}
		/>
	);
}

/** Renders an `h2` - pass `render` to fit the page's heading outline. */
function SectionTitle({
	className,
	render,
	...props
}: useRender.ComponentProps<"h2">) {
	return useRender({
		defaultTagName: "h2",
		props: mergeProps<"h2">(
			{
				className: cn("text-lg font-semibold tracking-tight", className),
			},
			props,
		),
		render,
		state: {
			slot: "section-title",
		},
	});
}

function SectionDescription({
	className,
	...props
}: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="section-description"
			className={cn(
				"text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
				className,
			)}
			{...props}
		/>
	);
}

function SectionActions({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="section-actions"
			className={cn("flex shrink-0 items-center gap-2", className)}
			{...props}
		/>
	);
}

export {
	Section,
	SectionActions,
	SectionDescription,
	SectionHeader,
	SectionHeading,
	SectionTitle,
};
