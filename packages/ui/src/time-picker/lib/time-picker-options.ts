import {
	formatMinutesLabel,
	minutesToTimeValue,
	parseTimeToMinutes,
} from "#/lib/time-math.ts";

export function formatTimeLabel(
	time: string,
	locale: string | undefined,
	options: Intl.DateTimeFormatOptions | undefined,
): string {
	const totalMinutes = parseTimeToMinutes(time);
	// An unparseable value is the caller's literal string; show it as-is.
	if (totalMinutes === null) return time;
	return formatMinutesLabel(totalMinutes, locale, options);
}

export function timeRangeBoundsInMinutes(
	min: string,
	max: string,
): { first: number; last: number } {
	return {
		first: parseTimeToMinutes(min) ?? 0,
		last: parseTimeToMinutes(max) ?? 23 * 60 + 59,
	};
}

export function timeOptionValues(
	min: string,
	max: string,
	step: number,
): string[] {
	const stepMinutes = step > 0 ? step : 30;
	const { first, last } = timeRangeBoundsInMinutes(min, max);
	const times: string[] = [];
	for (let minutes = first; minutes <= last; minutes += stepMinutes) {
		times.push(minutesToTimeValue(minutes));
	}
	return times;
}
