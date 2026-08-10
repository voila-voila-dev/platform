import { Calendar } from "#/calendar/components/calendar.tsx";
import { ShiftTimeList } from "#/date-time-picker/components/shift-time-list.tsx";
import { useTimeOptions } from "#/date-time-picker/hooks/use-time-options.ts";
import type { DateTimeRange } from "#/date-time-picker/lib/date-time-range.ts";
import {
	endLabelText,
	isShiftTimeDisabled,
	type ShiftStep,
	shiftActiveSelection,
	shiftCalendarDefaultMonth,
	shiftCalendarDisabled,
	startLabelText,
} from "#/date-time-picker/lib/shift-time-range.ts";

interface Props {
	range: DateTimeRange;
	step: ShiftStep;
	locale: string | undefined;
	minuteStep: number;
	onDaySelect: (day: Date | undefined) => void;
	onTimeSelect: (minutes: number) => void;
}

/** The active step's calendar beside its time column. */
export function ShiftPickerBody({
	range,
	step,
	locale,
	minuteStep,
	onDaySelect,
	onTimeSelect,
}: Props) {
	const timeOptions = useTimeOptions(minuteStep);
	const { activeDay, activeMinutes } = shiftActiveSelection(range, step);

	return (
		<div data-slot="shift-picker-body" className="flex flex-col sm:flex-row">
			<Calendar.Root
				mode="single"
				selected={activeDay ?? undefined}
				onSelect={onDaySelect}
				defaultMonth={shiftCalendarDefaultMonth(activeDay, range)}
				locale={locale}
				disabled={shiftCalendarDisabled(range, step)}
				autoFocus
				// The popover spans the viewport on mobile; a fit-width calendar
				// would hug the left edge and leave the rest of the row empty.
				className="w-full sm:w-fit"
			/>
			{/* The time column stretches to the calendar's exact height (its scroll
			    list is absolutely positioned on desktop so it never grows the row),
			    so the divider spans cleanly with no dangling border. */}
			<div className="relative w-full border-t sm:w-40 sm:border-t-0 sm:border-l">
				<ShiftTimeList
					options={timeOptions}
					selectedMinutes={activeMinutes}
					isDisabled={(minutes) =>
						isShiftTimeDisabled({ minutes, step, range, activeDay })
					}
					onSelect={onTimeSelect}
					locale={locale}
					ariaLabel={
						step === "start" ? startLabelText(locale) : endLabelText(locale)
					}
				/>
			</div>
		</div>
	);
}
