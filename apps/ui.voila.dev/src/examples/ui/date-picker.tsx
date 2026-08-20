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

export function Native() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return <DatePicker.Native value={date} onValueChange={setDate} />;
}

export function Responsive() {
	const [date, setDate] = useState<Date | null>(null);
	return (
		<DatePicker.Responsive
			value={date}
			onValueChange={setDate}
			locale="fr-FR"
			placeholder="Date de naissance"
			min={new Date(1900, 0, 1)}
			max={new Date()}
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

export function ResponsiveRange() {
	const [range, setRange] = useState<DateRange>({
		from: new Date(2026, 5, 15),
		to: new Date(2026, 5, 20),
	});
	return (
		<div className="w-full max-w-lg">
			<DatePicker.ResponsiveRange
				value={range}
				onValueChange={setRange}
				fromLabel="From"
				toLabel="To"
			/>
		</div>
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
