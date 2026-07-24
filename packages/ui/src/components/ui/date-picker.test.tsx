// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DatePicker, DateRangePicker } from "#/components/ui/date-picker.tsx";

beforeEach(() => {
	// Base UI's Positioner measures the anchor with ResizeObserver, absent in jsdom.
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			unobserve() {}
			disconnect() {}
		},
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const JUNE_2026 = new Date(2026, 5, 1);
const JUNE_20 = new Date(2026, 5, 20);

const queryTrigger = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=date-picker-trigger]");

const queryContent = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=date-picker-content]");

// data-day is formatted with toLocaleDateString(locale.code); the fr locale
// gives a deterministic dd/mm/yyyy regardless of the host's default locale.
const queryDay = (screen: ReturnType<typeof render>, day: string) =>
	screen.baseElement.querySelector(`[data-slot=button][data-day="${day}"]`);

describe("DatePicker", () => {
	it("shows the placeholder and marks the trigger empty when nothing is selected", () => {
		const screen = render(<DatePicker placeholder="Project date" />);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("Project date");
		expect(trigger?.getAttribute("data-empty")).toBe("true");
	});

	it("formats the selected date on the trigger (Intl long date, en default)", () => {
		const screen = render(<DatePicker defaultValue={JUNE_20} />);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("June 20, 2026");
		expect(trigger?.getAttribute("data-empty")).toBeNull();
	});

	it("formats the trigger label with the provided locale", () => {
		const screen = render(<DatePicker locale="fr-FR" defaultValue={JUNE_20} />);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
	});

	it("opens the calendar popover on trigger click", async () => {
		const screen = render(
			<DatePicker calendarProps={{ defaultMonth: JUNE_2026 }} />,
		);
		fireEvent.click(queryTrigger(screen) as Element);
		await waitFor(() => {
			expect(queryContent(screen)).not.toBeNull();
			expect(
				screen.baseElement.querySelector("[data-slot=calendar]"),
			).not.toBeNull();
		});
	});

	it("selecting a day fires onValueChange, updates the label, and closes", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DatePicker
				locale="fr-FR"
				onValueChange={onValueChange}
				calendarProps={{ defaultMonth: JUNE_2026 }}
			/>,
		);
		fireEvent.click(queryTrigger(screen) as Element);
		await waitFor(() => {
			expect(queryDay(screen, "20/06/2026")).not.toBeNull();
		});

		fireEvent.click(queryDay(screen, "20/06/2026") as Element);
		await waitFor(() => {
			expect(queryContent(screen)).toBeNull();
		});
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const selected: Date = onValueChange.mock.calls[0]?.[0];
		expect(selected.getFullYear()).toBe(2026);
		expect(selected.getMonth()).toBe(5);
		expect(selected.getDate()).toBe(20);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
	});

	it("serializes the value into a hidden form input as yyyy-MM-dd", () => {
		const screen = render(
			<DatePicker name="projectDate" defaultValue={JUNE_20} />,
		);
		const input = screen.baseElement.querySelector(
			'input[type=hidden][name="projectDate"]',
		) as HTMLInputElement;
		expect(input).not.toBeNull();
		expect(input.value).toBe("2026-06-20");
	});

	it("does not open when disabled", async () => {
		const screen = render(<DatePicker disabled />);
		const trigger = queryTrigger(screen) as HTMLButtonElement;
		expect(trigger.disabled).toBe(true);
		fireEvent.click(trigger);
		expect(queryContent(screen)).toBeNull();
	});

	it("defaults the trigger to the outline button variant", () => {
		// Regression: spreading `variant: undefined` from DatePicker overrode the
		// inner Button's "outline" default, rendering the dark primary variant.
		const screen = render(<DatePicker />);
		expect(queryTrigger(screen)?.getAttribute("data-variant")).toBe("outline");
	});

	it("forwards an explicit variant to the trigger", () => {
		const screen = render(<DatePicker variant="ghost" />);
		expect(queryTrigger(screen)?.getAttribute("data-variant")).toBe("ghost");
	});

	it("merges className and forwards aria-invalid onto the trigger", () => {
		const screen = render(
			<DatePicker className="custom-picker" aria-invalid />,
		);
		const trigger = queryTrigger(screen);
		expect(trigger?.classList.contains("custom-picker")).toBe(true);
		expect(trigger?.getAttribute("aria-invalid")).toBe("true");
	});

	it("forwards calendarProps to the underlying calendar", async () => {
		const screen = render(
			<DatePicker
				calendarProps={{ defaultMonth: JUNE_2026, showWeekNumber: true }}
				defaultOpen
			/>,
		);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector(".rdp-week_number"),
			).not.toBeNull();
		});
	});
});

describe("DateRangePicker", () => {
	it("shows the placeholder when no range is selected", () => {
		const screen = render(<DateRangePicker placeholder="Project window" />);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("Project window");
		expect(trigger?.getAttribute("data-empty")).toBe("true");
	});

	it("formats a complete range with an en dash", () => {
		const screen = render(
			<DateRangePicker
				locale="fr-FR"
				defaultValue={{
					from: new Date(2026, 5, 9),
					to: new Date(2026, 5, 13),
				}}
			/>,
		);
		expect(queryTrigger(screen)?.textContent).toContain(
			"9 juin 2026 – 13 juin 2026",
		);
	});

	it("renders two months by default", async () => {
		const screen = render(
			<DateRangePicker
				calendarProps={{ defaultMonth: JUNE_2026 }}
				defaultOpen
			/>,
		);
		await waitFor(() => {
			expect(screen.baseElement.querySelectorAll(".rdp-month").length).toBe(2);
		});
	});

	it("stays open after the first click and closes once the range is complete", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DateRangePicker
				locale="fr-FR"
				onValueChange={onValueChange}
				calendarProps={{ defaultMonth: JUNE_2026 }}
			/>,
		);
		fireEvent.click(queryTrigger(screen) as Element);
		await waitFor(() => {
			expect(queryDay(screen, "09/06/2026")).not.toBeNull();
		});

		// First click: react-day-picker yields { from, to: from } — incomplete.
		fireEvent.click(queryDay(screen, "09/06/2026") as Element);
		expect(queryContent(screen)).not.toBeNull();

		fireEvent.click(queryDay(screen, "13/06/2026") as Element);
		await waitFor(() => {
			expect(queryContent(screen)).toBeNull();
		});
		const range = onValueChange.mock.lastCall?.[0];
		expect(range?.from?.getDate()).toBe(9);
		expect(range?.to?.getDate()).toBe(13);
		expect(queryTrigger(screen)?.textContent).toContain(
			"9 juin 2026 – 13 juin 2026",
		);
	});

	it("collapses a same-day range to a single date on the trigger", () => {
		const screen = render(
			<DateRangePicker
				locale="fr-FR"
				defaultValue={{ from: JUNE_20, to: JUNE_20 }}
			/>,
		);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
		expect(queryTrigger(screen)?.textContent).not.toContain("–");
	});

	it("serializes the range into -from/-to hidden inputs", () => {
		const screen = render(
			<DateRangePicker
				name="projectWindow"
				defaultValue={{
					from: new Date(2026, 5, 9),
					to: new Date(2026, 5, 13),
				}}
			/>,
		);
		const from = screen.baseElement.querySelector(
			'input[type=hidden][name="projectWindow-from"]',
		) as HTMLInputElement;
		const to = screen.baseElement.querySelector(
			'input[type=hidden][name="projectWindow-to"]',
		) as HTMLInputElement;
		expect(from.value).toBe("2026-06-09");
		expect(to.value).toBe("2026-06-13");
	});
});
