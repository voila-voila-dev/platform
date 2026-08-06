import * as React from "react";
import { EventCalendarDayHeader } from "#/event-calendar/components/event-calendar-day-header.tsx";
import { EventCalendarEvent } from "#/event-calendar/components/event-calendar-event.tsx";
import { isSameDay } from "#/event-calendar/lib/calendar-dates.ts";
import { layoutDay } from "#/event-calendar/lib/calendar-day-layout.ts";
import {
	type CalendarEvent,
	eventCoversDay,
	isAllDay,
} from "#/event-calendar/lib/calendar-event.ts";
import { hourLabel, timeLabel } from "#/event-calendar/lib/calendar-labels.ts";
import { minutesOfDay } from "#/lib/time-math.ts";
import { cn } from "#/lib/utils.ts";

/** Pixel height of one hour row. */
const HOUR_HEIGHT = 48;

/** Hour the grid scrolls to when "now" sits outside the visible band. */
const DEFAULT_SCROLL_HOUR = 8;

interface Props extends React.ComponentProps<"div"> {
	/** The day columns to render — seven for a week, one for a day. */
	days: readonly Date[];
	events?: readonly CalendarEvent[];
	/** Visible hour band, as `[startHour, endHour]`. */
	hourRange?: readonly [number, number];
	/** BCP-47 locale for the hour gutter and event times. */
	locale?: string;
	onEventClick?: (event: CalendarEvent) => void;
}

/**
 * The hour grid shared by the Week (seven columns) and Day (one column) views:
 * an all-day lane, an hour gutter, positioned timed events, and a "now" line on
 * today's column.
 */
export function EventCalendarTimeGrid({
	days,
	events = [],
	hourRange = [0, 24],
	locale,
	onEventClick,
	className,
	...props
}: Props) {
	const scrollRef = React.useRef<HTMLDivElement>(null);
	const [startHour, endHour] = hourRange;
	const hours = Array.from(
		{ length: endHour - startHour },
		(_, index) => startHour + index,
	);
	const now = new Date();
	const nowMin = minutesOfDay(now);
	const nowVisible = nowMin >= startHour * 60 && nowMin <= endHour * 60;

	const allDayByDay = days.map((day) =>
		events.filter((event) => isAllDay(event) && eventCoversDay(event, day)),
	);
	const hasAllDay = allDayByDay.some((list) => list.length > 0);

	// Open on the current hour (or the morning) rather than on midnight.
	React.useEffect(() => {
		if (!scrollRef.current) return;
		const target = nowVisible ? nowMin : DEFAULT_SCROLL_HOUR * 60;
		scrollRef.current.scrollTop =
			((target - startHour * 60) / 60) * HOUR_HEIGHT - HOUR_HEIGHT;
	}, [nowVisible, nowMin, startHour]);

	return (
		<div
			data-slot="event-calendar-time-grid"
			className={cn(
				"flex flex-col overflow-hidden rounded-lg border",
				className,
			)}
			{...props}
		>
			<div className="flex border-b">
				<div className="w-14 shrink-0" />
				{days.map((day) => (
					<EventCalendarDayHeader
						key={day.toISOString()}
						day={day}
						locale={locale}
					/>
				))}
			</div>

			{hasAllDay ? (
				<div className="flex border-b bg-muted/20">
					<div className="flex w-14 shrink-0 items-center justify-end pr-2 text-[0.65rem] text-muted-foreground">
						all-day
					</div>
					{days.map((day, index) => (
						<div
							key={day.toISOString()}
							className="flex flex-1 flex-col gap-0.5 border-l p-0.5"
						>
							{(allDayByDay[index] ?? []).map((event) => (
								<EventCalendarEvent
									key={event.id}
									event={event}
									onClick={onEventClick ? () => onEventClick(event) : undefined}
									className="block w-full truncate"
								/>
							))}
						</div>
					))}
				</div>
			) : null}

			<div ref={scrollRef} className="max-h-140 overflow-y-auto">
				<div className="flex" style={{ height: hours.length * HOUR_HEIGHT }}>
					<div className="w-14 shrink-0">
						{hours.map((hour) => (
							<div
								key={hour}
								style={{ height: HOUR_HEIGHT }}
								className="relative text-right"
							>
								<span className="absolute -top-2 right-2 text-[0.7rem] text-muted-foreground">
									{hour === startHour ? "" : hourLabel(hour, locale)}
								</span>
							</div>
						))}
					</div>

					{days.map((day) => {
						const segments = layoutDay(events, day, [startHour, endHour]);
						const showNow = nowVisible && isSameDay(day, now);
						return (
							<div
								key={day.toISOString()}
								className="relative flex-1 border-l"
								data-slot="event-calendar-day-column"
							>
								{hours.map((hour) => (
									<div
										key={hour}
										style={{ height: HOUR_HEIGHT }}
										className="border-b border-border/60"
									/>
								))}
								{segments.map(({ event, startMin, endMin, lane, lanes }) => (
									<EventCalendarEvent
										key={event.id}
										event={event}
										onClick={
											onEventClick ? () => onEventClick(event) : undefined
										}
										style={{
											position: "absolute",
											top: ((startMin - startHour * 60) / 60) * HOUR_HEIGHT,
											height: Math.max(
												16,
												((endMin - startMin) / 60) * HOUR_HEIGHT - 2,
											),
											left: `calc(${(lane / lanes) * 100}% + 2px)`,
											width: `calc(${100 / lanes}% - 4px)`,
										}}
										className="absolute shadow-sm"
									>
										<span className="font-medium">{event.title}</span>
										<span className="block opacity-80">
											{timeLabel(event.start, locale)}
										</span>
									</EventCalendarEvent>
								))}
								{showNow ? (
									<div
										aria-hidden
										data-slot="event-calendar-now-indicator"
										className="pointer-events-none absolute right-0 left-0 z-10 border-t-2 border-destructive"
										style={{
											top: ((nowMin - startHour * 60) / 60) * HOUR_HEIGHT,
										}}
									>
										<span className="absolute -top-1 -left-1 size-2 rounded-full bg-destructive" />
									</div>
								) : null}
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
