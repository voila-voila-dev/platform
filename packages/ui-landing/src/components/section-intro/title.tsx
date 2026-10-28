import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Heading } from "#/components/heading.tsx";

interface Props extends React.ComponentProps<typeof Heading> {}

export function SectionIntroTitle({ className, ...props }: Props) {
	return (
		<Heading
			data-slot="section-intro-title"
			level="h2"
			align="center"
			className={cn("mb-4", className)}
			{...props}
		/>
	);
}
