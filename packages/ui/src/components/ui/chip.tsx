import { XIcon } from "@phosphor-icons/react";
import type * as React from "react";
import {
	type BadgeVariants,
	badgeVariants,
} from "#/components/ui/badge-variants.ts";

import { cn } from "#/lib/utils.ts";

/**
 * Dismissible tag built on the Badge recipe: same `variant`/`color`/`size`
 * axes, plus a `ChipRemove` button for removable selections (skills catalog,
 * active filters). For a static label, use `Badge` instead.
 */
function Chip({
	className,
	variant = "secondary",
	color,
	size = "default",
	...props
}: React.ComponentProps<"span"> & BadgeVariants) {
	return (
		<span
			data-slot="chip"
			data-variant={variant}
			data-color={color}
			data-size={size}
			className={cn(
				badgeVariants({ variant, color, size }),
				"has-data-[slot=chip-remove]:pr-1",
				size === "sm" && "has-data-[slot=chip-remove]:pr-0.5",
				className,
			)}
			{...props}
		/>
	);
}

function ChipRemove({
	className,
	children,
	...props
}: React.ComponentProps<"button">) {
	return (
		<button
			type="button"
			data-slot="chip-remove"
			aria-label="Remove"
			className={cn(
				"inline-flex size-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-60 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-current/50 [&>svg]:size-2.5",
				className,
			)}
			{...props}
		>
			{children ?? <XIcon aria-hidden />}
		</button>
	);
}

export { Chip, ChipRemove };
