import type * as React from "react";
import { NativeDatePickerTime } from "#/native-date-picker/components/native-date-picker-time.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDatePickerTime>,
		"value" | "defaultValue" | "onChange" | "className" | "wrapperClassName"
	> {
	/** Controlled `"HH:mm"` value; pass `null` for a controlled empty selection. */
	value?: string | null;
	/** Called with the picked `"HH:mm"`, or `null` when the field is emptied. */
	onValueChange?: (time: string | null) => void;
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
 * `"HH:mm"`-valued adapter over the native `<input type="time">`, so the OS
 * surface speaks the same value model as {@link TimePicker.Root} — a time of
 * day, never a `Date`, because a time without a date is not an instant.
 */
export function NativeTimeInput({
	value,
	onValueChange,
	className,
	inputClassName,
	...props
}: Props) {
	return (
		<NativeDatePickerTime
			value={value ?? ""}
			onChange={(event) => onValueChange?.(event.target.value || null)}
			className={inputClassName}
			wrapperClassName={className}
			{...props}
		/>
	);
}
