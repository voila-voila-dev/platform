import { NativeDatePickerDate } from "#/native-date-picker/components/native-date-picker-date.tsx";
import { NativeDatePickerDateTime } from "#/native-date-picker/components/native-date-picker-date-time.tsx";
import { NativeDatePickerTime } from "#/native-date-picker/components/native-date-picker-time.tsx";

/**
 * The NativeDatePicker parts as one namespace.
 */
export const NativeDatePicker = {
	Date: NativeDatePickerDate,
	DateTime: NativeDatePickerDateTime,
	Time: NativeDatePickerTime,
};
