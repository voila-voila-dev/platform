import { DateTimePickerRoot } from "#/date-time-picker/components/date-time-picker-root.tsx";
import {
	DateTimeRangeFields,
	type DateTimeRangeFieldsProps,
} from "#/date-time-picker/components/date-time-range-fields.tsx";

/**
 * A `{ start, end }` range as two popover instant fields — our own calendar and
 * time list on every viewport, for the surfaces that must look identical
 * everywhere (a print preview, a screenshot fixture, an embedded kiosk).
 * Prefer {@link DateTimePicker.ResponsiveRange} on anything a phone will open.
 */
export function DateTimeRangePicker(props: DateTimeRangeFieldsProps) {
	return (
		<DateTimeRangeFields
			{...props}
			Field={DateTimePickerRoot}
			slot="date-time-range-picker"
		/>
	);
}
