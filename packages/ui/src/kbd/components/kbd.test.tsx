// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Kbd } from "#/kbd/components/kbd.tsx";

afterEach(cleanup);

describe("Kbd", () => {
	it("renders a <kbd> element with the default size", () => {
		const screen = render(<Kbd.Root>⌘K</Kbd.Root>);
		const kbd = screen.getByText("⌘K");
		expect(kbd.tagName.toLowerCase()).toBe("kbd");
		expect(kbd.getAttribute("data-slot")).toBe("kbd");
		expect(kbd.getAttribute("data-size")).toBe("default");
		expect(kbd.classList.contains("h-5")).toBe(true);
		expect(kbd.classList.contains("text-xs")).toBe(true);
	});

	it("renders the sm size for dense surfaces like menus and tooltips", () => {
		const screen = render(<Kbd.Root size="sm">⌘K</Kbd.Root>);
		const kbd = screen.getByText("⌘K");
		expect(kbd.getAttribute("data-size")).toBe("sm");
		expect(kbd.classList.contains("h-4")).toBe(true);
		expect(kbd.classList.contains("h-5")).toBe(false);
	});

	it("merges className so consumers can override styles", () => {
		const screen = render(<Kbd.Root className="bg-primary">K</Kbd.Root>);
		const kbd = screen.getByText("K");
		expect(kbd.classList.contains("bg-primary")).toBe(true);
		expect(kbd.classList.contains("bg-muted")).toBe(false);
	});

	it("stays decorative: no pointer events and no text selection", () => {
		const screen = render(<Kbd.Root>K</Kbd.Root>);
		const kbd = screen.getByText("K");
		expect(kbd.classList.contains("pointer-events-none")).toBe(true);
		expect(kbd.classList.contains("select-none")).toBe(true);
	});
});

describe("Kbd.Group", () => {
	it("renders a <kbd> element so nested keys form a valid combo", () => {
		const screen = render(
			<Kbd.Group data-testid="group">
				<Kbd.Root>⌘</Kbd.Root>
				<Kbd.Root>K</Kbd.Root>
			</Kbd.Group>,
		);
		const group = screen.getByTestId("group");
		expect(group.tagName.toLowerCase()).toBe("kbd");
		expect(group.getAttribute("data-slot")).toBe("kbd-group");
		expect(group.querySelectorAll("[data-slot=kbd]").length).toBe(2);
	});

	it("renders children as-is when no separator is given", () => {
		const screen = render(
			<Kbd.Group data-testid="group">
				<Kbd.Root>⌘</Kbd.Root>
				<Kbd.Root>K</Kbd.Root>
			</Kbd.Group>,
		);
		const group = screen.getByTestId("group");
		expect(group.querySelectorAll("[data-slot=kbd-separator]").length).toBe(0);
	});

	it("interleaves the separator glyph between keys, hidden from screen readers", () => {
		const screen = render(
			<Kbd.Group data-testid="group" separator="+">
				<Kbd.Root>⌘</Kbd.Root>
				<Kbd.Root>⇧</Kbd.Root>
				<Kbd.Root>P</Kbd.Root>
			</Kbd.Group>,
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
			<Kbd.Group data-testid="group" separator="+">
				<Kbd.Root>K</Kbd.Root>
			</Kbd.Group>,
		);
		const group = screen.getByTestId("group");
		expect(group.querySelectorAll("[data-slot=kbd-separator]").length).toBe(0);
	});
});
