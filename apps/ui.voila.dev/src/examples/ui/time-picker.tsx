import { TimePicker } from "@voila.dev/ui/time-picker";
import { useState } from "react";

export function TimePickerExample() {
	const [time, setTime] = useState<string | null>("14:30");
	return (
		<TimePicker value={time} onValueChange={setTime} placeholder="Start time" />
	);
}
