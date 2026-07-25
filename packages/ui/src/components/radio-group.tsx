import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { CheckCircleIcon } from "@phosphor-icons/react";

import { cn } from "#/lib/utils.ts";

type RadioGroupProps = RadioGroupPrimitive.Props & {
	/**
	 * Layout direction of the items. `vertical` stacks them (the default);
	 * `horizontal` lays them out in a wrapping row - saves consumers from
	 * rebuilding a `flex-row` wrapper for short option sets.
	 */
	orientation?: "vertical" | "horizontal";
};

function RadioGroup({
	className,
	orientation = "vertical",
	...props
}: RadioGroupProps) {
	return (
		<RadioGroupPrimitive
			data-slot="radio-group"
			data-orientation={orientation}
			className={cn(
				orientation === "horizontal"
					? "flex flex-wrap items-center gap-x-4 gap-y-2"
					: "grid gap-2",
				className,
			)}
			{...props}
		/>
	);
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
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

type RadioGroupCardProps = RadioPrimitive.Root.Props & {
	/** Hide the checked-corner icon when the card's own content marks selection. */
	showIndicator?: boolean;
};

/**
 * "Choice card" alternative to `RadioGroupItem` - a bordered selectable card
 * for plan/role pickers. Children are free-form (title, description, price,
 * ...); the checked state reads as a primary border plus a corner icon. Base
 * UI renders the card as a `<button>`, so don't nest interactive elements.
 */
function RadioGroupCard({
	className,
	children,
	showIndicator = true,
	...props
}: RadioGroupCardProps) {
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

export {
	RadioGroup,
	RadioGroupCard,
	type RadioGroupCardProps,
	RadioGroupItem,
	type RadioGroupProps,
};
