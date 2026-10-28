import type * as React from "react";

import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"thead"> {}

export function TableHeader({ className, ...props }: Props) {
	return (
		<thead
			data-slot="table-header"
			className={cn("[&_tr]:border-b", className)}
			{...props}
		/>
	);
}
