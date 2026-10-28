import type * as React from "react";
import { Text } from "#/landing/components/text.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Text> {}

export function CtaBannerDescription({ className, ...props }: Props) {
	return (
		<Text
			data-slot="cta-banner-description"
			className={cn("mb-8 text-lg text-white/90", className)}
			{...props}
		/>
	);
}
