import { dateFormat } from "#/core/format.ts";
import {
	type ContinuousScaleOptions,
	linearScale,
	toNumber,
} from "#/core/scales/continuous.ts";
import { niceTicks } from "#/core/ticks.ts";
import type { ChartPositionScale, ChartValue } from "#/core/types.ts";

/**
 * Dates in, pixels out. Ticks land on calendar boundaries (midnight, the first
 * of the month, New Year) rather than on round millisecond counts, and their
 * labels only say what changes between two ticks.
 *
 * Everything is UTC. Chart data is mostly day or month buckets written as
 * `2026-03-01`, which JavaScript parses as UTC midnight: reading them in the
 * viewer's zone would push every bucket onto the previous day west of
 * Greenwich.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

type Unit = "second" | "minute" | "hour" | "day" | "week" | "month" | "year";

interface TimeInterval {
	readonly unit: Unit;
	readonly step: number;
	/** Approximate length, only to pick the interval closest to the tick count. */
	readonly duration: number;
}

const INTERVALS: ReadonlyArray<TimeInterval> = [
	{ unit: "second", step: 1, duration: SECOND },
	{ unit: "second", step: 5, duration: 5 * SECOND },
	{ unit: "second", step: 15, duration: 15 * SECOND },
	{ unit: "second", step: 30, duration: 30 * SECOND },
	{ unit: "minute", step: 1, duration: MINUTE },
	{ unit: "minute", step: 5, duration: 5 * MINUTE },
	{ unit: "minute", step: 15, duration: 15 * MINUTE },
	{ unit: "minute", step: 30, duration: 30 * MINUTE },
	{ unit: "hour", step: 1, duration: HOUR },
	{ unit: "hour", step: 3, duration: 3 * HOUR },
	{ unit: "hour", step: 6, duration: 6 * HOUR },
	{ unit: "hour", step: 12, duration: 12 * HOUR },
	{ unit: "day", step: 1, duration: DAY },
	{ unit: "day", step: 2, duration: 2 * DAY },
	{ unit: "week", step: 1, duration: WEEK },
	{ unit: "month", step: 1, duration: MONTH },
	{ unit: "month", step: 3, duration: 3 * MONTH },
	{ unit: "month", step: 6, duration: 6 * MONTH },
	{ unit: "year", step: 1, duration: YEAR },
];

const UNIT_MS: Record<"second" | "minute" | "hour" | "day", number> = {
	second: SECOND,
	minute: MINUTE,
	hour: HOUR,
	day: DAY,
};

function chooseInterval(span: number, count: number): TimeInterval {
	const target = span / Math.max(1, count);
	let best = INTERVALS[0];
	for (const interval of INTERVALS) {
		if (
			Math.abs(Math.log(interval.duration / target)) <
			Math.abs(Math.log(best.duration / target))
		) {
			best = interval;
		}
	}
	return best;
}

function monthTicks(start: number, end: number, step: number): number[] {
	const from = new Date(start);
	const year = from.getUTCFullYear();
	let month = from.getUTCMonth();
	month = Math.ceil(month / step) * step;
	const ticks: number[] = [];
	for (;;) {
		const time = Date.UTC(year + Math.floor(month / 12), month % 12, 1);
		if (time > end) {
			return ticks;
		}
		if (time >= start) {
			ticks.push(time);
		}
		month += step;
	}
}

function intervalTicks(
	start: number,
	end: number,
	interval: TimeInterval,
): number[] {
	const { unit, step } = interval;
	if (unit === "year") {
		const years = niceTicks(
			new Date(start).getUTCFullYear(),
			new Date(end).getUTCFullYear(),
			Math.max(1, Math.round((end - start) / YEAR)),
		).filter(Number.isInteger);
		return years
			.map((year) => Date.UTC(year, 0, 1))
			.filter((time) => time >= start && time <= end);
	}
	if (unit === "month") {
		return monthTicks(start, end, step);
	}
	if (unit === "week") {
		// Weeks start on Monday: 1970-01-05 was one.
		const monday = Date.UTC(1970, 0, 5);
		const first = monday + Math.ceil((start - monday) / WEEK) * WEEK;
		const ticks: number[] = [];
		for (let time = first; time <= end; time += WEEK) {
			ticks.push(time);
		}
		return ticks;
	}
	const size = UNIT_MS[unit] * step;
	const ticks: number[] = [];
	for (let time = Math.ceil(start / size) * size; time <= end; time += size) {
		ticks.push(time);
	}
	return ticks;
}

function tickLabel(time: number, unit: Unit, locale: string): string {
	const date = new Date(time);
	if (unit === "year") {
		return dateFormat(locale, { year: "numeric" }).format(date);
	}
	if (unit === "month") {
		// The year only where it turns, so a row of months stays short.
		return date.getUTCMonth() === 0
			? dateFormat(locale, { month: "short", year: "numeric" }).format(date)
			: dateFormat(locale, { month: "short" }).format(date);
	}
	if (unit === "day" || unit === "week") {
		return dateFormat(locale, { day: "numeric", month: "short" }).format(date);
	}
	if (unit === "second") {
		return dateFormat(locale, {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}).format(date);
	}
	return dateFormat(locale, { hour: "2-digit", minute: "2-digit" }).format(
		date,
	);
}

export function timeScale(options: ContinuousScaleOptions): ChartPositionScale {
	const { domain, locale, tickCount } = options;
	const linear = linearScale(options);
	const [start, end] = [Math.min(...domain), Math.max(...domain)];
	let unit = chooseInterval(end - start, tickCount).unit;

	return {
		...linear,
		kind: "time",
		domain: [new Date(domain[0]), new Date(domain[1])],
		invert: (pixel) => new Date(toNumber(linear.invert(pixel))),
		ticks: (count = tickCount) => {
			const interval = chooseInterval(end - start, count);
			unit = interval.unit;
			return intervalTicks(start, end, interval).map((time) => new Date(time));
		},
		format: (value: ChartValue) => tickLabel(toNumber(value), unit, locale),
	};
}
