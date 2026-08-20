// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DatePicker } from "#/date-picker/components/date-picker.tsx";

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

const JUNE_20 = new Date(2026, 5, 20);

// `useIsMobile` re-reads `window.innerWidth` whenever a media-query listener
// fires, so resizing = set the width + notify every listener.
const mediaQueryListeners = new Set<() => void>();

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

function resizeTo(width: number) {
	act(() => {
		setViewportWidth(width);
		for (const listener of mediaQueryListeners) {
			listener();
		}
	});
}

beforeEach(() => {
	setViewportWidth(DESKTOP_WIDTH);
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: (_event: string, listener: () => void) => {
				mediaQueryListeners.add(listener);
			},
			removeEventListener: (_event: string, listener: () => void) => {
				mediaQueryListeners.delete(listener);
			},
		})),
	);
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
	mediaQueryListeners.clear();
	vi.unstubAllGlobals();
});

const queryTrigger = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=date-picker-trigger]");

const nativeFields = (screen: ReturnType<typeof render>) => [
	...screen.baseElement.querySelectorAll<HTMLInputElement>(
		"[data-slot=native-date-picker]",
	),
];

describe("DatePicker.Native", () => {
	it("shows a Date as the input's local day", () => {
		const screen = render(<DatePicker.Native value={JUNE_20} />);
		const field = nativeFields(screen)[0];
		expect(field?.type).toBe("date");
		expect(field?.value).toBe("2026-06-20");
	});

	it("reports the picked day as a local Date", () => {
		const onValueChange = vi.fn();
		const screen = render(<DatePicker.Native onValueChange={onValueChange} />);
		fireEvent.change(nativeFields(screen)[0] as HTMLInputElement, {
			target: { value: "1990-03-08" },
		});
		const picked: Date = onValueChange.mock.calls[0]?.[0];
		expect(picked.getFullYear()).toBe(1990);
		expect(picked.getMonth()).toBe(2);
		expect(picked.getDate()).toBe(8);
	});

	it("reports null when cleared, and serializes min/max", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DatePicker.Native
				value={JUNE_20}
				onValueChange={onValueChange}
				min={new Date(1900, 0, 1)}
				max={new Date(2008, 11, 31)}
			/>,
		);
		const field = nativeFields(screen)[0] as HTMLInputElement;
		expect(field.getAttribute("min")).toBe("1900-01-01");
		expect(field.getAttribute("max")).toBe("2008-12-31");
		fireEvent.change(field, { target: { value: "" } });
		expect(onValueChange).toHaveBeenCalledWith(null);
	});
});

describe("DatePicker.Responsive", () => {
	it("renders the popover trigger on desktop and the OS field on mobile", () => {
		const screen = render(
			<DatePicker.Responsive locale="fr-FR" defaultValue={JUNE_20} />,
		);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
		expect(nativeFields(screen)).toHaveLength(0);

		resizeTo(MOBILE_WIDTH);
		expect(queryTrigger(screen)).toBeNull();
		expect(nativeFields(screen)[0]?.value).toBe("2026-06-20");
	});

	it("keeps the selection across the breakpoint", () => {
		const screen = render(
			<DatePicker.Responsive locale="fr-FR" defaultValue={JUNE_20} />,
		);
		resizeTo(MOBILE_WIDTH);
		resizeTo(DESKTOP_WIDTH);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
	});

	it("gives the desktop calendar month and year dropdowns", async () => {
		const screen = render(<DatePicker.Responsive defaultOpen />);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("select.rdp-years_dropdown"),
			).not.toBeNull();
			expect(
				screen.baseElement.querySelector("select.rdp-months_dropdown"),
			).not.toBeNull();
		});
	});

	it("reaches a birth year, and stops at max", async () => {
		const screen = render(
			<DatePicker.Responsive
				min={new Date(1900, 0, 1)}
				max={new Date(2008, 11, 31)}
				defaultOpen
			/>,
		);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("select.rdp-years_dropdown"),
			).not.toBeNull();
		});
		const years = screen.baseElement.querySelector(
			"select.rdp-years_dropdown",
		) as HTMLSelectElement;
		const values = [...years.options].map((option) => option.value);
		expect(values).toContain("1990");
		expect(values).toContain("1900");
		expect(values).not.toContain("2009");
	});

	it("reaches next year by default, where react-day-picker would stop at December", async () => {
		const nextYear = String(new Date().getFullYear() + 1);
		const screen = render(<DatePicker.Responsive defaultOpen />);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("select.rdp-years_dropdown"),
			).not.toBeNull();
		});
		const years = screen.baseElement.querySelector(
			"select.rdp-years_dropdown",
		) as HTMLSelectElement;
		expect([...years.options].map((option) => option.value)).toContain(
			nextYear,
		);
	});

	it("disables the days outside min and max, keeping the caller's own matcher", async () => {
		const screen = render(
			<DatePicker.Responsive
				locale="fr-FR"
				min={new Date(2026, 5, 10)}
				calendarProps={{
					defaultMonth: new Date(2026, 5, 1),
					disabled: { dayOfWeek: [0] },
				}}
				defaultOpen
			/>,
		);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector(
					'[data-slot=calendar-day-button][data-day="14/06/2026"]',
				),
			).not.toBeNull();
		});
		const dayAt = (day: string) =>
			screen.baseElement.querySelector(
				`[data-slot=calendar-day-button][data-day="${day}"]`,
			) as HTMLButtonElement;
		// 09/06 is before `min`, 14/06 is a Sunday: both matchers still apply.
		expect(dayAt("09/06/2026").disabled).toBe(true);
		expect(dayAt("14/06/2026").disabled).toBe(true);
		expect(dayAt("15/06/2026").disabled).toBe(false);
	});
});

describe("DatePicker.NativeRange", () => {
	it("lays out two bound day fields", () => {
		const screen = render(
			<DatePicker.NativeRange
				value={{ from: new Date(2026, 5, 9), to: new Date(2026, 5, 13) }}
				fromLabel="Début"
				toLabel="Fin"
			/>,
		);
		const fields = nativeFields(screen);
		expect(fields).toHaveLength(2);
		expect(fields[0]?.value).toBe("2026-06-09");
		expect(fields[1]?.value).toBe("2026-06-13");
	});

	it("keeps the end from falling before the start", () => {
		const screen = render(
			<DatePicker.NativeRange
				value={{ from: new Date(2026, 5, 9), to: new Date(2026, 5, 13) }}
			/>,
		);
		const [from, to] = nativeFields(screen);
		// Each side bounds the other, so an inverted range cannot be typed in.
		expect(to?.getAttribute("min")).toBe("2026-06-09");
		expect(from?.getAttribute("max")).toBe("2026-06-13");
	});

	it("drops an end that a new start has overtaken", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<DatePicker.NativeRange
				value={{ from: new Date(2026, 5, 9), to: new Date(2026, 5, 13) }}
				onValueChange={onValueChange}
			/>,
		);
		fireEvent.change(nativeFields(screen)[0] as HTMLInputElement, {
			target: { value: "2026-06-20" },
		});
		expect(onValueChange.mock.lastCall?.[0].to).toBeUndefined();
	});

	it("names the two hidden sides apart", () => {
		const screen = render(<DatePicker.NativeRange name="window" />);
		const fields = nativeFields(screen);
		expect(fields[0]?.getAttribute("name")).toBe("window-from");
		expect(fields[1]?.getAttribute("name")).toBe("window-to");
	});
});

describe("DatePicker.ResponsiveRange", () => {
	it("switches both sides at the breakpoint", () => {
		const screen = render(
			<DatePicker.ResponsiveRange
				locale="fr-FR"
				value={{ from: new Date(2026, 5, 9), to: new Date(2026, 5, 13) }}
			/>,
		);
		expect(
			screen.baseElement.querySelectorAll("[data-slot=date-picker-trigger]"),
		).toHaveLength(2);
		expect(nativeFields(screen)).toHaveLength(0);

		resizeTo(MOBILE_WIDTH);
		expect(nativeFields(screen)).toHaveLength(2);
		expect(nativeFields(screen)[1]?.value).toBe("2026-06-13");
	});
});
