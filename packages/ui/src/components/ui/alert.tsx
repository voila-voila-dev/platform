import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { buttonVariants } from "#/components/ui/button-variants.ts";
import { cva, type VariantProps } from "#/lib/cva.ts";

import { cn, proseLinkClassName } from "#/lib/utils.ts";

const alertVariants = cva({
	base: "group/alert relative grid w-full grid-cols-1 gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 has-data-[slot=alert-action]:grid-cols-[1fr_auto] has-data-[slot=alert-action]:gap-x-2 has-[>svg]:has-data-[slot=alert-action]:grid-cols-[auto_1fr_auto] *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
	variants: {
		variant: {
			default: "bg-card text-card-foreground",
			destructive:
				"bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
			success:
				"bg-card text-success *:data-[slot=alert-description]:text-success/90 *:[svg]:text-current",
			warning:
				"bg-card text-warning *:data-[slot=alert-description]:text-warning/90 *:[svg]:text-current",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-title"
			className={cn(
				"font-medium group-has-[>svg]/alert:col-start-2",
				proseLinkClassName,
				className,
			)}
			{...props}
		/>
	);
}

function AlertDescription({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				"text-sm text-balance text-muted-foreground md:text-pretty [&_p:not(:last-child)]:mb-4",
				proseLinkClassName,
				className,
			)}
			{...props}
		/>
	);
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="alert-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-center group-has-[>svg]/alert:col-start-3",
				className,
			)}
			{...props}
		/>
	);
}

function AlertClose({ className, ...props }: React.ComponentProps<"button">) {
	return (
		<AlertAction>
			<button
				type="button"
				data-slot="alert-close"
				aria-label="Dismiss"
				className={cn(
					buttonVariants({ variant: "ghost", size: "icon-xs" }),
					"text-muted-foreground",
					className,
				)}
				{...props}
			>
				<XIcon />
			</button>
		</AlertAction>
	);
}

export { Alert, AlertAction, AlertClose, AlertDescription, AlertTitle };
