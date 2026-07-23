import { cva, type VariantProps } from "#/lib/cva.ts";

import { cn } from "#/lib/utils.ts";

type EmptyProps = React.ComponentProps<"div"> & {
	bordered?: boolean;
};

function Empty({ className, bordered = false, ...props }: EmptyProps) {
	return (
		<div
			data-slot="empty"
			data-bordered={bordered || undefined}
			className={cn(
				"flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl p-6 text-center text-balance",
				bordered && "border border-dashed",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-header"
			className={cn("flex max-w-sm flex-col items-center gap-2", className)}
			{...props}
		/>
	);
}

const emptyMediaVariants = cva({
	base: "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
	variants: {
		variant: {
			default: "bg-transparent",
			icon: "rounded-lg bg-muted text-foreground",
		},
		size: {
			sm: "",
			default: "",
			lg: "",
		},
	},
	compoundVariants: [
		{
			variant: "icon",
			size: "sm",
			className: "size-6 [&_svg:not([class*='size-'])]:size-3.5",
		},
		{
			variant: "icon",
			size: "default",
			className: "size-8 [&_svg:not([class*='size-'])]:size-4",
		},
		{
			variant: "icon",
			size: "lg",
			className: "size-10 [&_svg:not([class*='size-'])]:size-6",
		},
	],
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

function EmptyMedia({
	className,
	variant = "default",
	size = "default",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof emptyMediaVariants>) {
	return (
		<div
			data-slot="empty-media"
			data-variant={variant}
			data-size={size}
			className={cn(emptyMediaVariants({ variant, size }), className)}
			{...props}
		/>
	);
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"h3">) {
	return (
		<h3
			data-slot="empty-title"
			className={cn("text-sm font-medium tracking-tight", className)}
			{...props}
		/>
	);
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
	return (
		<p
			data-slot="empty-description"
			className={cn(
				"text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
				className,
			)}
			{...props}
		/>
	);
}

function EmptyContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="empty-content"
			className={cn(
				"flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
				className,
			)}
			{...props}
		/>
	);
}

export {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	type EmptyProps,
	EmptyTitle,
};
