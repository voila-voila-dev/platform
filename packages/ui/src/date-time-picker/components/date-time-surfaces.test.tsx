// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
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

const START = new Date(2026, 5, 20, 9, 0);
const END = new Date(2026, 5, 20, 17, 0);

const nativeFields = (screen: ReturnType<typeof render>) => [
	...screen.baseElement.querySelectorAll<HTMLInputElement>(
		"[data-slot=native-date-time-picker]",
	),
];

const triggers = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelectorAll("[data-slot=date-time-picker-trigger]");

describe("DateTimePicker.NativeRange", () => {
	it("lays out two native instant fields", () => {
		const screen = render(
			<DateTimePicker.NativeRange value={{ start: START, end: END }} />,
		);
		const fields = nativeFields(screen);
		expect(fields).toHaveLength(2);
		expect(fields[0]?.type).toBe("datetime-local");
		expect(fields[0]?.value).toBe("2026-06-20T09:00");
		expect(fields[1]?.value).toBe("2026-06-20T17:00");
	});

	it("bounds the end field with the start, to the minute", () => {
		const screen = render(
			<DateTimePicker.NativeRange value={{ start: START, end: END }} />,
		);
		expect(nativeFields(screen)[1]?.getAttribute("min")).toBe(
			"2026-06-20T09:00",
		);
	});

	it("stays on the native surface above the breakpoint", () => {
		const screen = render(
			<DateTimePicker.NativeRange value={{ start: START, end: END }} />,
		);
		expect(nativeFields(screen)).toHaveLength(2);
		expect(triggers(screen)).toHaveLength(0);
	});
});

describe("DateTimePicker.ResponsiveRange", () => {
	it("switches both sides at the breakpoint, keeping the range", () => {
		const screen = render(
			<DateTimePicker.ResponsiveRange value={{ start: START, end: END }} />,
		);
		expect(nativeFields(screen)).toHaveLength(0);

		resizeTo(MOBILE_WIDTH);
		expect(nativeFields(screen)).toHaveLength(2);
		expect(nativeFields(screen)[0]?.value).toBe("2026-06-20T09:00");

		resizeTo(DESKTOP_WIDTH);
		expect(nativeFields(screen)).toHaveLength(0);
	});

	it("seeds an empty end when a start is picked", () => {
		const onValueChange = vi.fn();
		setViewportWidth(MOBILE_WIDTH);
		const screen = render(
			<DateTimePicker.ResponsiveRange
				value={{ start: null, end: null }}
				onValueChange={onValueChange}
			/>,
		);
		fireEvent.change(nativeFields(screen)[0] as HTMLInputElement, {
			target: { value: "2026-06-20T09:00" },
		});
		const range = onValueChange.mock.lastCall?.[0];
		// Default duration is an hour, so the end lands without a second gesture.
		expect(range.end?.getHours()).toBe(10);
	});
});

describe("DateTimePicker.Range", () => {
	it("keeps our own popover on both surfaces", () => {
		const screen = render(
			<DateTimePicker.Range value={{ start: START, end: END }} />,
		);
		expect(nativeFields(screen)).toHaveLength(0);
		resizeTo(MOBILE_WIDTH);
		expect(nativeFields(screen)).toHaveLength(0);
	});
});
