import { CheckIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { FilterOption } from "#/filter/types.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"button"> {
	option: FilterOption;
	selected: boolean;
	onToggle: () => void;
}

/**
 * One option, as a toggle. Options are pressable pills rather than a dropdown:
 * the whole choice set stays visible while you build a filter, which is what
 * makes multi-select legible — and a pill is the same target size on a phone as
 * a native option row, without the modal picker's round trip.
 */
export function OptionToggle({
	option,
	selected,
	onToggle,
	className,
	...props
}: Props) {
	return (
		<button
			type="button"
			role="option"
			data-slot="filter-option-toggle"
			aria-selected={selected}
			onClick={onToggle}
			className={cn(
				"inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors",
				"focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2",
				selected
					? "border-primary bg-primary text-primary-foreground"
					: "border-input bg-background text-foreground hover:bg-accent",
				className,
			)}
			{...props}
		>
			{selected && <CheckIcon weight="bold" className="size-3.5 shrink-0" />}
			{option.icon}
			{option.label}
		</button>
	);
}
