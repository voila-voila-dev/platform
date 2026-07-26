// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Calendar } from "#/calendar/components/calendar.tsx";

afterEach(cleanup);

const JUNE_2026 = new Date(2026, 5, 1);

function queryRoot(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=calendar]");
}

function queryDayButtons(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll(
			"[data-slot=calendar-day-button][data-day]",
		),
	);
}

describe("Calendar", () => {
	it("renders a calendar root slot", () => {
		const screen = render(
			<Calendar.Root mode="single" defaultMonth={JUNE_2026} />,
		);
		expect(queryRoot(screen)).not.toBeNull();
	});

	it("renders day buttons in selection mode", () => {
		const screen = render(
			<Calendar.Root mode="single" defaultMonth={JUNE_2026} />,
		);
		const days = queryDayButtons(screen);
		// June 2026 has 30 days; the grid also pads with outside days, so >= 30.
		expect(days.length).toBeGreaterThanOrEqual(30);
	});

	it("marks the selected day with data-selected-single", () => {
		const selected = new Date(2026, 5, 20);
		const screen = render(
			<Calendar.Root
				mode="single"
				selected={selected}
				defaultMonth={JUNE_2026}
			/>,
		);
		const selectedButton = screen.baseElement.querySelector(
			"[data-selected-single=true]",
		);
		expect(selectedButton).not.toBeNull();
		expect(
			selectedButton?.classList.contains(
				"data-[selected-single=true]:bg-primary",
			),
		).toBe(true);
	});

	it("formats data-day using the provided locale", () => {
		const selected = new Date(2026, 5, 20);
		const screen = render(
			<Calendar.Root
				mode="single"
				locale="fr-FR"
				selected={selected}
				defaultMonth={JUNE_2026}
			/>,
		);
		const selectedButton = screen.baseElement.querySelector(
			"[data-selected-single=true]",
		);
		// fr-FR formats 20 June 2026 as 20/06/2026.
		expect(selectedButton?.getAttribute("data-day")).toBe("20/06/2026");
	});

	it("unifies the day-button focus ring on the ring-3 scale", () => {
		const screen = render(
			<Calendar.Root mode="single" defaultMonth={JUNE_2026} />,
		);
		const day = queryDayButtons(screen)[0];
		expect(
			day?.classList.contains("group-data-[focused=true]/day:ring-3"),
		).toBe(true);
		expect(
			day?.classList.contains("group-data-[focused=true]/day:ring-[3px]"),
		).toBe(false);
	});

	it("defaults the nav buttons to the ghost variant", () => {
		const screen = render(
			<Calendar.Root mode="single" defaultMonth={JUNE_2026} />,
		);
		const previous = screen.baseElement.querySelector(".rdp-button_previous");
		// ghost contributes hover:bg-muted (see button-variants.ts).
		expect(previous?.classList.contains("hover:bg-muted")).toBe(true);
	});

	it("applies navButtonVariant to the nav buttons only", () => {
		const screen = render(
			<Calendar.Root
				mode="single"
				navButtonVariant="outline"
				defaultMonth={JUNE_2026}
			/>,
		);
		const previous = screen.baseElement.querySelector(".rdp-button_previous");
		const next = screen.baseElement.querySelector(".rdp-button_next");
		// outline contributes border-border; day buttons stay ghost.
		expect(previous?.classList.contains("border-border")).toBe(true);
		expect(next?.classList.contains("border-border")).toBe(true);
		const day = queryDayButtons(screen)[0];
		expect(day?.classList.contains("border-border")).toBe(false);
	});

	it("disables matching days", () => {
		const screen = render(
			<Calendar.Root
				mode="single"
				defaultMonth={JUNE_2026}
				disabled={{ dayOfWeek: [0, 6] }}
			/>,
		);
		const disabledDays = screen.baseElement.querySelectorAll(
			"[data-slot=calendar-day-button][data-day][disabled]",
		);
		// June 2026: 4 Saturdays + 4 Sundays within the month.
		expect(disabledDays.length).toBeGreaterThan(0);
	});

	it("renders week numbers when showWeekNumber is set", () => {
		const screen = render(
			<Calendar.Root mode="single" showWeekNumber defaultMonth={JUNE_2026} />,
		);
		expect(screen.baseElement.querySelector(".rdp-week_number")).not.toBeNull();
	});

	it("merges className onto the calendar root", () => {
		const screen = render(
			<Calendar.Root
				mode="single"
				defaultMonth={JUNE_2026}
				className="custom-calendar-class"
			/>,
		);
		expect(queryRoot(screen)?.classList.contains("custom-calendar-class")).toBe(
			true,
		);
	});
});
