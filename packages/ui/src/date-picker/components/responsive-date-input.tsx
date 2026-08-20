import { DatePickerRoot } from "#/date-picker/components/date-picker-root.tsx";
import { NativeDateInput } from "#/date-picker/components/native-date-input.tsx";
import { boundedCalendarProps } from "#/date-picker/lib/calendar-bounds.ts";
import type { DatePickerBase } from "#/date-picker/lib/date-picker-props.ts";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { usePickerState } from "#/hooks/use-picker-state.ts";

interface Props extends DatePickerBase {
	/** Controlled value; pass `null` for a controlled empty selection. */
	value?: Date | null;
	/** Initial selection when uncontrolled. */
	defaultValue?: Date;
	/** Called with the picked day, or `null` when the selection is cleared. */
	onValueChange?: (date: Date | null) => void;
	/** Earliest selectable day. Bounds the year dropdown and the native field. */
	min?: Date;
	/** Latest selectable day. Bounds the year dropdown and the native field. */
	max?: Date;
	/**
	 * Classes for the field itself: the popover trigger on desktop, the wrapper
	 * around the native input on mobile. Use it for layout and width (`w-full`),
	 * which is what both surfaces share.
	 */
	className?: string;
}

/**
 * A date field with two surfaces from one declaration: the composed popover
 * calendar on desktop and the OS picker (`<input type="date">`) under the
 * `useIsMobile` breakpoint (768px), where the wheel iOS and Android put up
 * beats any calendar we could draw.
 *
 * The value state lives here rather than in either surface, so a selection
 * survives crossing the breakpoint.
 */
export function ResponsiveDateInput({
	value: controlledValue,
	defaultValue,
	onValueChange,
	min,
	max,
	placeholder,
	formatOptions,
	locale,
	disabled = false,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
	variant,
	calendarProps,
	defaultOpen,
	open,
	onOpenChange,
}: Props) {
	const isMobile = useIsMobile();
	const { isControlled, value, setUncontrolledValue } = usePickerState<Date>({
		value: controlledValue,
		defaultValue,
	});

	const handleChange = (date: Date | null) => {
		if (!isControlled) setUncontrolledValue(date ?? undefined);
		onValueChange?.(date);
	};

	if (isMobile) {
		return (
			<NativeDateInput
				id={id}
				name={name}
				value={value ?? null}
				onValueChange={handleChange}
				min={min}
				max={max}
				disabled={disabled}
				aria-invalid={ariaInvalid}
				aria-label={ariaLabel}
				className={className}
			/>
		);
	}

	return (
		<DatePickerRoot
			value={value ?? null}
			onValueChange={handleChange}
			placeholder={placeholder}
			formatOptions={formatOptions}
			locale={locale}
			disabled={disabled}
			name={name}
			id={id}
			className={className}
			aria-invalid={ariaInvalid}
			aria-label={ariaLabel}
			variant={variant}
			calendarProps={boundedCalendarProps(calendarProps, min, max, new Date())}
			defaultOpen={defaultOpen}
			open={open}
			onOpenChange={onOpenChange}
		/>
	);
}
