import { CalendarBlankIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { NativeDateField } from "#/native-date-picker/components/native-date-field.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDateField>,
		"type" | "slotName" | "icon"
	> {}

/** The browser's own date picker, dressed as an `Input`. */
export function NativeDatePickerDate(props: Props) {
	return (
		<NativeDateField
			type="date"
			slotName="native-date-picker"
			icon={<CalendarBlankIcon />}
			{...props}
		/>
	);
}
