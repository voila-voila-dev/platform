// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useIsMobile } from "#/hooks/use-mobile.ts";

// jsdom has no matchMedia; this minimal stub tracks `change` listeners so the
// tests can drive breakpoint crossings by hand.
let changeListeners: Array<() => void> = [];

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

beforeEach(() => {
	changeListeners = [];
	window.matchMedia = ((query: string) =>
		({
			matches: window.innerWidth < 768,
			media: query,
			addEventListener: (_type: string, listener: () => void) => {
				changeListeners.push(listener);
			},
			removeEventListener: (_type: string, listener: () => void) => {
				changeListeners = changeListeners.filter(
					(existing) => existing !== listener,
				);
			},
		}) as unknown as MediaQueryList) as typeof window.matchMedia;
});

afterEach(cleanup);

describe("useIsMobile", () => {
	it("returns false on a desktop viewport", () => {
		setViewportWidth(1024);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it("returns true below the 768px breakpoint", () => {
		setViewportWidth(500);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(true);
	});

	it("treats 768px itself as desktop", () => {
		setViewportWidth(768);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);
	});

	it("updates when the viewport crosses the breakpoint", () => {
		setViewportWidth(1024);
		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		act(() => {
			setViewportWidth(500);
			for (const listener of changeListeners) listener();
		});
		expect(result.current).toBe(true);

		act(() => {
			setViewportWidth(1024);
			for (const listener of changeListeners) listener();
		});
		expect(result.current).toBe(false);
	});

	it("removes its media-query listener on unmount", () => {
		setViewportWidth(1024);
		const { unmount } = renderHook(() => useIsMobile());
		expect(changeListeners.length).toBe(1);
		unmount();
		expect(changeListeners.length).toBe(0);
	});
});
