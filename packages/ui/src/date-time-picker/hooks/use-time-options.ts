import * as React from "react";

/** Every minute-of-day option a time list offers, `minuteStep` apart. */
export function useTimeOptions(minuteStep: number): number[] {
	return React.useMemo(() => {
		const stepMinutes = minuteStep > 0 ? minuteStep : 30;
		const times: number[] = [];
		for (let minutes = 0; minutes <= 23 * 60 + 59; minutes += stepMinutes) {
			times.push(minutes);
		}
		return times;
	}, [minuteStep]);
}
