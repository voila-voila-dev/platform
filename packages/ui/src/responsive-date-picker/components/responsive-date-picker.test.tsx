// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ResponsiveDatePicker } from "#/responsive-date-picker/components/responsive-date-picker.tsx";

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

const queryNativeField = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=native-date-picker]",
	);

describe("ResponsiveDatePicker", () => {
	it("renders the popover trigger on desktop", () => {
		const screen = render(
			<ResponsiveDatePicker.Root locale="fr-FR" defaultValue={JUNE_20} />,
		);
		expect(queryNativeField(screen)).toBeNull();
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
	});

	it("renders the OS date field under the mobile breakpoint", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(<ResponsiveDatePicker.Root defaultValue={JUNE_20} />);
		expect(queryTrigger(screen)).toBeNull();
		const field = queryNativeField(screen);
		expect(field?.type).toBe("date");
		expect(field?.value).toBe("2026-06-20");
	});

	it("reports the day picked in the native field as a local Date", () => {
		setViewportWidth(MOBILE_WIDTH);
		const onValueChange = vi.fn();
		const screen = render(
			<ResponsiveDatePicker.Root onValueChange={onValueChange} />,
		);
		fireEvent.change(queryNativeField(screen) as HTMLInputElement, {
			target: { value: "1990-03-08" },
		});
		const picked: Date = onValueChange.mock.calls[0]?.[0];
		expect(picked.getFullYear()).toBe(1990);
		expect(picked.getMonth()).toBe(2);
		expect(picked.getDate()).toBe(8);
	});

	it("reports null when the native field is cleared", () => {
		setViewportWidth(MOBILE_WIDTH);
		const onValueChange = vi.fn();
		const screen = render(
			<ResponsiveDatePicker.Root
				defaultValue={JUNE_20}
				onValueChange={onValueChange}
			/>,
		);
		fireEvent.change(queryNativeField(screen) as HTMLInputElement, {
			target: { value: "" },
		});
		expect(onValueChange).toHaveBeenCalledWith(null);
	});

	it("bounds the native field with min and max", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(
			<ResponsiveDatePicker.Root
				min={new Date(1900, 0, 1)}
				max={new Date(2008, 11, 31)}
			/>,
		);
		const field = queryNativeField(screen);
		expect(field?.getAttribute("min")).toBe("1900-01-01");
		expect(field?.getAttribute("max")).toBe("2008-12-31");
	});

	it("keeps the selection when the viewport crosses the breakpoint", () => {
		const screen = render(
			<ResponsiveDatePicker.Root locale="fr-FR" defaultValue={JUNE_20} />,
		);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
		resizeTo(MOBILE_WIDTH);
		expect(queryNativeField(screen)?.value).toBe("2026-06-20");
		resizeTo(DESKTOP_WIDTH);
		expect(queryTrigger(screen)?.textContent).toContain("20 juin 2026");
	});

	it("gives the desktop calendar month and year dropdowns", async () => {
		const screen = render(<ResponsiveDatePicker.Root defaultOpen />);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("select.rdp-years_dropdown"),
			).not.toBeNull();
			expect(
				screen.baseElement.querySelector("select.rdp-months_dropdown"),
			).not.toBeNull();
		});
	});

	it("reaches a birth year through the year dropdown when min goes back that far", async () => {
		const screen = render(
			<ResponsiveDatePicker.Root
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
		// RDP's own dropdown fallback ends the navigation range at the end of the
		// current year, which would put every future date out of reach.
		const nextYear = String(new Date().getFullYear() + 1);
		const screen = render(<ResponsiveDatePicker.Root defaultOpen />);
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

	it("disables the days outside min and max on the desktop calendar", async () => {
		const screen = render(
			<ResponsiveDatePicker.Root
				locale="fr-FR"
				min={new Date(2026, 5, 10)}
				max={new Date(2026, 5, 20)}
				calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
				defaultOpen
			/>,
		);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector(
					'[data-slot=calendar-day-button][data-day="15/06/2026"]',
				),
			).not.toBeNull();
		});
		const dayAt = (day: string) =>
			screen.baseElement.querySelector(
				`[data-slot=calendar-day-button][data-day="${day}"]`,
			) as HTMLButtonElement;
		expect(dayAt("09/06/2026").disabled).toBe(true);
		expect(dayAt("15/06/2026").disabled).toBe(false);
		expect(dayAt("21/06/2026").disabled).toBe(true);
	});

	it("keeps the bounds when the caller passes its own disabled matcher", async () => {
		const screen = render(
			<ResponsiveDatePicker.Root
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

	it("forwards the field identity to both surfaces", () => {
		const screen = render(
			<ResponsiveDatePicker.Root
				id="birth-date"
				name="birthDate"
				aria-invalid
				className="w-full"
			/>,
		);
		const trigger = queryTrigger(screen);
		expect(trigger?.getAttribute("id")).toBe("birth-date");
		expect(trigger?.getAttribute("aria-invalid")).toBe("true");
		expect(trigger?.classList.contains("w-full")).toBe(true);

		resizeTo(MOBILE_WIDTH);
		const field = queryNativeField(screen);
		expect(field?.getAttribute("id")).toBe("birth-date");
		expect(field?.getAttribute("name")).toBe("birthDate");
		expect(field?.getAttribute("aria-invalid")).toBe("true");
		expect(
			screen.baseElement
				.querySelector("[data-slot=native-date-picker-wrapper]")
				?.classList.contains("w-full"),
		).toBe(true);
	});
});
