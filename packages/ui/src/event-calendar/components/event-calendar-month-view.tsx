import type * as React from "react";
import { EventCalendarEvent } from "#/event-calendar/components/event-calendar-event.tsx";
import {
	isSameDay,
	monthMatrix,
	type WeekStart,
} from "#/event-calendar/lib/calendar-dates.ts";
import {
	type CalendarEvent,
	eventsOnDay,
	isAllDay,
} from "#/event-calendar/lib/calendar-event.ts";
import {
	dayLabel,
	timeLabel,
	weekdayLabel,
} from "#/event-calendar/lib/calendar-labels.ts";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"table"> {
	/** Any date inside the month to render. */
	date: Date;
	events?: readonly CalendarEvent[];
	weekStartsOn?: WeekStart;
	/** BCP-47 locale for the weekday headers and event times. */
	locale?: string;
	/** Events listed per day before collapsing into a "+n more" line. */
	maxPerDay?: number;
	onEventClick?: (event: CalendarEvent) => void;
}

/** The month grid: whole weeks, each day cell listing its events. */
export function EventCalendarMonthView({
	date,
	events = [],
	weekStartsOn = 1,
	locale,
	maxPerDay = 3,
	onEventClick,
	className,
	...props
}: Props) {
	const cells = monthMatrix(date, weekStartsOn);
	const weeks = Array.from({ length: cells.length / 7 }, (_, index) =>
		cells.slice(index * 7, index * 7 + 7),
	);
	const today = new Date();

	return (
		<table
			data-slot="event-calendar-month-view"
			className={cn("w-full table-fixed border-collapse text-sm", className)}
			{...props}
		>
			<thead>
				<tr>
					{(weeks[0] ?? []).map((day) => (
						<th
							key={day.getDay()}
							scope="col"
							aria-label={weekdayLabel(day, locale, "long")}
							className="border p-1.5 text-center text-xs font-medium text-muted-foreground"
						>
							{weekdayLabel(day, locale)}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{weeks.map((week) => (
					<tr key={week[0]?.getTime() ?? 0}>
						{week.map((day) => {
							const dayEvents = eventsOnDay(events, day);
							const shown = dayEvents.slice(0, maxPerDay);
							const overflow = dayEvents.length - shown.length;
							const outside = day.getMonth() !== date.getMonth();
							const isToday = isSameDay(day, today);
							return (
								<td
									key={day.toISOString()}
									aria-current={isToday ? "date" : undefined}
									aria-label={dayLabel(day, locale)}
									className={cn(
										"h-28 border p-1 align-top",
										outside ? "bg-muted/30 text-muted-foreground" : undefined,
									)}
								>
									<div className="mb-1 text-right">
										<span
											className={cn(
												"inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1 text-xs",
												isToday
													? "bg-primary font-semibold text-primary-foreground"
													: "text-muted-foreground",
											)}
										>
											{day.getDate()}
										</span>
									</div>
									<div className="space-y-0.5">
										{shown.map((event) => (
											<EventCalendarEvent
												key={event.id}
												event={event}
												onClick={
													onEventClick ? () => onEventClick(event) : undefined
												}
												className={cn(
													"block w-full truncate",
													isAllDay(event) ? "font-medium" : undefined,
												)}
											>
												{isAllDay(event)
													? event.title
													: `${timeLabel(event.start, locale)} ${event.title}`}
											</EventCalendarEvent>
										))}
										{overflow > 0 ? (
											<div className="px-1 text-xs text-muted-foreground">
												+{overflow} more
											</div>
										) : null}
									</div>
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}
