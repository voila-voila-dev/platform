import type * as React from "react";
import {
	parseLocalInputValue,
	toLocalInputValue,
} from "#/date-time-picker/lib/date-time-values.ts";
import { NativeDatePickerDateTime } from "#/native-date-picker/components/native-date-picker-date-time.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDatePickerDateTime>,
		"value" | "defaultValue" | "onChange" | "className" | "wrapperClassName"
	> {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	/** Called with the parsed `Date`, or `null` when the input is emptied. */
	onValueChange?: (date: Date | null) => void;
	/**
	 * Classes for the field's box, so `className` means the same thing here as on
	 * the popover surfaces. The inner `<input>` keeps the kit's field styling;
	 * reach it through `inputClassName` on the rare occasion you must.
	 */
	className?: string;
	/** Classes for the inner `<input>` itself. */
	inputClassName?: string;
}

/**
 * `Date`-valued adapter over the native `<input type="datetime-local">`, so the
 * mobile surface shares the picker family's value model. The native field uses the
 * viewer's local clock, matching {@link DateTimePicker}.
 */
export function NativeDateTimeInput({
	value,
	onValueChange,
	className,
	inputClassName,
	...props
}: Props) {
	return (
		<NativeDatePickerDateTime
			value={value ? toLocalInputValue(value) : ""}
			onChange={(event) =>
				onValueChange?.(parseLocalInputValue(event.target.value))
			}
			className={inputClassName}
			wrapperClassName={className}
			{...props}
		/>
	);
}
