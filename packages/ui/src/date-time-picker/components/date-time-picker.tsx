import { DateTimePickerRoot } from "#/date-time-picker/components/date-time-picker-root.tsx";
import { DateTimeRangeInput } from "#/date-time-picker/components/date-time-range-input.tsx";
import { NativeDateTimeInput } from "#/date-time-picker/components/native-date-time-input.tsx";
import { ResponsiveDateTimeInput } from "#/date-time-picker/components/responsive-date-time-input.tsx";
import { ShiftTimeRangeInput } from "#/date-time-picker/components/shift-time-range-input.tsx";

/**
 * The DateTimePicker parts as one namespace.
 *
 * `Root` is the popover picker; `Native` falls back to the browser control,
 * `Responsive` picks between the two by viewport, and `Range` / `ShiftRange`
 * collect a start and an end.
 */
export const DateTimePicker = {
	Root: DateTimePickerRoot,
	Native: NativeDateTimeInput,
	Range: DateTimeRangeInput,
	Responsive: ResponsiveDateTimeInput,
	ShiftRange: ShiftTimeRangeInput,
};
