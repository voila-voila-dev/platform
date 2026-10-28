import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";
import { Heading } from "#/components/heading.tsx";

interface Props extends React.ComponentProps<typeof Heading> {}

export function CtaBannerTitle({ className, ...props }: Props) {
	return (
		<Heading
			data-slot="cta-banner-title"
			level="h2"
			align="center"
			className={cn("mb-4 text-white", className)}
			{...props}
		/>
	);
}
