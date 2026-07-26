// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Chip } from "#/chip/components/chip.tsx";

afterEach(cleanup);

function queryChip(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=chip]");
}

describe("Chip", () => {
	it("renders its children in a span with the badge recipe", () => {
		const screen = render(<Chip.Root>Product designer</Chip.Root>);
		const chip = queryChip(screen);
		expect(chip?.tagName).toBe("SPAN");
		expect(chip?.textContent).toBe("Product designer");
		expect(chip?.classList.contains("rounded-4xl")).toBe(true);
	});

	it("defaults to the secondary variant", () => {
		const screen = render(<Chip.Root>Branding</Chip.Root>);
		const chip = queryChip(screen);
		expect(chip?.getAttribute("data-variant")).toBe("secondary");
		expect(chip?.classList.contains("bg-secondary")).toBe(true);
	});

	it("forwards the variant, color and size axes", () => {
		const screen = render(
			<Chip.Root variant="outline" color="blue" size="sm">
				Branding
			</Chip.Root>,
		);
		const chip = queryChip(screen);
		expect(chip?.getAttribute("data-variant")).toBe("outline");
		expect(chip?.getAttribute("data-color")).toBe("blue");
		expect(chip?.getAttribute("data-size")).toBe("sm");
		expect(chip?.classList.contains("bg-badge-blue")).toBe(true);
		expect(chip?.classList.contains("h-4")).toBe(true);
	});

	it("merges className over the recipe classes", () => {
		const screen = render(
			<Chip.Root className="custom-chip">Branding</Chip.Root>,
		);
		expect(queryChip(screen)?.classList.contains("custom-chip")).toBe(true);
	});

	it("renders a remove button and forwards clicks", () => {
		const onClick = vi.fn();
		const screen = render(
			<Chip.Root>
				Branding
				<Chip.Remove onClick={onClick} />
			</Chip.Root>,
		);
		const remove = screen.getByRole("button", { name: "Remove" });
		expect(remove.getAttribute("data-slot")).toBe("chip-remove");
		expect(remove.getAttribute("type")).toBe("button");
		fireEvent.click(remove);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("allows overriding the remove button label", () => {
		const screen = render(
			<Chip.Root>
				Branding
				<Chip.Remove aria-label="Remove Branding" />
			</Chip.Root>,
		);
		expect(
			screen.getByRole("button", { name: "Remove Branding" }),
		).toBeTruthy();
	});

	it("tightens the trailing padding when a remove button is present", () => {
		const screen = render(
			<Chip.Root>
				Branding
				<Chip.Remove />
			</Chip.Root>,
		);
		expect(
			queryChip(screen)?.classList.contains("has-data-[slot=chip-remove]:pr-1"),
		).toBe(true);
	});
});
