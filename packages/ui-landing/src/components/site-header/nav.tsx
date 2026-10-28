import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { useContext } from "react";
import {
	collapseBreakpoints,
	SiteHeaderContext,
} from "#/components/site-header/context/site-header-context.ts";

interface Props extends React.ComponentProps<"div"> {}

/** Desktop-only nav area: link list + call-to-action cluster. */
export function SiteHeaderNav({ className, ...props }: Props) {
	const { collapseBelow } = useContext(SiteHeaderContext);
	return (
		<div
			data-slot="site-header-nav"
			className={cn(
				"hidden items-center gap-8",
				collapseBreakpoints[collapseBelow].nav,
				className,
			)}
			{...props}
		/>
	);
}
