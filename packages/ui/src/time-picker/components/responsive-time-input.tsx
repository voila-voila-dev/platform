import * as React from "react";
import { useIsMobile } from "#/hooks/use-mobile.ts";
import { NativeTimeInput } from "#/time-picker/components/native-time-input.tsx";
import { TimePickerRoot } from "#/time-picker/components/time-picker-root.tsx";

interface Props
	extends Pick<
		React.ComponentProps<typeof TimePickerRoot>,
		| "value"
		| "defaultValue"
		| "onValueChange"
		| "placeholder"
		| "formatOptions"
		| "locale"
		| "disabled"
		| "step"
		| "min"
		| "max"
		| "name"
		| "id"
		| "aria-invalid"
		| "aria-label"
	> {
	/**
	 * Classes for the field itself: the popover trigger on desktop, the wrapper
	 * around the native input on mobile. A plain string only — the trigger's
	 * Button accepts a state function, but a native input has no state to read.
	 */
	className?: string;
}

/**
 * A time field with two surfaces from one declaration: our stepped option list
 * on desktop and the OS time picker under the `useIsMobile` breakpoint (768px).
 *
 * The value state lives here rather than in either surface, so a selection
 * survives crossing the breakpoint. Note that `step` shapes the desktop list
 * only: the native control offers every minute, so a caller who needs the step
 * enforced must also validate the value.
 */
export function ResponsiveTimeInput({
	value: controlledValue,
	defaultValue,
	onValueChange,
	min,
	max,
	step,
	placeholder,
	formatOptions,
	locale,
	disabled,
	name,
	id,
	className,
	"aria-invalid": ariaInvalid,
	"aria-label": ariaLabel,
}: Props) {
	const isMobile = useIsMobile();
	const isControlled = controlledValue !== undefined;
	const [uncontrolled, setUncontrolled] = React.useState<string | null>(
		defaultValue ?? null,
	);
	const value = isControlled ? controlledValue : uncontrolled;

	const handleChange = (time: string | null) => {
		if (!isControlled) setUncontrolled(time);
		onValueChange?.(time);
	};

	if (isMobile) {
		return (
			<NativeTimeInput
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
		<TimePickerRoot
			id={id}
			name={name}
			value={value ?? null}
			onValueChange={handleChange}
			placeholder={placeholder}
			formatOptions={formatOptions}
			locale={locale}
			disabled={disabled}
			step={step}
			min={min}
			max={max}
			className={className}
			aria-invalid={ariaInvalid}
			aria-label={ariaLabel}
		/>
	);
}
