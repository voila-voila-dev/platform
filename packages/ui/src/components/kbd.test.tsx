// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Kbd, KbdGroup } from "#/components/kbd.tsx";

afterEach(cleanup);

describe("Kbd", () => {
	it("renders a <kbd> element with the default size", () => {
		const screen = render(<Kbd>⌘K</Kbd>);
		const kbd = screen.getByText("⌘K");
		expect(kbd.tagName.toLowerCase()).toBe("kbd");
		expect(kbd.getAttribute("data-slot")).toBe("kbd");
		expect(kbd.getAttribute("data-size")).toBe("default");
		expect(kbd.classList.contains("h-5")).toBe(true);
		expect(kbd.classList.contains("text-xs")).toBe(true);
	});

	it("renders the sm size for dense surfaces like menus and tooltips", () => {
		const screen = render(<Kbd size="sm">⌘K</Kbd>);
		const kbd = screen.getByText("⌘K");
		expect(kbd.getAttribute("data-size")).toBe("sm");
		expect(kbd.classList.contains("h-4")).toBe(true);
		expect(kbd.classList.contains("h-5")).toBe(false);
	});

	it("merges className so consumers can override styles", () => {
		const screen = render(<Kbd className="bg-primary">K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.classList.contains("bg-primary")).toBe(true);
		expect(kbd.classList.contains("bg-muted")).toBe(false);
	});

	it("stays decorative: no pointer events and no text selection", () => {
		const screen = render(<Kbd>K</Kbd>);
		const kbd = screen.getByText("K");
		expect(kbd.classList.contains("pointer-events-none")).toBe(true);
		expect(kbd.classList.contains("select-none")).toBe(true);
	});
});

describe("KbdGroup", () => {
	it("renders a <kbd> element so nested keys form a valid combo", () => {
		const screen = render(
			<KbdGroup data-testid="group">
				<Kbd>⌘</Kbd>
				<Kbd>K</Kbd>
			</KbdGroup>,
		);
		const group = screen.getByTestId("group");
		expect(group.tagName.toLowerCase()).toBe("kbd");
		expect(group.getAttribute("data-slot")).toBe("kbd-group");
		expect(group.querySelectorAll("[data-slot=kbd]").length).toBe(2);
	});

	it("renders children as-is when no separator is given", () => {
		const screen = render(
			<KbdGroup data-testid="group">
				<Kbd>⌘</Kbd>
				<Kbd>K</Kbd>
			</KbdGroup>,
		);
		const group = screen.getByTestId("group");
		expect(group.querySelectorAll("[data-slot=kbd-separator]").length).toBe(0);
	});

	it("interleaves the separator glyph between keys, hidden from screen readers", () => {
		const screen = render(
			<KbdGroup data-testid="group" separator="+">
				<Kbd>⌘</Kbd>
				<Kbd>⇧</Kbd>
				<Kbd>P</Kbd>
			</KbdGroup>,
		);
		const group = screen.getByTestId("group");
		const separators = group.querySelectorAll("[data-slot=kbd-separator]");
		expect(separators.length).toBe(2);
		for (const separator of separators) {
			expect(separator.textContent).toBe("+");
			expect(separator.getAttribute("aria-hidden")).toBe("true");
		}
		expect(group.textContent).toBe("⌘+⇧+P");
	});

	it("does not prepend a separator before a single key", () => {
		const screen = render(
			<KbdGroup data-testid="group" separator="+">
				<Kbd>K</Kbd>
			</KbdGroup>,
		);
		const group = screen.getByTestId("group");
		expect(group.querySelectorAll("[data-slot=kbd-separator]").length).toBe(0);
	});
});
