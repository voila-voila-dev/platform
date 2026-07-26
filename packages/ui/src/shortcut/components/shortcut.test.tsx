// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Shortcut } from "#/shortcut/components/shortcut.tsx";

afterEach(cleanup);

describe("Shortcut", () => {
	it("renders a right-aligned span carrying the shared menu shortcut recipe", () => {
		const screen = render(<Shortcut>⌘K</Shortcut>);
		const shortcut = screen.getByText("⌘K");
		expect(shortcut.tagName).toBe("SPAN");
		expect(shortcut.getAttribute("data-slot")).toBe("shortcut");
		expect(shortcut.classList.contains("ml-auto")).toBe(true);
		expect(shortcut.classList.contains("text-muted-foreground")).toBe(true);
	});

	it("renders the keys prop as a group of small Kbd chips", () => {
		const screen = render(
			<Shortcut keys={["⌘", "K"]} data-testid="shortcut" />,
		);
		const shortcut = screen.getByTestId("shortcut");
		expect(shortcut.querySelector("[data-slot=kbd-group]")).not.toBeNull();
		const keys = shortcut.querySelectorAll("[data-slot=kbd]");
		expect(keys).toHaveLength(2);
		for (const key of keys) {
			expect(key.getAttribute("data-size")).toBe("sm");
		}
		expect(shortcut.textContent).toBe("⌘K");
	});

	it("lets a consumer data-slot override win, for the per-menu wrappers", () => {
		const screen = render(
			<Shortcut data-slot="dropdown-menu-shortcut">⌘E</Shortcut>,
		);
		expect(screen.getByText("⌘E").getAttribute("data-slot")).toBe(
			"dropdown-menu-shortcut",
		);
	});

	it("merges className so consumers can override styles", () => {
		const screen = render(<Shortcut className="text-primary">⌘S</Shortcut>);
		const shortcut = screen.getByText("⌘S");
		expect(shortcut.classList.contains("text-primary")).toBe(true);
		expect(shortcut.classList.contains("text-muted-foreground")).toBe(false);
	});
});
