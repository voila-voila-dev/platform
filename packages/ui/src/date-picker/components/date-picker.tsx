import { DatePickerRoot } from "#/date-picker/components/date-picker-root.tsx";
import { DatePickerTrigger } from "#/date-picker/components/date-picker-trigger.tsx";
import { DateRangePicker } from "#/date-picker/components/date-range-picker.tsx";
import { NativeDateInput } from "#/date-picker/components/native-date-input.tsx";
import { NativeDateRangeInput } from "#/date-picker/components/native-date-range-input.tsx";
import { ResponsiveDateInput } from "#/date-picker/components/responsive-date-input.tsx";
import { ResponsiveDateRangeInput } from "#/date-picker/components/responsive-date-range-input.tsx";

export type { DateRange } from "react-day-picker";

/**
 * The DatePicker parts as one namespace.
 *
 * Three surfaces, one `Date | null` value model, in the shape every picker
 * family here follows: `Root` is the composed popover, `Native` is the OS
 * control, and `Responsive` picks between them at the `useIsMobile` breakpoint.
 * `Range`, `NativeRange` and `ResponsiveRange` are the same three surfaces for
 * a `{ from, to }` range.
 */
export const DatePicker = {
	Root: DatePickerRoot,
	Native: NativeDateInput,
	Responsive: ResponsiveDateInput,
	Range: DateRangePicker,
	NativeRange: NativeDateRangeInput,
	ResponsiveRange: ResponsiveDateRangeInput,
	Trigger: DatePickerTrigger,
};
