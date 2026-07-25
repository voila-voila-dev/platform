// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ScrollArea, ScrollBar } from "#/components/scroll-area.tsx";

beforeEach(() => {
	// Base UI ScrollArea measures overflow with ResizeObserver, absent in jsdom.
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

describe("ScrollArea", () => {
	it("renders children inside the viewport", () => {
		const screen = render(
			<ScrollArea>
				<p>Project #1 — Brand refresh sprint</p>
			</ScrollArea>,
		);
		const root = screen.baseElement.querySelector("[data-slot=scroll-area]");
		const viewport = screen.baseElement.querySelector(
			"[data-slot=scroll-area-viewport]",
		);
		expect(root).toBeTruthy();
		expect(viewport?.contains(screen.getByText(/Project #1/))).toBe(true);
	});

	it("only mounts scrollbars when the content overflows", () => {
		// Base UI unmounts scrollbars without overflow (jsdom never overflows),
		// so the visible-scrollbar assertions below opt into keepMounted.
		const screen = render(
			<ScrollArea>
				<p>Content</p>
			</ScrollArea>,
		);
		expect(
			screen.baseElement.querySelector("[data-slot=scroll-area-scrollbar]"),
		).toBeNull();
	});

	it("renders a vertical scrollbar with a thumb by default", () => {
		const screen = render(
			<ScrollArea>
				<p>Content</p>
				<ScrollBar keepMounted />
			</ScrollArea>,
		);
		const scrollbar = screen.baseElement.querySelector(
			"[data-slot=scroll-area-scrollbar]",
		);
		expect(scrollbar?.getAttribute("data-orientation")).toBe("vertical");
		expect(
			scrollbar?.querySelector("[data-slot=scroll-area-thumb]"),
		).toBeTruthy();
	});

	it("targets the orientation attribute Base UI actually emits", () => {
		// Regression guard: the original classes used bare data-vertical:/data-horizontal:
		// variants that never match, leaving the scrollbar 0px wide.
		const screen = render(
			<ScrollArea>
				<p>Content</p>
				<ScrollBar keepMounted />
			</ScrollArea>,
		);
		const scrollbar = screen.baseElement.querySelector(
			"[data-slot=scroll-area-scrollbar]",
		);
		expect(
			scrollbar?.classList.contains("data-[orientation=vertical]:w-2.5"),
		).toBe(true);
		expect(scrollbar?.classList.contains("data-vertical:w-2.5")).toBe(false);
	});

	it("forwards a horizontal orientation to a composed ScrollBar", () => {
		const screen = render(
			<ScrollArea>
				<p>Content</p>
				<ScrollBar orientation="horizontal" keepMounted />
			</ScrollArea>,
		);
		const scrollbars = screen.baseElement.querySelectorAll(
			"[data-slot=scroll-area-scrollbar]",
		);
		const orientations = [...scrollbars].map((bar) =>
			bar.getAttribute("data-orientation"),
		);
		expect(orientations).toContain("horizontal");
	});

	it("merges className on the root", () => {
		const screen = render(
			<ScrollArea className="h-56 w-72 custom-scroll-area">
				<p>Content</p>
			</ScrollArea>,
		);
		const root = screen.baseElement.querySelector("[data-slot=scroll-area]");
		expect(root?.classList.contains("custom-scroll-area")).toBe(true);
		expect(root?.classList.contains("relative")).toBe(true);
	});

	it("merges className on the scrollbar", () => {
		const screen = render(
			<ScrollArea>
				<p>Content</p>
				<ScrollBar className="custom-scrollbar" keepMounted />
			</ScrollArea>,
		);
		const custom = screen.baseElement.querySelector(".custom-scrollbar");
		expect(custom?.getAttribute("data-slot")).toBe("scroll-area-scrollbar");
	});

	it("keeps the viewport focusable with the focus ring classes", () => {
		const screen = render(
			<ScrollArea>
				<p>Content</p>
			</ScrollArea>,
		);
		const viewport = screen.baseElement.querySelector(
			"[data-slot=scroll-area-viewport]",
		);
		expect(viewport?.classList.contains("focus-visible:ring-[3px]")).toBe(true);
		expect(viewport?.classList.contains("outline-none")).toBe(true);
	});
});
