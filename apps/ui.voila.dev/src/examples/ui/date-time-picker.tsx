import { DateTimePicker } from "@voila.dev/ui/date-time-picker";
import { useState } from "react";

export function DateTimePickerExample() {
	const [value, setValue] = useState<Date | null>(new Date(2026, 5, 20, 9, 30));
	return (
		<DateTimePicker.Root
			value={value}
			onValueChange={setValue}
			placeholder="Project start"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}
