// @vitest-environment jsdom
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimePicker } from "#/time-picker/components/time-picker.tsx";

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

const nativeField = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=native-time-picker]",
	);

const trigger = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=time-picker-trigger]");

describe("TimePicker.Native", () => {
	it("holds an HH:mm value, never a Date", () => {
		const screen = render(<TimePicker.Native value="14:30" />);
		expect(nativeField(screen)?.type).toBe("time");
		expect(nativeField(screen)?.value).toBe("14:30");
	});

	it("reports the picked time, and null when cleared", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<TimePicker.Native value="14:30" onValueChange={onValueChange} />,
		);
		fireEvent.change(nativeField(screen) as HTMLInputElement, {
			target: { value: "08:15" },
		});
		expect(onValueChange).toHaveBeenCalledWith("08:15");

		fireEvent.change(nativeField(screen) as HTMLInputElement, {
			target: { value: "" },
		});
		expect(onValueChange).toHaveBeenLastCalledWith(null);
	});

	it("carries min and max onto the field", () => {
		const screen = render(<TimePicker.Native min="08:00" max="18:00" />);
		expect(nativeField(screen)?.getAttribute("min")).toBe("08:00");
		expect(nativeField(screen)?.getAttribute("max")).toBe("18:00");
	});
});

describe("TimePicker.Responsive", () => {
	it("renders the option list on desktop and the OS field on mobile", () => {
		const screen = render(
			<TimePicker.Responsive locale="fr-FR" defaultValue="14:30" />,
		);
		expect(trigger(screen)).not.toBeNull();
		expect(nativeField(screen)).toBeNull();

		resizeTo(MOBILE_WIDTH);
		expect(trigger(screen)).toBeNull();
		expect(nativeField(screen)?.value).toBe("14:30");
	});

	it("keeps the selection across the breakpoint", () => {
		const screen = render(<TimePicker.Responsive defaultValue="14:30" />);
		resizeTo(MOBILE_WIDTH);
		fireEvent.change(nativeField(screen) as HTMLInputElement, {
			target: { value: "08:15" },
		});
		resizeTo(DESKTOP_WIDTH);
		expect(trigger(screen)?.textContent).toContain("8:15");
	});
});
