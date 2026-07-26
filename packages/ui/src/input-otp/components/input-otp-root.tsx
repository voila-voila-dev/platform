import { OTPInput } from "input-otp";
import type * as React from "react";
import { cn } from "#/lib/utils.ts";

// Alias, not `interface … extends`: `input-otp`'s props are a union of the
// render-prop and children shapes, which an interface cannot extend.
type Props = React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string;
};

export function InputOTPRoot({
	className,
	containerClassName,
	...props
}: Props) {
	return (
		<OTPInput
			data-slot="input-otp"
			containerClassName={cn(
				"flex items-center has-disabled:opacity-50 [&:has(:disabled)_[data-slot=input-otp-slot]]:cursor-not-allowed [&:has(:disabled)_[data-slot=input-otp-slot]]:bg-muted",
				containerClassName,
			)}
			spellCheck={false}
			className={cn("disabled:cursor-not-allowed", className)}
			{...props}
		/>
	);
}
