import { Radio as RadioPrimitive } from "@base-ui/react/radio";

import { cn } from "#/lib/utils.ts";

interface Props extends RadioPrimitive.Root.Props {}

export function RadioGroupItem({ className, ...props }: Props) {
	return (
		<RadioPrimitive.Root
			data-slot="radio-group-item"
			className={cn(
				// `transition-colors` keeps the border/background from snapping when an
				// item becomes (un)checked. The trailing `dark:data-checked:bg-primary`
				// duplicates `data-checked:bg-primary` on purpose: in dark mode the
				// unchecked `dark:bg-input/30` fill would otherwise win the
				// tailwind-merge order once checked, so the dark override must come
				// last. (Same idiom as checkbox.tsx.)
				"group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
				className,
			)}
			{...props}
		>
			<RadioPrimitive.Indicator
				data-slot="radio-group-indicator"
				// The indicator unmounts when unchecked, so it animates in on selection;
				// `data-checked` is present whenever it is mounted.
				className="flex size-4 items-center justify-center data-checked:animate-in data-checked:zoom-in-50 motion-reduce:animate-none"
			>
				<span className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground" />
			</RadioPrimitive.Indicator>
		</RadioPrimitive.Root>
	);
}
