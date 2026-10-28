import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { CheckCircleIcon } from "@phosphor-icons/react";

import { cn } from "#/lib/utils.ts";

interface Props extends RadioPrimitive.Root.Props {
	/** Hide the checked-corner icon when the card's own content marks selection. */
	showIndicator?: boolean;
}

/**
 * "Choice card" alternative to `RadioGroup.Item` - a bordered selectable card
 * for plan/role pickers. Children are free-form (title, description, price,
 * ...); the checked state reads as a primary border plus a corner icon. Base
 * UI renders the card as a `<button>`, so don't nest interactive elements.
 */
export function RadioGroupCard({
	className,
	children,
	showIndicator = true,
	...props
}: Props) {
	return (
		<RadioPrimitive.Root
			data-slot="radio-group-card"
			className={cn(
				// `transition-colors` for the same no-snap reason as RadioGroupItem;
				// the checked border doubles as a ring so the 1px border change does
				// not shift the layout.
				"relative flex flex-col items-start gap-1 rounded-lg border border-input p-4 text-start text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-disabled:cursor-not-allowed data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-checked:border-primary data-checked:ring-1 data-checked:ring-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				showIndicator && "pr-9",
				className,
			)}
			{...props}
		>
			{children}
			{showIndicator && (
				<RadioPrimitive.Indicator
					data-slot="radio-group-card-indicator"
					// Unmounts when unchecked, so it animates in on selection (same
					// idiom as RadioGroupItem's dot).
					className="absolute top-3 right-3 flex data-checked:animate-in data-checked:zoom-in-50 motion-reduce:animate-none"
				>
					<CheckCircleIcon weight="fill" className="size-4.5 text-primary" />
				</RadioPrimitive.Indicator>
			)}
		</RadioPrimitive.Root>
	);
}
