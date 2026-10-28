import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "#/lib/utils.ts";

interface Props extends InputPrimitive.Props {}

export function Input({ className, ...props }: Props) {
	return (
		<InputPrimitive
			data-slot="input"
			className={cn(
				// `text-base` then `md:text-sm` is an iOS zoom guard: Safari auto-zooms
				// a focused field whose font is < 16px, so we ship 16px on small screens
				// and drop to 14px from `md` up.
				"h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				className,
			)}
			{...props}
		/>
	);
}
