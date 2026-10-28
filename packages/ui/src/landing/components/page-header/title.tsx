import type * as React from "react";
import { Heading } from "#/landing/components/heading.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Heading> {}

export function PageHeaderTitle({ className, ...props }: Props) {
	return (
		<Heading
			data-slot="page-header-title"
			level="h1"
			className={cn("mb-4", className)}
			{...props}
		/>
	);
}
