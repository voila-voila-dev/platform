import type { DateRange } from "react-day-picker";
import { Calendar } from "#/calendar/components/calendar.tsx";
import { DatePickerContent } from "#/date-picker/components/date-picker-content.tsx";
import { DatePickerTrigger } from "#/date-picker/components/date-picker-trigger.tsx";
import { DateRangePickerHiddenInputs } from "#/date-picker/components/date-range-picker-hidden-inputs.tsx";
import {
	DEFAULT_DATE_FORMAT,
	formatDateRangeLabel,
} from "#/date-picker/lib/date-picker-format.ts";
import type { DatePickerBase } from "#/date-picker/lib/date-picker-props.ts";
import { usePickerState } from "#/hooks/use-picker-state.ts";
import { cn } from "#/lib/utils.ts";
import { Popover } from "#/popover/components/popover.tsx";

// A range is complete once both ends differ; the first click yields
// from === to, which must keep the popover open for the second click.
function isRangeSelectionComplete(range: DateRange | undefined): boolean {
	if (!range?.from || !range.to) {
		return false;
	}
	return range.from.getTime() !== range.to.getTime();
}

interface Props extends DatePickerBase {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: DateRange | null;
	defaultValue?: DateRange;
	onValueChange?: (range: DateRange | null) => void;
}

export function DateRangePicker({
	value: controlledValue,
	defaultValue,
	onValueChange,
	placeholder = "Pick a date range",
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
		usePickerState<DateRange>({
			value: controlledValue,
			defaultValue,
			open: controlledOpen,
			defaultOpen,
			onOpenChange,
		});

	const handleSelect = (range: DateRange | undefined) => {
		if (!isControlled) setUncontrolledValue(range);
		onValueChange?.(range ?? null);
		if (isRangeSelectionComplete(range)) {
			setOpen(false);
		}
	};

	const selectedRange = value ?? undefined;

	return (
		<Popover.Root open={open} onOpenChange={setOpen}>
			<DatePickerTrigger
				id={id}
				className={cn("min-w-64", className)}
				disabled={disabled}
				empty={!value?.from}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				variant={variant}
			>
				{formatDateRangeLabel(value, locale, formatOptions, placeholder)}
			</DatePickerTrigger>
			<DateRangePickerHiddenInputs name={name} value={value} />
			<DatePickerContent>
				<Calendar.Root
					mode="range"
					numberOfMonths={2}
					selected={selectedRange}
					onSelect={handleSelect}
					defaultMonth={selectedRange?.from}
					locale={locale}
					autoFocus
					{...calendarProps}
				/>
			</DatePickerContent>
		</Popover.Root>
	);
}
