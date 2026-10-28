import { MinusIcon } from "@phosphor-icons/react";
import type * as React from "react";

interface Props extends React.ComponentProps<"div"> {}

export function InputOTPSeparator(props: Props) {
	return (
		<div
			data-slot="input-otp-separator"
			className="flex items-center [&_svg:not([class*='size-'])]:size-4"
			role="separator"
			{...props}
		>
			<MinusIcon />
		</div>
	);
}
