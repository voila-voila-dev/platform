import type * as React from "react";
import { DateTimePickerRoot } from "#/date-time-picker/components/date-time-picker-root.tsx";
import { NativeDateTimeInput } from "#/date-time-picker/components/native-date-time-input.tsx";
import type { DateTimeShared } from "#/date-time-picker/lib/date-time-picker-props.ts";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends DateTimeShared {
	/** `Intl.DateTimeFormat` options for the desktop trigger label. */
	formatOptions?: Intl.DateTimeFormatOptions;
	/** Escape hatch for the desktop Calendar. Ignored on the native surface. */
	calendarProps?: React.ComponentProps<
		typeof DateTimePickerRoot
	>["calendarProps"];
	/** Min selectable time on the native input, `HH:mm`. */
	min?: string;
	/** Max selectable time on the native input, `HH:mm`. */
	max?: string;
}

/**
 * The datetime equivalent of `ResponsiveSelect`: the Base UI {@link DateTimePickerRoot}
 * on desktop and the native {@link NativeDateTimeInput} under the `useIsMobile`
 * breakpoint, behind one `Date | null` value API. Both surfaces fill their
 * container width by default (override via `className`).
 */
export function ResponsiveDateTimeInput({
	value,
	defaultValue,
	onValueChange,
	placeholder,
	formatOptions,
	locale,
	disabled,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	minuteStep,
	calendarProps,
	min,
	max,
}: Props) {
	const isMobile = useIsMobile();

	if (isMobile) {
		return (
			<NativeDateTimeInput
				id={id}
				name={name}
				value={value ?? null}
				onValueChange={onValueChange}
				disabled={disabled}
				required={false}
				min={min}
				max={max}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				className={cn("w-full", className)}
			/>
		);
	}

	return (
		<DateTimePickerRoot
			id={id}
			name={name}
			value={value}
			defaultValue={defaultValue}
			onValueChange={onValueChange}
			placeholder={placeholder}
			formatOptions={formatOptions}
			locale={locale}
			disabled={disabled}
			minuteStep={minuteStep}
			calendarProps={calendarProps}
			aria-invalid={ariaInvalid}
			aria-label={ariaLabel}
			className={cn("w-full", className)}
		/>
	);
}
