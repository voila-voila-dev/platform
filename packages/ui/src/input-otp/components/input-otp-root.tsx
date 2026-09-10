import { OTPInput } from "input-otp";
import * as React from "react";
import { cn } from "#/lib/utils.ts";

// Alias, not `interface … extends`: `input-otp`'s props are a union of the
// render-prop and children shapes, which an interface cannot extend.
type Props = React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string;
};

export function InputOTPRoot({
	className,
	containerClassName,
	defaultValue,
	value,
	onChange,
	...props
}: Props) {
	// `input-otp` seeds its own state from `defaultValue` and then forwards the
	// prop to the inner input as well, where its `value` already sits - React
	// warns there about an input that is both controlled and uncontrolled. Own
	// the uncontrolled case here and hand it a controlled pair instead, so the
	// prop never reaches the input and the warning has nothing to fire on.
	const [uncontrolled, setUncontrolled] = React.useState(
		typeof defaultValue === "string" ? defaultValue : "",
	);
	const isControlled = value !== undefined;

	return (
		<OTPInput
			data-slot="input-otp"
			containerClassName={cn(
				"flex items-center has-disabled:opacity-50 [&:has(:disabled)_[data-slot=input-otp-slot]]:cursor-not-allowed [&:has(:disabled)_[data-slot=input-otp-slot]]:bg-muted",
				containerClassName,
			)}
			spellCheck={false}
			className={cn("disabled:cursor-not-allowed", className)}
			value={isControlled ? value : uncontrolled}
			onChange={(next) => {
				if (!isControlled) {
					setUncontrolled(next);
				}
				onChange?.(next);
			}}
			{...props}
		/>
	);
}
