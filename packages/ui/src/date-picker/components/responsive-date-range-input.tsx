import {
	DateRangeFields,
	type DateRangeFieldsProps,
} from "#/date-picker/components/date-range-fields.tsx";
import { ResponsiveDateInput } from "#/date-picker/components/responsive-date-input.tsx";

/**
 * A `{ from, to }` range as two fields that each pick their own surface: the
 * popover calendar on desktop, the OS picker on mobile.
 *
 * Two bound fields rather than the single two-month
 * {@link DatePicker.Range} popover, because that popover is the one surface
 * with no mobile answer — two months of day cells do not fit a phone, and the
 * OS has no range control to fall back to.
 */
export function ResponsiveDateRangeInput(props: DateRangeFieldsProps) {
	return (
		<DateRangeFields
			{...props}
			Field={ResponsiveDateInput}
			slot="responsive-date-range-input"
		/>
	);
}
