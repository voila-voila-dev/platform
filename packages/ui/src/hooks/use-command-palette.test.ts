// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useCommandPalette } from "#/hooks/use-command-palette.ts";

afterEach(cleanup);

function pressKey(key: string, modifiers: Partial<KeyboardEventInit> = {}) {
	const event = new KeyboardEvent("keydown", {
		key,
		cancelable: true,
		...modifiers,
	});
	document.dispatchEvent(event);
	return event;
}

describe("useCommandPalette", () => {
	it("starts closed", () => {
		const { result } = renderHook(() => useCommandPalette());
		expect(result.current.open).toBe(false);
	});

	it("toggles on Cmd+K", () => {
		const { result } = renderHook(() => useCommandPalette());
		act(() => {
			pressKey("k", { metaKey: true });
		});
		expect(result.current.open).toBe(true);
		act(() => {
			pressKey("k", { metaKey: true });
		});
		expect(result.current.open).toBe(false);
	});

	it("toggles on Ctrl+K", () => {
		const { result } = renderHook(() => useCommandPalette());
		act(() => {
			pressKey("k", { ctrlKey: true });
		});
		expect(result.current.open).toBe(true);
	});

	it("matches the key case-insensitively", () => {
		const { result } = renderHook(() => useCommandPalette());
		act(() => {
			pressKey("K", { metaKey: true });
		});
		expect(result.current.open).toBe(true);
	});

	it("ignores the key without a modifier", () => {
		const { result } = renderHook(() => useCommandPalette());
		act(() => {
			pressKey("k");
		});
		expect(result.current.open).toBe(false);
	});

	it("ignores other keys with a modifier", () => {
		const { result } = renderHook(() => useCommandPalette());
		act(() => {
			pressKey("j", { metaKey: true });
		});
		expect(result.current.open).toBe(false);
	});

	it("binds a custom key", () => {
		const { result } = renderHook(() => useCommandPalette("p"));
		act(() => {
			pressKey("k", { metaKey: true });
		});
		expect(result.current.open).toBe(false);
		act(() => {
			pressKey("p", { metaKey: true });
		});
		expect(result.current.open).toBe(true);
	});

	it("prevents the browser default for the hotkey", () => {
		renderHook(() => useCommandPalette());
		let event: KeyboardEvent | undefined;
		act(() => {
			event = pressKey("k", { metaKey: true });
		});
		expect(event?.defaultPrevented).toBe(true);
	});

	it("exposes setOpen for programmatic control", () => {
		const { result } = renderHook(() => useCommandPalette());
		act(() => {
			result.current.setOpen(true);
		});
		expect(result.current.open).toBe(true);
	});

	it("stops listening after unmount", () => {
		const { result, unmount } = renderHook(() => useCommandPalette());
		unmount();
		act(() => {
			pressKey("k", { metaKey: true });
		});
		expect(result.current.open).toBe(false);
	});
});
