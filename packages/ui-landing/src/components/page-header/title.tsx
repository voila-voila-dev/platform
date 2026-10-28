import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Heading } from "#/components/heading.tsx";

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
