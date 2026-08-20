import {
	DateTimeRangeFields,
	type DateTimeRangeFieldsProps,
} from "#/date-time-picker/components/date-time-range-fields.tsx";
import { ResponsiveDateTimeInput } from "#/date-time-picker/components/responsive-date-time-input.tsx";

/**
 * A `{ start, end }` range as two fields that each pick their own surface: the
 * popover calendar and time list on desktop, the OS picker on mobile.
 */
export function ResponsiveDateTimeRangeInput(props: DateTimeRangeFieldsProps) {
	return (
		<DateTimeRangeFields
			{...props}
			Field={ResponsiveDateTimeInput}
			slot="responsive-date-time-range-input"
		/>
	);
}
