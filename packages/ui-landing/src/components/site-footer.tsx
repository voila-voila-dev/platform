import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cn } from "@voila.dev/ui/lib/utils";

import { Container } from "#/components/container.tsx";

/**
 * Marketing site footer.
 * Compose: Root > Columns (Brand > BrandDescription + SocialLinks >
 * SocialLink…, Column > ColumnTitle + ColumnList > ColumnLink…) + Bottom >
 * BottomText…
 */

function Root({
	className,
	children,
	...props
}: React.ComponentProps<"footer">) {
	return (
		<footer
			data-slot="site-footer"
			className={cn("border-t border-border bg-muted/30", className)}
			{...props}
		>
			<Container>{children}</Container>
		</footer>
	);
}

function Columns({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="site-footer-columns"
			className={cn(
				"grid gap-8 py-12 md:grid-cols-2 md:py-16 lg:grid-cols-6",
				className,
			)}
			{...props}
		/>
	);
}

/** Brand column — logo + description + social links; spans two columns. */
function Brand({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="site-footer-brand"
			className={cn("lg:col-span-2", className)}
			{...props}
		/>
	);
}

function BrandDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="site-footer-brand-description"
			className={cn("mb-6 max-w-sm text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

function SocialLinks({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="site-footer-social-links"
			className={cn("flex items-center gap-4", className)}
			{...props}
		/>
	);
}

interface SiteFooterSocialLinkProps extends useRender.ComponentProps<"a"> {
	"aria-label": string;
}

function SocialLink({
	className,
	render,
	...props
}: SiteFooterSocialLinkProps) {
	return useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"text-muted-foreground transition-colors hover:text-foreground [&_svg]:h-5 [&_svg]:w-5",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-footer-social-link",
		},
	});
}

function Column({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div data-slot="site-footer-column" className={className} {...props} />
	);
}

function ColumnTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="site-footer-column-title"
			className={cn("mb-4 text-sm font-semibold text-foreground", className)}
			{...props}
		/>
	);
}

function ColumnList({ className, ...props }: React.ComponentProps<"ul">) {
	return (
		<ul
			data-slot="site-footer-column-list"
			className={cn("space-y-3", className)}
			{...props}
		/>
	);
}

function ColumnLink({
	className,
	render,
	...props
}: useRender.ComponentProps<"a">) {
	const anchor = useRender({
		defaultTagName: "a",
		props: mergeProps<"a">(
			{
				className: cn(
					"text-sm text-muted-foreground transition-colors hover:text-foreground",
					className,
				),
			},
			props,
		),
		render,
		state: {
			slot: "site-footer-column-link",
		},
	});

	return <li>{anchor}</li>;
}

function Bottom({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="site-footer-bottom"
			className={cn(
				"flex flex-col items-center justify-between gap-4 border-t border-border py-6 md:flex-row",
				className,
			)}
			{...props}
		/>
	);
}

function BottomText({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="site-footer-bottom-text"
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export const SiteFooter = {
	Root,
	Columns,
	Brand,
	BrandDescription,
	SocialLinks,
	SocialLink,
	Column,
	ColumnTitle,
	ColumnList,
	ColumnLink,
	Bottom,
	BottomText,
};

export type { SiteFooterSocialLinkProps };
