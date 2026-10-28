import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";

// `onSelect` is omitted from the base: React declares it on every element as
// the text-selection handler.
interface Props extends Omit<React.ComponentProps<typeof Button>, "onSelect"> {
	time: string;
	label: string;
	selected: boolean;
	onSelect: (time: string) => void;
}

export function TimePickerOption({
	time,
	label,
	selected,
	onSelect,
	ref,
	className,
	...props
}: Props) {
	return (
		<Button
			role="option"
			aria-selected={selected}
			data-selected={selected || undefined}
			variant="ghost"
			size="sm"
			data-slot="time-picker-option"
			className={cn(
				"shrink-0 justify-center font-normal data-selected:bg-primary data-selected:text-primary-foreground data-selected:hover:bg-primary data-selected:hover:text-primary-foreground",
				className,
			)}
			ref={selected ? ref : undefined}
			onClick={() => onSelect(time)}
			{...props}
		>
			{label}
		</Button>
	);
}
