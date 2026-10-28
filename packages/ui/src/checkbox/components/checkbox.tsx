import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import { cn } from "#/lib/utils.ts";

interface Props extends CheckboxPrimitive.Root.Props {
	size?: "sm" | "default";
}

export function Checkbox({ className, size = "default", ...props }: Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			data-size={size}
			className={cn(
				// after:* expands the touch target 12px horizontally and 8px
				// vertically past the visible box; stacked checkboxes need at
				// least that much spacing or adjacent hit areas overlap.
				"peer group/checkbox relative flex shrink-0 items-center justify-center rounded-sm border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:data-checked:border-destructive aria-invalid:data-indeterminate:border-destructive data-[size=default]:size-4 data-[size=sm]:size-3.5 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground dark:data-indeterminate:bg-primary",
				className,
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="grid animate-in place-content-center text-current duration-150 zoom-in-50 group-data-[size=default]/checkbox:[&>svg]:size-3.5 group-data-[size=sm]/checkbox:[&>svg]:size-3 motion-reduce:animate-none"
			>
				<CheckIcon className="group-data-indeterminate/checkbox:hidden" />
				<MinusIcon className="hidden group-data-indeterminate/checkbox:block" />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}
