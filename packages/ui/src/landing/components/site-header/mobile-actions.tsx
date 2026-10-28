import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"li"> {}

/** Call-to-action cluster closing the mobile menu. */
export function SiteHeaderMobileActions({ className, ...props }: Props) {
	return (
		<li
			data-slot="site-header-mobile-actions"
			className={cn(
				"mt-2 flex flex-col gap-2 border-t border-border pt-4",
				className,
			)}
			{...props}
		/>
	);
}
