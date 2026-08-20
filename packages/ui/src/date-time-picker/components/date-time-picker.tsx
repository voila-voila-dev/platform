import { DateTimePickerRoot } from "#/date-time-picker/components/date-time-picker-root.tsx";
import { DateTimeRangePicker } from "#/date-time-picker/components/date-time-range-picker.tsx";
import { NativeDateTimeInput } from "#/date-time-picker/components/native-date-time-input.tsx";
import { NativeDateTimeRangeInput } from "#/date-time-picker/components/native-date-time-range-input.tsx";
import { ResponsiveDateTimeInput } from "#/date-time-picker/components/responsive-date-time-input.tsx";
import { ResponsiveDateTimeRangeInput } from "#/date-time-picker/components/responsive-date-time-range-input.tsx";
import { ShiftTimeRangeInput } from "#/date-time-picker/components/shift-time-range-input.tsx";

/**
 * The DateTimePicker parts as one namespace.
 *
 * Three surfaces, one `Date | null` value model, in the shape every picker
 * family here follows: `Root` is the composed popover, `Native` is the OS
 * control, and `Responsive` picks between them at the `useIsMobile` breakpoint.
 * `Range`, `NativeRange` and `ResponsiveRange` are the same three surfaces for
 * a `{ start, end }` range. `ShiftRange` collects a whole shift behind one
 * trigger, where the two ends share a day.
 */
export const DateTimePicker = {
	Root: DateTimePickerRoot,
	Native: NativeDateTimeInput,
	Responsive: ResponsiveDateTimeInput,
	Range: DateTimeRangePicker,
	NativeRange: NativeDateTimeRangeInput,
	ResponsiveRange: ResponsiveDateTimeRangeInput,
	ShiftRange: ShiftTimeRangeInput,
};
