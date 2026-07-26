import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";

interface Props
	extends Pick<React.ComponentProps<typeof Button>, "size" | "variant">,
		React.ComponentProps<"a"> {
	isActive?: boolean;
	/**
	 * Render the link as non-interactive (e.g. Previous on the first page):
	 * `aria-disabled`, removed from the tab order, and dimmed. Maps to the kit's
	 * `aria-disabled:` styling idiom rather than a dead `href`.
	 */
	isDisabled?: boolean;
}

export function PaginationLink({
	className,
	isActive,
	isDisabled,
	size = "icon",
	variant,
	...props
}: Props) {
	return (
		<Button
			// `variant` overrides the active/inactive default so consumers can opt
			// into e.g. a `secondary` active page without re-implementing the link.
			variant={variant ?? (isActive ? "outline" : "ghost")}
			size={size}
			className={cn(
				"aria-disabled:pointer-events-none aria-disabled:opacity-50",
				className,
			)}
			nativeButton={false}
			render={
				<a
					data-slot="pagination-link"
					data-active={isActive}
					aria-current={isActive ? "page" : undefined}
					{...props}
					aria-disabled={isDisabled || undefined}
					tabIndex={isDisabled ? -1 : props.tabIndex}
				/>
			}
		/>
	);
}
