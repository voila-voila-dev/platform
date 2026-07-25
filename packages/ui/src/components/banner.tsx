import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cva, type VariantProps } from "#/lib/cva.ts";

import { cn } from "#/lib/utils.ts";

const bannerVariants = cva({
	base: "group/banner relative flex w-full items-center gap-3 px-4 py-2.5 text-sm has-data-[slot=banner-close]:pr-12 md:px-6 [&>svg]:shrink-0 [&>svg:not([class*='size-'])]:size-4",
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground",
			muted: "bg-muted text-foreground",
			success: "bg-success text-success-foreground",
			warning: "bg-warning text-warning-foreground",
			destructive: "bg-destructive text-destructive-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

/**
 * Page-level announcement bar spanning the full width of its container
 * (release notes, maintenance windows, billing reminders). Unlike `Alert`,
 * which sits inline within the content flow, a Banner is pinned at the top of
 * a page or layout and uses solid semantic backgrounds.
 */
function Banner({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof bannerVariants>) {
	return (
		<div
			data-slot="banner"
			role="status"
			className={cn(bannerVariants({ variant }), className)}
			{...props}
		/>
	);
}

function BannerTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="banner-title"
			className={cn(
				"flex-1 font-medium text-balance [&_a]:underline [&_a]:underline-offset-4",
				className,
			)}
			{...props}
		/>
	);
}

function BannerAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="banner-action"
			className={cn("flex shrink-0 items-center gap-2", className)}
			{...props}
		/>
	);
}

function BannerClose({ className, ...props }: React.ComponentProps<"button">) {
	return (
		<button
			type="button"
			data-slot="banner-close"
			aria-label="Dismiss"
			className={cn(
				"absolute top-1/2 right-3 inline-flex size-6 shrink-0 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md opacity-70 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&>svg]:size-4",
				className,
			)}
			{...props}
		>
			<XIcon aria-hidden />
		</button>
	);
}

export { Banner, BannerAction, BannerClose, BannerTitle, bannerVariants };
