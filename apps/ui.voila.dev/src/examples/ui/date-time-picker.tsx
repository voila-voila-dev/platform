import {
	DateTimePicker,
	type DateTimeRange,
} from "@voila.dev/ui/date-time-picker";
import { useState } from "react";

export function Default() {
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

export function Range() {
	const [range, setRange] = useState<DateTimeRange>({
		start: new Date(2026, 5, 20, 9, 0),
		end: new Date(2026, 5, 20, 17, 0),
	});
	return <DateTimePicker.Range value={range} onValueChange={setRange} />;
}

export function Shift() {
	const [shift, setShift] = useState<DateTimeRange>({
		start: new Date(2026, 5, 20, 20, 0),
		end: new Date(2026, 5, 21, 2, 0),
	});
	return (
		<DateTimePicker.ShiftRange
			value={shift}
			onValueChange={setShift}
			placeholder="Night shift"
		/>
	);
}
