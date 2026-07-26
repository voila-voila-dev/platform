import { ClockIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { NativeDateField } from "#/native-date-picker/components/native-date-field.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDateField>,
		"type" | "slotName" | "icon"
	> {}

/** The browser's own time picker, dressed as an `Input`. */
export function NativeDatePickerTime(props: Props) {
	return (
		<NativeDateField
			type="time"
			slotName="native-time-picker"
			icon={<ClockIcon />}
			{...props}
		/>
	);
}
