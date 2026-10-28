import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

interface Props extends React.ComponentProps<"li"> {}

/** Call-to-action cluster pinned to the bottom of the mobile menu. */
export function SiteHeaderMobileActions({ className, ...props }: Props) {
	return (
		<li
			data-slot="site-header-mobile-actions"
			className={cn(
				"mt-auto flex flex-col gap-2 border-t border-border pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]",
				className,
			)}
			{...props}
		/>
	);
}
