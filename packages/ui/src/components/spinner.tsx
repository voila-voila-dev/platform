import { SpinnerGapIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
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

export { Spinner };
