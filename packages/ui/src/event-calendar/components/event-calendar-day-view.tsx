import type * as React from "react";
import { EventCalendarTimeGrid } from "#/event-calendar/components/event-calendar-time-grid.tsx";
import { startOfDay } from "#/event-calendar/lib/calendar-dates.ts";

interface Props
	extends Omit<React.ComponentProps<typeof EventCalendarTimeGrid>, "days"> {
	date: Date;
}

/** A single day column on the shared time grid. */
export function EventCalendarDayView({ date, ...props }: Props) {
	return <EventCalendarTimeGrid days={[startOfDay(date)]} {...props} />;
}
