import { CalendarBlankIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";
import { Popover } from "#/popover/components/popover.tsx";

interface Props extends React.ComponentProps<typeof Button> {
	empty: boolean;
	icon?: React.ReactNode;
	/** Base for the part's `data-slot` attribute; not the DOM `slot`. */
	slotName?: string;
}

/**
 * The shared input-look trigger for the popover pickers (DatePicker,
 * DateRangePicker, TimePicker): leading icon + label or muted placeholder.
 */
export function DatePickerTrigger({
	className,
	empty,
	children,
	// An explicit `variant: undefined` in the spread would override the inner
	// Button's JSX default, so the fallback must live here.
	variant = "outline",
	icon = (
		<CalendarBlankIcon className="size-4 shrink-0 text-muted-foreground" />
	),
	slotName = "date-picker-trigger",
	...props
}: Props) {
	return (
		<Popover.Trigger
			data-slot={slotName}
			data-empty={empty || undefined}
			render={
				<Button
					variant={variant}
					className={cn(
						"min-w-48 justify-start text-start font-normal data-empty:text-muted-foreground",
						className,
					)}
					{...props}
				/>
			}
		>
			{icon}
			<span className="truncate">{children}</span>
		</Popover.Trigger>
	);
}
