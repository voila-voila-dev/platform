import { TimePicker } from "@voila.dev/ui/time-picker";
import { useState } from "react";

export function Default() {
	const [time, setTime] = useState<string | null>("14:30");
	return (
		<TimePicker value={time} onValueChange={setTime} placeholder="Start time" />
	);
}

export function Bounded() {
	const [time, setTime] = useState<string | null>(null);
	return (
		<TimePicker
			value={time}
			onValueChange={setTime}
			min="09:00"
			max="17:30"
			step={15}
			placeholder="Appointment"
		/>
	);
}
