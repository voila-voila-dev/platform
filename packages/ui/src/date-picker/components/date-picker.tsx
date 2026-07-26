import { DatePickerRoot } from "#/date-picker/components/date-picker-root.tsx";
import { DatePickerTrigger } from "#/date-picker/components/date-picker-trigger.tsx";
import { DateRangePicker } from "#/date-picker/components/date-range-picker.tsx";

export type { DateRange } from "react-day-picker";

/**
 * The DatePicker parts as one namespace.
 */
export const DatePicker = {
	Root: DatePickerRoot,
	Range: DateRangePicker,
	Trigger: DatePickerTrigger,
};
