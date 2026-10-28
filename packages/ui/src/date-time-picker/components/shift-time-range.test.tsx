// @vitest-environment jsdom
import {
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DateTimePicker } from "#/date-time-picker/components/date-time-picker.tsx";

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

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

const NIGHT = {
	start: new Date(2026, 5, 20, 20, 0),
	end: new Date(2026, 5, 21, 2, 0),
};

const trigger = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector(
		"[data-slot=shift-time-range-trigger]",
	) as HTMLElement | null;

describe("DateTimePicker.ShiftRange", () => {
	it("labels an overnight shift with both of its days", () => {
		const screen = render(
			<DateTimePicker.ShiftRange locale="fr-FR" value={NIGHT} />,
		);
		const label = trigger(screen)?.textContent ?? "";
		// Each end owns its date, which is the whole reason this component exists.
		expect(label).toContain("20");
		expect(label).toContain("21");
	});

	it("wears the field look on both surfaces", () => {
		const screen = render(<DateTimePicker.ShiftRange value={NIGHT} />);
		expect(trigger(screen)?.className).toContain("justify-start");
		resizeTo(MOBILE_WIDTH);
		expect(trigger(screen)?.className).toContain("justify-start");
	});

	it("opens the anchored popover on desktop", async () => {
		const screen = render(<DateTimePicker.ShiftRange value={NIGHT} />);
		fireEvent.click(trigger(screen) as HTMLElement);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector(
					"[data-slot=shift-time-range-content]",
				),
			).not.toBeNull();
		});
		// The content slot is the same on both surfaces; the drawer chrome is what
		// tells them apart.
		expect(
			screen.baseElement.querySelector("[data-slot=drawer-overlay]"),
		).toBeNull();
	});

	it("opens the same body as a drawer under the mobile breakpoint", async () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(
			<DateTimePicker.ShiftRange value={NIGHT} placeholder="Vacation" />,
		);
		fireEvent.click(trigger(screen) as HTMLElement);
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector("[data-slot=drawer-overlay]"),
			).not.toBeNull();
		});
		const content = screen.baseElement.querySelector(
			"[data-slot=shift-time-range-content]",
		);
		expect(content).not.toBeNull();
		// The tabs and the calendar come along; only the container changed.
		expect(
			content?.querySelector("[data-slot=shift-step-tabs]"),
		).not.toBeNull();
		expect(content?.querySelector("[data-slot=calendar]")).not.toBeNull();
		// Radix needs a heading; the placeholder already names the field.
		expect(
			screen.baseElement.querySelector("[data-slot=drawer-title]")?.textContent,
		).toBe("Vacation");
	});

	it("keeps the shift when the viewport crosses the breakpoint", () => {
		const screen = render(
			<DateTimePicker.ShiftRange locale="fr-FR" value={NIGHT} />,
		);
		const desktopLabel = trigger(screen)?.textContent;
		resizeTo(MOBILE_WIDTH);
		expect(trigger(screen)?.textContent).toBe(desktopLabel);
	});

	it("stays shut while disabled", () => {
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(<DateTimePicker.ShiftRange value={NIGHT} disabled />);
		fireEvent.click(trigger(screen) as HTMLElement);
		expect(
			screen.baseElement.querySelector("[data-slot=drawer-overlay]"),
		).toBeNull();
	});
});
