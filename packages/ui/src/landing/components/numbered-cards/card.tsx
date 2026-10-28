import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function NumberedCard({ className, ...props }: Props) {
	return (
		<div
			data-slot="numbered-cards-card"
			className={cn(
				"animate-fade-up relative rounded-2xl border border-border bg-card p-8",
				className,
			)}
			{...props}
		/>
	);
}
