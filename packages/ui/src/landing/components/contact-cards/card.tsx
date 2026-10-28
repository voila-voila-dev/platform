import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {}

export function ContactCard({ className, ...props }: Props) {
	return (
		<div
			data-slot="contact-card"
			className={cn("rounded-2xl border border-border p-8", className)}
			{...props}
		/>
	);
}
