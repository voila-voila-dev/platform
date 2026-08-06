import type * as React from "react";
import { EventCalendarTimeGrid } from "#/event-calendar/components/event-calendar-time-grid.tsx";
import {
	type WeekStart,
	weekDates,
} from "#/event-calendar/lib/calendar-dates.ts";

interface Props
	extends Omit<React.ComponentProps<typeof EventCalendarTimeGrid>, "days"> {
	/** Any date inside the week to render. */
	date: Date;
	weekStartsOn?: WeekStart;
}

/** Seven day columns on the shared time grid. */
export function EventCalendarWeekView({
	date,
	weekStartsOn = 1,
	...props
}: Props) {
	return (
		<EventCalendarTimeGrid days={weekDates(date, weekStartsOn)} {...props} />
	);
}
