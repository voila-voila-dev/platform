// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	DateTimePicker,
	DateTimeRangeInput,
	NativeDateTimeInput,
	ResponsiveDateTimeInput,
} from "#/components/date-time-picker.tsx";

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
	// jsdom lacks matchMedia, used by `useIsMobile` in ResponsiveDateTimeInput.
	vi.stubGlobal("matchMedia", (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addEventListener() {},
		removeEventListener() {},
		addListener() {},
		removeListener() {},
		dispatchEvent: () => false,
	}));
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const queryTrigger = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=date-time-picker-trigger]");

const queryContent = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=date-time-picker-content]");

const queryOptions = (screen: ReturnType<typeof render>) =>
	Array.from(screen.baseElement.querySelectorAll("[role=option]"));

const queryNativeInput = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector(
		"input[data-slot=native-date-time-picker]",
	) as HTMLInputElement | null;

describe("DateTimePicker", () => {
	it("shows the placeholder and marks the trigger empty when nothing is selected", () => {
		const screen = render(<DateTimePicker placeholder="Project start" />);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("Project start");
		expect(trigger?.getAttribute("data-empty")).toBe("true");
	});

	it("formats the selected datetime on the trigger (Intl medium+short, en default)", () => {
		const screen = render(
			<DateTimePicker value={new Date(2026, 5, 20, 14, 30)} />,
		);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("2026");
		expect(trigger?.textContent).toContain("2:30 PM");
		expect(trigger?.getAttribute("data-empty")).toBeNull();
	});

	it("formats the trigger label with the provided locale", () => {
		const screen = render(
			<DateTimePicker locale="fr-FR" value={new Date(2026, 5, 20, 14, 30)} />,
		);
		expect(queryTrigger(screen)?.textContent).toContain("14:30");
		expect(queryTrigger(screen)?.textContent).not.toContain("PM");
	});

	it("lists a full day of time options at the given step", async () => {
		const screen = render(<DateTimePicker minuteStep={30} defaultOpen />);
		await waitFor(() => {
			const options = queryOptions(screen);
			expect(options.length).toBe(48);
			expect(options[0]?.textContent).toBe("12:00 AM");
		});
	});

	it("selecting a time combines it with the date, fires onValueChange, and closes", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DateTimePicker
				value={new Date(2026, 5, 20, 0, 0)}
				onValueChange={onValueChange}
				defaultOpen
			/>,
		);
		await waitFor(() => {
			expect(queryOptions(screen).length).toBeGreaterThan(0);
		});
		const target = queryOptions(screen).find(
			(option) => option.textContent === "9:30 AM",
		);
		fireEvent.click(target as Element);
		await waitFor(() => {
			expect(queryContent(screen)).toBeNull();
		});
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const committed = onValueChange.mock.calls[0]?.[0] as Date;
		expect(committed.getFullYear()).toBe(2026);
		expect(committed.getMonth()).toBe(5);
		expect(committed.getDate()).toBe(20);
		expect(committed.getHours()).toBe(9);
		expect(committed.getMinutes()).toBe(30);
	});

	it("selecting a day defaults the time to 09:00 and keeps the popover open", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DateTimePicker
				onValueChange={onValueChange}
				calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
				defaultOpen
			/>,
		);
		const content = queryContent(screen) as Element;
		await waitFor(() => {
			expect(content.querySelectorAll("button").length).toBeGreaterThan(0);
		});
		const day = Array.from(content.querySelectorAll("button")).find(
			(button) =>
				button.getAttribute("role") !== "option" &&
				button.textContent?.trim() === "15",
		);
		fireEvent.click(day as Element);
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const committed = onValueChange.mock.calls[0]?.[0] as Date;
		expect(committed.getDate()).toBe(15);
		expect(committed.getHours()).toBe(9);
		expect(committed.getMinutes()).toBe(0);
		// The popover stays open so a time can still be picked.
		expect(queryContent(screen)).not.toBeNull();
	});

	it("serializes the value into a hidden form input as yyyy-MM-ddTHH:mm", () => {
		const screen = render(
			<DateTimePicker
				name="projectStart"
				value={new Date(2026, 5, 20, 9, 30)}
			/>,
		);
		const input = screen.baseElement.querySelector(
			'input[type=hidden][name="projectStart"]',
		) as HTMLInputElement;
		expect(input).not.toBeNull();
		expect(input.value).toBe("2026-06-20T09:30");
	});

	it("does not open when disabled", () => {
		const screen = render(<DateTimePicker disabled />);
		const trigger = queryTrigger(screen) as HTMLButtonElement;
		expect(trigger.disabled).toBe(true);
		fireEvent.click(trigger);
		expect(queryContent(screen)).toBeNull();
	});
});

describe("NativeDateTimeInput", () => {
	it("renders a native datetime-local input", () => {
		const screen = render(<NativeDateTimeInput />);
		expect(queryNativeInput(screen)?.type).toBe("datetime-local");
	});

	it("renders a Date value as the local datetime-local string", () => {
		const screen = render(
			<NativeDateTimeInput value={new Date(2026, 5, 20, 14, 30)} />,
		);
		expect(queryNativeInput(screen)?.value).toBe("2026-06-20T14:30");
	});

	it("fires onValueChange with a parsed Date", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<NativeDateTimeInput onValueChange={onValueChange} />,
		);
		const input = queryNativeInput(screen) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "2026-06-20T14:30" } });
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const committed = onValueChange.mock.calls[0]?.[0] as Date;
		expect(committed.getHours()).toBe(14);
		expect(committed.getMinutes()).toBe(30);
	});

	it("fires onValueChange with null when cleared", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<NativeDateTimeInput
				value={new Date(2026, 5, 20, 14, 30)}
				onValueChange={onValueChange}
			/>,
		);
		const input = queryNativeInput(screen) as HTMLInputElement;
		fireEvent.change(input, { target: { value: "" } });
		expect(onValueChange).toHaveBeenCalledWith(null);
	});
});

describe("ResponsiveDateTimeInput", () => {
	it("renders the Base UI picker trigger on desktop", async () => {
		Object.defineProperty(window, "innerWidth", {
			value: 1024,
			configurable: true,
		});
		const screen = render(<ResponsiveDateTimeInput placeholder="When" />);
		await waitFor(() => {
			expect(queryTrigger(screen)).not.toBeNull();
			expect(queryNativeInput(screen)).toBeNull();
		});
	});

	it("renders the native input under the mobile breakpoint", async () => {
		Object.defineProperty(window, "innerWidth", {
			value: 500,
			configurable: true,
		});
		const screen = render(<ResponsiveDateTimeInput />);
		await waitFor(() => {
			expect(queryNativeInput(screen)).not.toBeNull();
			expect(queryTrigger(screen)).toBeNull();
		});
	});
});

describe("DateTimeRangeInput", () => {
	beforeEach(() => {
		// Drive the desktop surface so the two triggers are the Base UI pickers.
		Object.defineProperty(window, "innerWidth", {
			value: 1024,
			configurable: true,
		});
	});

	it("renders the start and end labels", () => {
		const screen = render(
			<DateTimeRangeInput startLabel="From" endLabel="To" />,
		);
		expect(screen.getByText("From")).not.toBeNull();
		expect(screen.getByText("To")).not.toBeNull();
	});

	it("seeds the end an hour after the start when the end is empty", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DateTimeRangeInput
				defaultValue={{ start: new Date(2026, 5, 20, 9, 0), end: null }}
				onValueChange={onValueChange}
			/>,
		);
		// The first trigger is the start field; opening it lists that day's times.
		const startTrigger = screen.baseElement.querySelectorAll(
			"[data-slot=date-time-picker-trigger]",
		)[0] as HTMLButtonElement;
		fireEvent.click(startTrigger);
		await waitFor(() => {
			expect(queryOptions(screen).length).toBeGreaterThan(0);
		});
		const option = queryOptions(screen).find(
			(candidate) => candidate.textContent === "10:00 AM",
		);
		fireEvent.click(option as Element);
		expect(onValueChange).toHaveBeenCalledTimes(1);
		const range = onValueChange.mock.calls[0]?.[0] as {
			start: Date;
			end: Date;
		};
		expect(range.start.getHours()).toBe(10);
		expect(range.end.getHours()).toBe(11);
		expect(range.end.getMinutes()).toBe(0);
	});

	it("leaves an existing later end untouched when the start moves", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DateTimeRangeInput
				defaultValue={{
					start: new Date(2026, 5, 20, 9, 0),
					end: new Date(2026, 5, 20, 18, 0),
				}}
				onValueChange={onValueChange}
			/>,
		);
		const startTrigger = screen.baseElement.querySelectorAll(
			"[data-slot=date-time-picker-trigger]",
		)[0] as HTMLButtonElement;
		fireEvent.click(startTrigger);
		await waitFor(() => {
			expect(queryOptions(screen).length).toBeGreaterThan(0);
		});
		const option = queryOptions(screen).find(
			(candidate) => candidate.textContent === "10:00 AM",
		);
		fireEvent.click(option as Element);
		const range = onValueChange.mock.calls[0]?.[0] as {
			start: Date;
			end: Date;
		};
		expect(range.start.getHours()).toBe(10);
		// 18:00 is already after the new start, so it is preserved.
		expect(range.end.getHours()).toBe(18);
	});
});
