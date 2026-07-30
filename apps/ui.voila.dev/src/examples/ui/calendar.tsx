import { Calendar } from "@voila.dev/ui/calendar";
import { useState } from "react";

export function CalendarExample() {
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
