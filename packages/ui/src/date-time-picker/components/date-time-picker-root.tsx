import { CalendarDotsIcon } from "@phosphor-icons/react";
import type * as React from "react";
import type { Button } from "#/button/components/button.tsx";
import { Calendar } from "#/calendar/components/calendar.tsx";
import { DatePicker } from "#/date-picker/components/date-picker.tsx";
import { DateTimeHiddenInput } from "#/date-time-picker/components/date-time-hidden-input.tsx";
import { DateTimeOptionList } from "#/date-time-picker/components/date-time-option-list.tsx";
import { useTimeOptions } from "#/date-time-picker/hooks/use-time-options.ts";
import type { DateTimeShared } from "#/date-time-picker/lib/date-time-picker-props.ts";
import {
	createDateTimeSelectionHandlers,
	dateTimeTriggerLabel,
} from "#/date-time-picker/lib/date-time-picker-selection.ts";
import { DEFAULT_DATE_TIME_FORMAT } from "#/date-time-picker/lib/date-time-values.ts";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import { minutesOfDay } from "#/lib/time-math.ts";
import { Popover } from "#/popover/components/popover.tsx";

interface Props extends DateTimeShared {
	/**
	 * `Intl.DateTimeFormat` options for the trigger label. Defaults to
	 * `{ dateStyle: "medium", timeStyle: "short" }` (e.g. "Jun 20, 2026, 2:30 PM").
	 */
	formatOptions?: Intl.DateTimeFormatOptions;
	variant?: React.ComponentProps<typeof Button>["variant"];
	/** Escape hatch for the underlying Calendar (disabled days, week numbers…). */
	calendarProps?: Omit<
		React.ComponentProps<typeof Calendar.Root>,
		"mode" | "selected" | "onSelect" | "locale"
	>;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

/**
 * Composed date + time picker built on the kit's Base UI `Popover` and `Calendar`:
 * the calendar sets the day, a scrollable list sets the time, and the trigger shows
 * the combined, localized datetime. Controlled or uncontrolled, like `DatePicker`.
 */
export function DateTimePickerRoot({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date and time",
	formatOptions = DEFAULT_DATE_TIME_FORMAT,
	locale,
	name,
	"aria-label": ariaLabel,
	minuteStep = 30,
	calendarProps,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
	...triggerProps
}: Props) {
	const { isControlled, value, setUncontrolledValue, open, setOpen } =
		usePickerState<Date>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const { handleDaySelect, handleTimeSelect } = createDateTimeSelectionHandlers(
		{ isControlled, value, setUncontrolledValue, setOpen, onValueChange },
	);

	const options = useTimeOptions(minuteStep);

	const selectedMinutes = value ? minutesOfDay(value) : null;
	const selectedDay = value ?? undefined;

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<DatePicker.Trigger
				slotName="date-time-picker-trigger"
				icon={
					<CalendarDotsIcon className="size-4 shrink-0 text-muted-foreground" />
				}
				empty={!value}
				aria-label={ariaLabel}
				{...triggerProps}
			>
				{dateTimeTriggerLabel(value, locale, formatOptions, placeholder)}
			</DatePicker.Trigger>
			<DateTimeHiddenInput name={name} value={value} />
			<Popover.Content
				data-slot="date-time-picker-content"
				className="w-auto p-0"
				align="start"
			>
				<div className="flex">
					<Calendar.Root
						mode="single"
						selected={selectedDay}
						onSelect={handleDaySelect}
						defaultMonth={selectedDay}
						locale={locale}
						autoFocus
						{...calendarProps}
					/>
					<DateTimeOptionList
						options={options}
						selectedMinutes={selectedMinutes}
						locale={locale}
						ariaLabel={ariaLabel ?? placeholder}
						onSelect={handleTimeSelect}
					/>
				</div>
			</Popover.Content>
		</Popover.Root>
	);
}
