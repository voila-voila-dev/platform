import type * as React from "react";
import {
	parseLocalInputValue,
	toLocalInputValue,
} from "#/date-time-picker/lib/date-time-values.ts";
import { NativeDatePickerDateTime } from "#/native-date-picker/components/native-date-picker-date-time.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDatePickerDateTime>,
		"value" | "defaultValue" | "onChange"
	> {
	value?: Date | null;
	onValueChange?: (date: Date | null) => void;
}

/**
 * `Date`-valued adapter over the native `<input type="datetime-local">`, so the
 * mobile surface shares the picker family's value model. The native field uses the
 * viewer's local clock, matching {@link DateTimePicker}.
 */
export function NativeDateTimeInput({ value, onValueChange, ...props }: Props) {
	return (
		<NativeDatePickerDateTime
			value={value ? toLocalInputValue(value) : ""}
			onChange={(event) =>
				onValueChange?.(parseLocalInputValue(event.target.value))
			}
			{...props}
		/>
	);
}
