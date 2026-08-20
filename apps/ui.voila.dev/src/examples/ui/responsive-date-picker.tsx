import { ResponsiveDatePicker } from "@voila.dev/ui/responsive-date-picker";
import { useState } from "react";

export function Default() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<ResponsiveDatePicker.Root
			value={date}
			onValueChange={setDate}
			placeholder="Project date"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export function BirthDate() {
	const [date, setDate] = useState<Date | null>(null);
	return (
		<ResponsiveDatePicker.Root
			value={date}
			onValueChange={setDate}
			locale="fr-FR"
			placeholder="Date de naissance"
			min={new Date(1900, 0, 1)}
			max={new Date()}
		/>
	);
}
