import { cn } from "@voila.dev/ui/utils";
import type * as React from "react";

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
