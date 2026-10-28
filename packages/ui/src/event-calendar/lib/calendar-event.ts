import { MS_PER_DAY, startOfDay } from "#/event-calendar/lib/calendar-dates.ts";

/** Granularity the calendar renders at. */
export type CalendarViewMode = "month" | "week" | "day";

/**
 * One entry on the calendar. The calendar is data-agnostic: a host maps its own
 * records to this shape and keys them back by `id` in `onEventClick`.
 */
export interface CalendarEvent {
	id: string;
	title: string;
	/** When the event starts (local time). */
	start: Date;
	/** When it ends; absent → a 30-minute point at `start`. */
	end?: Date;
	/** Render in the all-day lane (month grid + the week/day all-day row). */
	allDay?: boolean;
	/** Accent color (any CSS color) for the event block. */
	color?: string;
	/** Extra one-line details shown under the title. */
	meta?: readonly string[];
}

/** An event's effective end — its `end`, or 30 minutes past `start`. */
export function eventEnd(event: CalendarEvent): Date {
	if (event.end && event.end.getTime() > event.start.getTime())
		return event.end;
	return new Date(event.start.getTime() + 30 * 60_000);
}

/** Whether an event should live in the all-day lane (explicit, or spans a day+). */
export function isAllDay(event: CalendarEvent): boolean {
	return (
		event.allDay === true ||
		eventEnd(event).getTime() - event.start.getTime() >= MS_PER_DAY
	);
}

/** Whether an event's span intersects the calendar day `day`. */
export function eventCoversDay(event: CalendarEvent, day: Date): boolean {
	const dayStart = startOfDay(day).getTime();
	const dayEnd = dayStart + MS_PER_DAY;
	// A timed event touching exactly midnight (end === next day's 00:00) belongs
	// to the earlier day only, so the comparison on `end` is strict.
	return event.start.getTime() < dayEnd && eventEnd(event).getTime() > dayStart;
}

/** The events covering `day`, earliest first. */
export function eventsOnDay(
	events: readonly CalendarEvent[],
	day: Date,
): CalendarEvent[] {
	return events
		.filter((event) => eventCoversDay(event, day))
		.sort((a, b) => a.start.getTime() - b.start.getTime());
}
