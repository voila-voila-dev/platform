import type * as React from "react";
import { fromIsoDay, toIsoDay } from "#/date-picker/lib/date-values.ts";
import { NativeDatePickerDate } from "#/native-date-picker/components/native-date-picker-date.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDatePickerDate>,
		| "value"
		| "defaultValue"
		| "onChange"
		| "min"
		| "max"
		| "className"
		| "wrapperClassName"
	> {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	/** Called with the picked day, or `null` when the field is emptied. */
	onValueChange?: (date: Date | null) => void;
	/** Earliest selectable day. */
	min?: Date;
	/** Latest selectable day. */
	max?: Date;
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
 * `Date`-valued adapter over the native `<input type="date">`, so every surface
 * in the picker family speaks one value model and callers never handle day
 * strings. The field reads the viewer's local clock, matching {@link DatePicker}.
 */
export function NativeDateInput({
	value,
	onValueChange,
	min,
	max,
	className,
	inputClassName,
	...props
}: Props) {
	return (
		<NativeDatePickerDate
			value={toIsoDay(value)}
			min={min ? toIsoDay(min) : undefined}
			max={max ? toIsoDay(max) : undefined}
			onChange={(event) => onValueChange?.(fromIsoDay(event.target.value))}
			className={inputClassName}
			wrapperClassName={className}
			{...props}
		/>
	);
}
