import { CalendarDotsIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { NativeDateField } from "#/native-date-picker/components/native-date-field.tsx";

interface Props
	extends Omit<
		React.ComponentProps<typeof NativeDateField>,
		"type" | "slotName" | "icon"
	> {}

/** The browser's own date-and-time picker, dressed as an `Input`. */
export function NativeDatePickerDateTime(props: Props) {
	return (
		<NativeDateField
			type="datetime-local"
			slotName="native-date-time-picker"
			icon={<CalendarDotsIcon />}
			{...props}
		/>
	);
}
