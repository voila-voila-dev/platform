import {
	DateRangeFields,
	type DateRangeFieldsProps,
} from "#/date-picker/components/date-range-fields.tsx";
import { NativeDateInput } from "#/date-picker/components/native-date-input.tsx";

/**
 * A `{ from, to }` range as two native day fields. No browser ships a native
 * range control, so a range on the OS surface is two `<input type="date">`s
 * bound to each other rather than one.
 */
export function NativeDateRangeInput(props: DateRangeFieldsProps) {
	return (
		<DateRangeFields
			{...props}
			Field={NativeDateInput}
			slot="native-date-range-input"
		/>
	);
}
