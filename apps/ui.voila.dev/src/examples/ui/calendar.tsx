import { Calendar } from "@voila.dev/ui/calendar";
import type { DateRange } from "@voila.dev/ui/date-picker";
import { useState } from "react";

export function Default() {
	const [selected, setSelected] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);
	return (
		<Calendar.Root
			mode="single"
			selected={selected}
			onSelect={setSelected}
			defaultMonth={new Date(2026, 5, 20)}
			className="rounded-lg border"
		/>
	);
}

export function Range() {
	const [range, setRange] = useState<DateRange | undefined>({
		from: new Date(2026, 5, 15),
		to: new Date(2026, 5, 20),
	});
	return (
		<Calendar.Root
			mode="range"
			selected={range}
			onSelect={setRange}
			defaultMonth={new Date(2026, 5, 1)}
			className="rounded-lg border"
		/>
	);
}

export function Bounded() {
	const [selected, setSelected] = useState<Date | undefined>();
	return (
		<Calendar.Root
			mode="single"
			selected={selected}
			onSelect={setSelected}
			defaultMonth={new Date(2026, 5, 1)}
			disabled={[{ before: new Date(2026, 5, 8) }, { dayOfWeek: [0, 6] }]}
			className="rounded-lg border"
		/>
	);
}
