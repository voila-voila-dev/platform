import { DatePicker, type DateRange } from "@voila.dev/ui/date-picker";
import { useState } from "react";

export function Default() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<DatePicker.Root
			value={date}
			onValueChange={setDate}
			placeholder="Project date"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export function Range() {
	const [range, setRange] = useState<DateRange | null>({
		from: new Date(2026, 5, 15),
		to: new Date(2026, 5, 20),
	});
	return (
		<DatePicker.Range
			value={range}
			onValueChange={setRange}
			placeholder="Booking window"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export function Localized() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<DatePicker.Root
			value={date}
			onValueChange={setDate}
			locale="fr-FR"
			placeholder="Date du projet"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}
