import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import * as React from "react";
import { EventCalendarDayView } from "#/event-calendar/components/event-calendar-day-view.tsx";
import { EventCalendarMonthView } from "#/event-calendar/components/event-calendar-month-view.tsx";
import { EventCalendarToolbar } from "#/event-calendar/components/event-calendar-toolbar.tsx";
import { EventCalendarWeekView } from "#/event-calendar/components/event-calendar-week-view.tsx";
import {
	addDays,
	addMonths,
	type WeekStart,
} from "#/event-calendar/lib/calendar-dates.ts";
import type {
	CalendarEvent,
	CalendarViewMode,
} from "#/event-calendar/lib/calendar-event.ts";
import { viewLabel } from "#/event-calendar/lib/calendar-labels.ts";
import { cn } from "#/lib/utils.ts";

interface Props
	extends Omit<useRender.ComponentProps<"section">, "children" | "onSelect"> {
	events?: readonly CalendarEvent[];
	/** Controlled granularity. Omit (with `defaultView`) to run uncontrolled. */
	view?: CalendarViewMode;
	defaultView?: CalendarViewMode;
	onViewChange?: (view: CalendarViewMode) => void;
	/** Controlled focused date. Omit (with `defaultDate`) to run uncontrolled. */
	date?: Date;
	defaultDate?: Date;
	onDateChange?: (date: Date) => void;
	onEventClick?: (event: CalendarEvent) => void;
	/** 0 = Sunday, 1 = Monday (default — matches most scheduling UIs). */
	weekStartsOn?: WeekStart;
	/** Visible hour band of the week and day time grids. */
	hourRange?: readonly [number, number];
	/** BCP-47 locale for every date label. Omit to follow the runtime's. */
	locale?: string;
	/** Hide the built-in toolbar when the host renders its own controls. */
	hideToolbar?: boolean;
}

/**
 * A scheduling calendar with Month, Week and Day views. Data-agnostic and
 * presentational: the host passes plain {@link CalendarEvent}s and wires the
 * click and navigation callbacks. View and focused date are controllable, or
 * run uncontrolled from `defaultView` / `defaultDate`. All date math is local
 * time, so events sit on the day the viewer reads on their own clock.
 *
 * Distinct from `Calendar` (`@voila.dev/ui/calendar`), which is a date *picker*.
 */
export function EventCalendarRoot({
	events = [],
	view: viewProp,
	defaultView = "month",
	onViewChange,
	date: dateProp,
	defaultDate,
	onDateChange,
	onEventClick,
	weekStartsOn = 1,
	hourRange = [0, 24],
	locale,
	hideToolbar = false,
	className,
	render,
	...props
}: Props) {
	const [viewState, setViewState] = React.useState<CalendarViewMode>(
		viewProp ?? defaultView,
	);
	const [dateState, setDateState] = React.useState<Date>(
		() => defaultDate ?? new Date(),
	);
	const view = viewProp ?? viewState;
	const date = dateProp ?? dateState;

	function changeView(next: CalendarViewMode) {
		if (viewProp === undefined) setViewState(next);
		onViewChange?.(next);
	}

	function changeDate(next: Date) {
		if (dateProp === undefined) setDateState(next);
		onDateChange?.(next);
	}

	function step(direction: 1 | -1) {
		if (view === "month") changeDate(addMonths(date, direction));
		else if (view === "week") changeDate(addDays(date, 7 * direction));
		else changeDate(addDays(date, direction));
	}

	const shared = { date, events, locale, onEventClick } as const;

	return useRender({
		defaultTagName: "section",
		props: mergeProps<"section">(
			{
				"aria-label": "Calendar",
				className: cn("flex flex-col gap-3", className),
			},
			props,
			{
				children: (
					<>
						{hideToolbar ? null : (
							<EventCalendarToolbar
								label={viewLabel(view, date, weekStartsOn, locale)}
								onToday={() => changeDate(new Date())}
								onPrev={() => step(-1)}
								onNext={() => step(1)}
								view={view}
								onViewChange={changeView}
							/>
						)}
						{view === "month" ? (
							<EventCalendarMonthView {...shared} weekStartsOn={weekStartsOn} />
						) : view === "week" ? (
							<EventCalendarWeekView
								{...shared}
								weekStartsOn={weekStartsOn}
								hourRange={hourRange}
							/>
						) : (
							<EventCalendarDayView {...shared} hourRange={hourRange} />
						)}
					</>
				),
			},
		),
		render,
		state: { slot: "event-calendar", view },
	});
}
