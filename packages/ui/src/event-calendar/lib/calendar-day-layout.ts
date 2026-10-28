import { startOfDay } from "#/event-calendar/lib/calendar-dates.ts";
import {
	type CalendarEvent,
	eventCoversDay,
	eventEnd,
	isAllDay,
} from "#/event-calendar/lib/calendar-event.ts";

/** An event's slice of one day, placed in an overlap lane. */
export interface DaySegment {
	event: CalendarEvent;
	/** Minutes from midnight where the event's portion of this day starts/ends. */
	startMin: number;
	endMin: number;
	/** Lane index + total lanes for side-by-side overlap layout. */
	lane: number;
	lanes: number;
}

interface RawSegment {
	event: CalendarEvent;
	startMin: number;
	endMin: number;
}

/**
 * Lay timed events out within one day: clip each to the visible hour band, then
 * pack overlapping events into side-by-side lanes (Google-Calendar columns).
 * All-day events are excluded — they belong to the all-day lane.
 */
export function layoutDay(
	events: readonly CalendarEvent[],
	day: Date,
	hourRange: readonly [number, number] = [0, 24],
): DaySegment[] {
	const dayStart = startOfDay(day).getTime();
	const rangeStart = hourRange[0] * 60;
	const rangeEnd = hourRange[1] * 60;

	const raw: RawSegment[] = [];
	for (const event of events) {
		if (isAllDay(event) || !eventCoversDay(event, day)) continue;
		const startMin = Math.max(
			rangeStart,
			Math.round((event.start.getTime() - dayStart) / 60_000),
		);
		const endMin = Math.min(
			rangeEnd,
			Math.round((eventEnd(event).getTime() - dayStart) / 60_000),
		);
		if (endMin <= startMin) continue;
		raw.push({ event, startMin, endMin });
	}
	raw.sort((a, b) => a.startMin - b.startMin || a.endMin - b.endMin);

	const segments: DaySegment[] = [];
	let cluster: RawSegment[] = [];
	let clusterEnd = Number.NEGATIVE_INFINITY;

	function flush() {
		const laneEnds: number[] = [];
		const placed = cluster.map((segment) => {
			let lane = laneEnds.findIndex((end) => end <= segment.startMin);
			if (lane === -1) {
				lane = laneEnds.length;
				laneEnds.push(segment.endMin);
			} else {
				laneEnds[lane] = segment.endMin;
			}
			return { segment, lane };
		});
		const lanes = laneEnds.length;
		for (const { segment, lane } of placed) {
			segments.push({ ...segment, lane, lanes });
		}
		cluster = [];
	}

	for (const segment of raw) {
		if (cluster.length > 0 && segment.startMin >= clusterEnd) flush();
		cluster.push(segment);
		clusterEnd =
			cluster.length === 1
				? segment.endMin
				: Math.max(clusterEnd, segment.endMin);
	}
	if (cluster.length > 0) flush();

	return segments;
}
