import { SpinnerGapIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"svg"> {}

export function Spinner({ className, ...props }: Props) {
	return (
		<SpinnerGapIcon
			data-slot="spinner"
			role="status"
			aria-label="Loading"
			className={cn(
				"size-4 animate-spin motion-reduce:animate-[spin_3s_linear_infinite]",
				className,
			)}
			{...props}
		/>
	);
}
