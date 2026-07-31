import { Calendar } from "#/calendar/components/calendar.tsx";
import { DatePickerContent } from "#/date-picker/components/date-picker-content.tsx";
import { DatePickerHiddenInput } from "#/date-picker/components/date-picker-hidden-input.tsx";
import { DatePickerTrigger } from "#/date-picker/components/date-picker-trigger.tsx";
import {
	DEFAULT_DATE_FORMAT,
	formatDateLabel,
} from "#/date-picker/lib/date-picker-format.ts";
import type { DatePickerBase } from "#/date-picker/lib/date-picker-props.ts";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import { Popover } from "#/popover/components/popover.tsx";

interface Props extends DatePickerBase {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	/** Initial selection when uncontrolled. */
	defaultValue?: Date;
	/** Called with the picked day, or `null` when the selection is cleared. */
	onValueChange?: (date: Date | null) => void;
}

export function DatePickerRoot({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date",
	formatOptions = DEFAULT_DATE_FORMAT,
	locale,
	disabled = false,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	variant,
	calendarProps,
	defaultOpen,
	open: controlledOpen,
	onOpenChange,
}: Props) {
	const { isControlled, value, setUncontrolledValue, open, setOpen } =
		usePickerState<Date>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const handleSelect = (date: Date | undefined) => {
		if (!isControlled) setUncontrolledValue(date);
		onValueChange?.(date ?? null);
		// Single selection is complete the moment a day is picked.
		if (date) setOpen(false);
	};

	const selectedDate = value ?? undefined;

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				id={id}
				className={className}
				disabled={disabled}
				empty={!value}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				variant={variant}
			>
				{formatDateLabel(value, locale, formatOptions, placeholder)}
			</DatePickerTrigger>
			<DatePickerHiddenInput name={name} date={value} />
			<DatePickerContent>
				<Calendar.Root
					mode="single"
					selected={selectedDate}
					onSelect={handleSelect}
					defaultMonth={selectedDate}
					locale={locale}
					autoFocus
					{...calendarProps}
				/>
			</DatePickerContent>
		</Popover.Root>
	);
}
