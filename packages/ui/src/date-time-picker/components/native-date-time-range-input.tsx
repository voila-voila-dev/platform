import {
	DateTimeRangeFields,
	type DateTimeRangeFieldsProps,
	type InstantField,
} from "#/date-time-picker/components/date-time-range-fields.tsx";
import { NativeDateTimeInput } from "#/date-time-picker/components/native-date-time-input.tsx";

// The native control has no calendar to configure, no time list to step, and
// formats itself from the OS locale — so the layout's presentation props stop
// here rather than reaching a DOM element that would reject them.
const NativeField: InstantField = ({
	locale: _locale,
	minuteStep: _minuteStep,
	formatOptions: _formatOptions,
	calendarProps: _calendarProps,
	placeholder: _placeholder,
	...props
}) => <NativeDateTimeInput {...props} className="w-full min-w-0" />;

/**
 * A `{ start, end }` range as two native instant fields — the OS surface of
 * {@link DateTimePicker.Range}, for the screens that want the system picker on
 * every viewport rather than only under the mobile breakpoint.
 */
export function NativeDateTimeRangeInput(props: DateTimeRangeFieldsProps) {
	return (
		<DateTimeRangeFields
			{...props}
			Field={NativeField}
			slot="native-date-time-range-input"
		/>
	);
}
