import type { DateTimeRange } from "#/date-time-picker/lib/date-time-range.ts";
import {
	DEFAULT_MINUTES,
	startOfDay,
	timeLabel,
} from "#/date-time-picker/lib/date-time-values.ts";
import { minutesOfDay, withMinutes } from "#/lib/time-math.ts";

/** Which end of the range the popover is currently editing. */
export type ShiftStep = "start" | "end";

/**
 * Keep the end strictly after the start: preserve the user's end when it still
 * holds, otherwise reseed it one duration later, rolling across midnight when
 * needed.
 */
export function endAfter(
	start: Date,
	end: Date | null,
	defaultDurationMinutes: number,
): Date {
	return end !== null && end.getTime() > start.getTime()
		? end
		: new Date(start.getTime() + defaultDurationMinutes * 60_000);
}

/** The range after picking `day` on the active step, keeping the time-of-day. */
export function rangeWithDay({
	range,
	day,
	step,
	defaultDurationMinutes,
}: {
	range: DateTimeRange;
	day: Date;
	step: ShiftStep;
	defaultDurationMinutes: number;
}): DateTimeRange {
	const base = startOfDay(day);
	if (step === "start") {
		const start = withMinutes(
			base,
			range.start ? minutesOfDay(range.start) : DEFAULT_MINUTES,
		);
		return { start, end: endAfter(start, range.end, defaultDurationMinutes) };
	}
	const minutes = range.end
		? minutesOfDay(range.end)
		: range.start
			? minutesOfDay(range.start)
			: DEFAULT_MINUTES;
	return { start: range.start, end: withMinutes(base, minutes) };
}

/** The range after picking `minutes` on the active step, keeping the day. */
export function rangeWithTime({
	range,
	minutes,
	step,
	defaultDurationMinutes,
}: {
	range: DateTimeRange;
	minutes: number;
	step: ShiftStep;
	defaultDurationMinutes: number;
}): DateTimeRange {
	if (step === "start") {
		const base = range.start ? startOfDay(range.start) : startOfDay(new Date());
		const start = withMinutes(base, minutes);
		return { start, end: endAfter(start, range.end, defaultDurationMinutes) };
	}
	const base = range.end
		? startOfDay(range.end)
		: range.start
			? startOfDay(range.start)
			: startOfDay(new Date());
	return { start: range.start, end: withMinutes(base, minutes) };
}

/** Short localized day for the trigger and the step tabs, e.g. "20 juin". */
export function shiftDateLabel(date: Date, locale: string | undefined): string {
	return new Intl.DateTimeFormat(locale, {
		day: "numeric",
		month: "short",
	}).format(date);
}

/** One side of the range as a day + time summary, or a dash when unpicked. */
export function shiftStepLabel(
	date: Date | null,
	locale: string | undefined,
): string {
	return date === null
		? "—"
		: `${shiftDateLabel(date, locale)} · ${timeLabel(minutesOfDay(date), locale)}`;
}

/**
 * The trigger label: a single day with a time span when the shift stays within
 * one day, otherwise both sides spelled out; the placeholder until both are set.
 */
export function shiftRangeLabel({
	range,
	locale,
	placeholder,
}: {
	range: DateTimeRange;
	locale: string | undefined;
	placeholder: string;
}): string {
	const { start, end } = range;
	if (start === null || end === null) {
		return placeholder;
	}
	if (startOfDay(start).getTime() === startOfDay(end).getTime()) {
		return `${shiftDateLabel(start, locale)} · ${timeLabel(
			minutesOfDay(start),
			locale,
		)} – ${timeLabel(minutesOfDay(end), locale)}`;
	}
	return `${shiftStepLabel(start, locale)} → ${shiftStepLabel(end, locale)}`;
}

/**
 * On the end step, never let the end land on or before the start: earlier times
 * on the start's own day are grayed out (earlier days are already off the
 * calendar).
 */
export function isShiftTimeDisabled({
	minutes,
	step,
	range,
	activeDay,
}: {
	minutes: number;
	step: ShiftStep;
	range: DateTimeRange;
	activeDay: Date | null;
}): boolean {
	if (step !== "end" || range.start === null || activeDay === null) {
		return false;
	}
	if (activeDay.getTime() !== startOfDay(range.start).getTime()) {
		return false;
	}
	return minutes <= minutesOfDay(range.start);
}

/** The active side's day and minutes-of-day, `null` until that side is picked. */
export function shiftActiveSelection(
	range: DateTimeRange,
	step: ShiftStep,
): { activeDay: Date | null; activeMinutes: number | null } {
	const active = step === "start" ? range.start : range.end;
	return {
		activeDay: active ? startOfDay(active) : null,
		activeMinutes: active ? minutesOfDay(active) : null,
	};
}

/** Bound the end step's calendar to the start's day onward. */
export function shiftCalendarDisabled(
	range: DateTimeRange,
	step: ShiftStep,
): { before: Date } | undefined {
	if (step !== "end") {
		return undefined;
	}
	if (range.start === null) {
		return undefined;
	}
	return { before: startOfDay(range.start) };
}

export function shiftCalendarDefaultMonth(
	activeDay: Date | null,
	range: DateTimeRange,
): Date | undefined {
	return activeDay ?? range.start ?? undefined;
}

/** Localized labels for the Start/End tabs. */
export function startLabelText(locale: string | undefined): string {
	return locale?.startsWith("fr") ? "Début" : "Start";
}

export function endLabelText(locale: string | undefined): string {
	return locale?.startsWith("fr") ? "Fin" : "End";
}
