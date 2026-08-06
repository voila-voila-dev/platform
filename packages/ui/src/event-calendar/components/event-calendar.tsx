import { EventCalendarDayHeader } from "#/event-calendar/components/event-calendar-day-header.tsx";
import { EventCalendarDayView } from "#/event-calendar/components/event-calendar-day-view.tsx";
import { EventCalendarEvent } from "#/event-calendar/components/event-calendar-event.tsx";
import { EventCalendarMonthView } from "#/event-calendar/components/event-calendar-month-view.tsx";
import { EventCalendarRoot } from "#/event-calendar/components/event-calendar-root.tsx";
import { EventCalendarTimeGrid } from "#/event-calendar/components/event-calendar-time-grid.tsx";
import { EventCalendarToolbar } from "#/event-calendar/components/event-calendar-toolbar.tsx";
import { EventCalendarViewToggle } from "#/event-calendar/components/event-calendar-view-toggle.tsx";
import { EventCalendarWeekView } from "#/event-calendar/components/event-calendar-week-view.tsx";

/**
 * The EventCalendar parts as one namespace. `Root` composes the toolbar and the
 * three views; the parts are exposed so a host can lay out its own chrome.
 */
export const EventCalendar = {
	Root: EventCalendarRoot,
	DayHeader: EventCalendarDayHeader,
	DayView: EventCalendarDayView,
	Event: EventCalendarEvent,
	MonthView: EventCalendarMonthView,
	TimeGrid: EventCalendarTimeGrid,
	Toolbar: EventCalendarToolbar,
	ViewToggle: EventCalendarViewToggle,
	WeekView: EventCalendarWeekView,
};
