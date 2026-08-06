// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EventCalendar } from "#/event-calendar/components/event-calendar.tsx";
import {
	monthMatrix,
	startOfWeek,
	weekDates,
} from "#/event-calendar/lib/calendar-dates.ts";
import { layoutDay } from "#/event-calendar/lib/calendar-day-layout.ts";
import {
	type CalendarEvent,
	eventCoversDay,
	isAllDay,
} from "#/event-calendar/lib/calendar-event.ts";
import { viewLabel } from "#/event-calendar/lib/calendar-labels.ts";

afterEach(cleanup);

const JUNE_2026 = new Date(2026, 5, 15);

function event(
	overrides: Partial<CalendarEvent> & { start: Date },
): CalendarEvent {
	return { id: "e", title: "Event", ...overrides };
}

describe("date helpers", () => {
	it("starts the week on the configured day", () => {
		const thursday = new Date(2026, 5, 25);
		expect(startOfWeek(thursday, 1).getDate()).toBe(22);
		expect(startOfWeek(thursday, 0).getDate()).toBe(21);
	});

	it("returns the seven days of a week", () => {
		const days = weekDates(new Date(2026, 5, 25), 1);
		expect(days).toHaveLength(7);
		expect(days[0]?.getDate()).toBe(22);
		expect(days[6]?.getDate()).toBe(28);
	});

	it("spans whole weeks and includes the 1st in the month matrix", () => {
		const cells = monthMatrix(JUNE_2026, 1);
		expect(cells.length % 7).toBe(0);
		expect(
			cells.some((day) => day.getDate() === 1 && day.getMonth() === 5),
		).toBe(true);
	});
});

describe("eventCoversDay", () => {
	it("covers only the start day for a point event", () => {
		const point = event({ start: new Date(2026, 5, 25, 10, 0) });
		expect(eventCoversDay(point, new Date(2026, 5, 25))).toBe(true);
		expect(eventCoversDay(point, new Date(2026, 5, 24))).toBe(false);
		expect(eventCoversDay(point, new Date(2026, 5, 26))).toBe(false);
	});

	it("covers every day a multi-day event spans", () => {
		const span = event({
			start: new Date(2026, 5, 24, 22, 0),
			end: new Date(2026, 5, 26, 2, 0),
		});
		expect(eventCoversDay(span, new Date(2026, 5, 24))).toBe(true);
		expect(eventCoversDay(span, new Date(2026, 5, 25))).toBe(true);
		expect(eventCoversDay(span, new Date(2026, 5, 26))).toBe(true);
		expect(eventCoversDay(span, new Date(2026, 5, 27))).toBe(false);
	});

	it("keeps an event ending at midnight on the earlier day", () => {
		const untilMidnight = event({
			start: new Date(2026, 5, 24, 23, 0),
			end: new Date(2026, 5, 25, 0, 0),
		});
		expect(eventCoversDay(untilMidnight, new Date(2026, 5, 24))).toBe(true);
		expect(eventCoversDay(untilMidnight, new Date(2026, 5, 25))).toBe(false);
	});
});

describe("isAllDay", () => {
	it("is true when explicit, or when the span reaches a full day", () => {
		expect(
			isAllDay(event({ start: new Date(2026, 5, 25), allDay: true })),
		).toBe(true);
		expect(
			isAllDay(
				event({ start: new Date(2026, 5, 24), end: new Date(2026, 5, 25) }),
			),
		).toBe(true);
		expect(
			isAllDay(
				event({
					start: new Date(2026, 5, 25, 10, 0),
					end: new Date(2026, 5, 25, 11, 0),
				}),
			),
		).toBe(false);
	});
});

describe("layoutDay", () => {
	const day = new Date(2026, 5, 25);

	it("packs overlapping events into side-by-side lanes", () => {
		const segments = layoutDay(
			[
				event({
					id: "a",
					start: new Date(2026, 5, 25, 10, 0),
					end: new Date(2026, 5, 25, 11, 0),
				}),
				event({
					id: "b",
					start: new Date(2026, 5, 25, 10, 30),
					end: new Date(2026, 5, 25, 11, 30),
				}),
			],
			day,
		);
		expect(segments).toHaveLength(2);
		expect(segments.every((segment) => segment.lanes === 2)).toBe(true);
		expect(new Set(segments.map((segment) => segment.lane))).toEqual(
			new Set([0, 1]),
		);
	});

	it("gives non-overlapping events a single full-width lane", () => {
		const segments = layoutDay(
			[
				event({
					id: "a",
					start: new Date(2026, 5, 25, 9, 0),
					end: new Date(2026, 5, 25, 10, 0),
				}),
				event({
					id: "b",
					start: new Date(2026, 5, 25, 11, 0),
					end: new Date(2026, 5, 25, 12, 0),
				}),
			],
			day,
		);
		expect(
			segments.every((segment) => segment.lanes === 1 && segment.lane === 0),
		).toBe(true);
	});

	it("clips to the visible hour range and drops all-day events", () => {
		const segments = layoutDay(
			[
				event({
					id: "s",
					start: new Date(2026, 5, 25, 6, 0),
					end: new Date(2026, 5, 25, 12, 0),
				}),
				event({ id: "ad", start: new Date(2026, 5, 25), allDay: true }),
			],
			day,
			[8, 18],
		);
		expect(segments).toHaveLength(1);
		expect(segments[0]?.startMin).toBe(8 * 60);
	});
});

describe("viewLabel", () => {
	it("labels the month, the day and a week inside one month", () => {
		expect(viewLabel("month", JUNE_2026, 1, "en-US")).toBe("June 2026");
		expect(viewLabel("day", new Date(2026, 5, 25), 1, "en-US")).toBe(
			"Thursday, June 25, 2026",
		);
		expect(viewLabel("week", new Date(2026, 5, 25), 1, "en-US")).toBe(
			"June 2026",
		);
	});

	it("reads a week spanning two months as a range", () => {
		expect(viewLabel("week", new Date(2026, 6, 30), 1, "en-US")).toContain(
			"July",
		);
		expect(viewLabel("week", new Date(2026, 6, 30), 1, "en-US")).toContain(
			"August 2026",
		);
	});

	it("follows the requested locale", () => {
		expect(viewLabel("month", JUNE_2026, 1, "fr-FR")).toBe("juin 2026");
	});
});

describe("EventCalendar.MonthView", () => {
	it("renders a timed event in its day cell", () => {
		const screen = render(
			<EventCalendar.MonthView
				date={JUNE_2026}
				locale="en-US"
				events={[
					event({
						id: "1",
						title: "Standup",
						start: new Date(2026, 5, 10, 10, 0),
					}),
				]}
			/>,
		);
		const cell = screen.getByRole("cell", { name: "June 10, 2026" });
		expect(cell.textContent).toContain("Standup");
	});

	it("collapses past maxPerDay into a +n more line", () => {
		const day = new Date(2026, 5, 10, 9, 0);
		const screen = render(
			<EventCalendar.MonthView
				date={JUNE_2026}
				maxPerDay={1}
				events={[
					event({ id: "1", title: "First", start: day }),
					event({ id: "2", title: "Second", start: day }),
				]}
			/>,
		);
		expect(screen.getByText("+1 more")).toBeDefined();
	});
});

describe("EventCalendar.DayView", () => {
	it("renders a timed event block and fires onEventClick", () => {
		const onEventClick = vi.fn();
		const screen = render(
			<EventCalendar.DayView
				date={new Date(2026, 5, 25)}
				onEventClick={onEventClick}
				events={[
					event({
						id: "1",
						title: "Demo",
						start: new Date(2026, 5, 25, 14, 0),
						end: new Date(2026, 5, 25, 15, 0),
					}),
				]}
			/>,
		);
		fireEvent.click(screen.getByText("Demo"));
		expect(onEventClick).toHaveBeenCalledWith(
			expect.objectContaining({ id: "1" }),
		);
	});

	it("renders the meta lines under an event title", () => {
		const screen = render(
			<EventCalendar.DayView
				date={new Date(2026, 5, 25)}
				events={[
					event({
						id: "1",
						title: "Demo",
						start: new Date(2026, 5, 25, 14, 0),
						meta: ["Owner: Sam", "Priority: High"],
					}),
				]}
			/>,
		);
		expect(screen.getByText("Owner: Sam")).toBeDefined();
		expect(screen.getByText("Priority: High")).toBeDefined();
	});
});

describe("EventCalendar.Root", () => {
	it("navigates by period from the toolbar", () => {
		const screen = render(
			<EventCalendar.Root
				defaultDate={JUNE_2026}
				defaultView="month"
				locale="en-US"
			/>,
		);
		expect(screen.getByRole("heading", { name: "June 2026" })).toBeDefined();

		fireEvent.click(screen.getByRole("button", { name: "Next" }));
		expect(screen.getByRole("heading", { name: "July 2026" })).toBeDefined();

		fireEvent.click(screen.getByRole("button", { name: "Today" }));
		expect(screen.queryByRole("heading", { name: "July 2026" })).toBeNull();
	});

	it("switches view from the toggle", async () => {
		const onViewChange = vi.fn();
		const screen = render(
			<EventCalendar.Root
				defaultDate={JUNE_2026}
				defaultView="month"
				locale="en-US"
				onViewChange={onViewChange}
			/>,
		);
		fireEvent.click(screen.getByRole("radio", { name: "Day" }));
		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: "Monday, June 15, 2026" }),
			).toBeDefined();
		});
		expect(onViewChange).toHaveBeenCalledWith("day");
	});

	it("stays on the controlled view", () => {
		const screen = render(
			<EventCalendar.Root
				defaultDate={JUNE_2026}
				view="month"
				locale="en-US"
				onViewChange={vi.fn()}
			/>,
		);
		fireEvent.click(screen.getByRole("radio", { name: "Day" }));
		expect(screen.getByRole("heading", { name: "June 2026" })).toBeDefined();
	});

	it("exposes the structural slots", () => {
		const screen = render(
			<EventCalendar.Root defaultDate={JUNE_2026} defaultView="month" />,
		);
		const root = screen.baseElement.querySelector("[data-slot=event-calendar]");
		expect(root).not.toBeNull();
		expect(root?.getAttribute("data-view")).toBe("month");
		expect(
			screen.baseElement.querySelector("[data-slot=event-calendar-toolbar]"),
		).not.toBeNull();
		expect(
			screen.baseElement.querySelector("[data-slot=event-calendar-month-view]"),
		).not.toBeNull();
	});

	it("hides the toolbar on request", () => {
		const screen = render(
			<EventCalendar.Root
				defaultDate={JUNE_2026}
				defaultView="month"
				hideToolbar
			/>,
		);
		expect(
			screen.baseElement.querySelector("[data-slot=event-calendar-toolbar]"),
		).toBeNull();
	});
});
