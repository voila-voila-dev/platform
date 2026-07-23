// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Toggle } from "#/components/ui/toggle.tsx";

afterEach(cleanup);

describe("Toggle", () => {
	it("renders an unpressed toggle button", () => {
		const screen = render(<Toggle aria-label="Favorite" />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.getAttribute("data-slot")).toBe("toggle");
		expect(toggle.getAttribute("aria-pressed")).toBe("false");
		expect(toggle.hasAttribute("data-pressed")).toBe(false);
	});

	it("toggles pressed state on click", () => {
		const screen = render(<Toggle aria-label="Favorite" />);
		const toggle = screen.getByRole("button", { name: "Favorite" });

		fireEvent.click(toggle);
		expect(toggle.getAttribute("aria-pressed")).toBe("true");
		expect(toggle.hasAttribute("data-pressed")).toBe(true);

		fireEvent.click(toggle);
		expect(toggle.getAttribute("aria-pressed")).toBe("false");
		expect(toggle.hasAttribute("data-pressed")).toBe(false);
	});

	it("starts pressed with defaultPressed", () => {
		const screen = render(<Toggle aria-label="Favorite" defaultPressed />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.getAttribute("aria-pressed")).toBe("true");
		expect(toggle.hasAttribute("data-pressed")).toBe(true);
	});

	it("notifies onPressedChange", () => {
		const onPressedChange = vi.fn();
		const screen = render(
			<Toggle aria-label="Favorite" onPressedChange={onPressedChange} />,
		);
		fireEvent.click(screen.getByRole("button", { name: "Favorite" }));
		expect(onPressedChange).toHaveBeenCalledWith(true, expect.anything());
	});

	it("stays controlled when pressed is fixed", () => {
		const screen = render(<Toggle aria-label="Favorite" pressed={false} />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		fireEvent.click(toggle);
		expect(toggle.getAttribute("aria-pressed")).toBe("false");
	});

	it("does not toggle when disabled", () => {
		const onPressedChange = vi.fn();
		const screen = render(
			<Toggle
				aria-label="Favorite"
				disabled
				onPressedChange={onPressedChange}
			/>,
		);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.hasAttribute("disabled")).toBe(true);
		fireEvent.click(toggle);
		expect(onPressedChange).not.toHaveBeenCalled();
		expect(toggle.getAttribute("aria-pressed")).toBe("false");
	});

	it("keeps the cursor affordance when disabled", () => {
		const screen = render(<Toggle aria-label="Favorite" disabled />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.classList.contains("disabled:cursor-not-allowed")).toBe(true);
		expect(toggle.classList.contains("disabled:pointer-events-none")).toBe(
			false,
		);
	});

	it("applies the outline variant border color", () => {
		const screen = render(<Toggle aria-label="Favorite" variant="outline" />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.classList.contains("border-input")).toBe(true);
		expect(toggle.classList.contains("border")).toBe(true);
	});

	it("keeps a transparent border on the default variant for focus and invalid states", () => {
		const screen = render(<Toggle aria-label="Favorite" />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.classList.contains("border")).toBe(true);
		expect(toggle.classList.contains("border-transparent")).toBe(true);
	});

	it.each([
		"sm",
		"default",
		"lg",
	] as const)("applies the %s size classes", (size) => {
		const heights = { sm: "h-7", default: "h-8", lg: "h-9" };
		const screen = render(<Toggle aria-label="Favorite" size={size} />);
		const toggle = screen.getByRole("button", { name: "Favorite" });
		expect(toggle.classList.contains(heights[size])).toBe(true);
	});

	it("merges className over the variant classes", () => {
		const screen = render(
			<Toggle aria-label="Favorite" className="custom-toggle-class" />,
		);
		expect(
			screen
				.getByRole("button", { name: "Favorite" })
				.classList.contains("custom-toggle-class"),
		).toBe(true);
	});
});
