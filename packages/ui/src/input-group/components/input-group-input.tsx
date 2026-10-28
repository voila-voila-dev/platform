import type * as React from "react";
import { Input } from "#/input/components/input.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<typeof Input> {}

export function InputGroupInput({ className, ...props }: Props) {
	return (
		<Input
			data-slot="input-group-control"
			className={cn(
				"flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
				className,
			)}
			{...props}
		/>
	);
}
