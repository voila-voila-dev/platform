// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { badgeColors } from "#/badge/components/badge-variants.ts";
import { ColorPicker } from "#/color-picker/components/color-picker.tsx";

beforeEach(() => {
	// Base UI's Positioner measures the anchor with ResizeObserver, absent in jsdom.
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

function queryTrigger(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLButtonElement>(
		"[data-slot=color-picker-trigger]",
	);
}

function querySwatches(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelectorAll<HTMLButtonElement>(
		"[data-slot=color-picker-swatch]",
	);
}

async function openPicker(screen: ReturnType<typeof render>) {
	const trigger = queryTrigger(screen);
	if (trigger === null) throw new Error("trigger not found");
	fireEvent.click(trigger);
	await waitFor(() => {
		expect(querySwatches(screen).length).toBeGreaterThan(0);
	});
}

describe("ColorPicker trigger", () => {
	it("shows the placeholder when nothing is selected", () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} />,
		);
		expect(queryTrigger(screen)?.textContent).toBe("Select a color");
	});

	it("shows the formatted name and a swatch dot for the selection", () => {
		const screen = render(
			<ColorPicker value="emerald" onValueChange={() => {}} />,
		);
		const trigger = queryTrigger(screen);
		expect(trigger?.textContent).toContain("Emerald");
		expect(trigger?.querySelector(".bg-badge-emerald")).not.toBeNull();
	});

	it("can be disabled", () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} disabled />,
		);
		expect(queryTrigger(screen)?.disabled).toBe(true);
	});
});

describe("ColorPicker grid", () => {
	it("opens to a radiogroup with one radio per palette color", async () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} />,
		);
		await openPicker(screen);
		expect(
			screen.baseElement.querySelector(
				"[data-slot=color-picker-grid][role=radiogroup]",
			),
		).not.toBeNull();
		const swatches = querySwatches(screen);
		expect(swatches).toHaveLength(badgeColors.length);
		for (const swatch of swatches) {
			expect(swatch.getAttribute("role")).toBe("radio");
		}
	});

	it("labels swatches with the human-formatted name", async () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} />,
		);
		await openPicker(screen);
		expect(
			screen.baseElement.querySelector('[aria-label="Fuchsia"]'),
		).not.toBeNull();
	});

	it("paints swatches from the static badge class map", async () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} />,
		);
		await openPicker(screen);
		const swatch = screen.baseElement.querySelector('[aria-label="Emerald"]');
		expect(swatch?.classList.contains("bg-badge-emerald")).toBe(true);
	});

	it("marks the selected swatch with aria-checked and a check icon", async () => {
		const screen = render(
			<ColorPicker value="teal" onValueChange={() => {}} />,
		);
		await openPicker(screen);
		const selected = screen.baseElement.querySelector(
			'[data-slot=color-picker-swatch][aria-checked="true"]',
		);
		expect(selected?.getAttribute("aria-label")).toBe("Teal");
		expect(selected?.querySelector("svg")).not.toBeNull();
	});

	it("exposes a single tab stop on the selected swatch", async () => {
		const screen = render(
			<ColorPicker value="teal" onValueChange={() => {}} />,
		);
		await openPicker(screen);
		const tabbable = Array.from(querySwatches(screen)).filter(
			(swatch) => swatch.tabIndex === 0,
		);
		expect(tabbable).toHaveLength(1);
		expect(tabbable[0]?.getAttribute("aria-label")).toBe("Teal");
	});

	it("falls back to the first swatch as the tab stop when unselected", async () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} />,
		);
		await openPicker(screen);
		const swatches = querySwatches(screen);
		expect(swatches[0]?.tabIndex).toBe(0);
		expect(swatches[1]?.tabIndex).toBe(-1);
	});

	it("moves focus with arrow keys across the 5-column grid", async () => {
		const screen = render(
			<ColorPicker value={null} onValueChange={() => {}} />,
		);
		await openPicker(screen);
		const swatches = querySwatches(screen);
		swatches[0]?.focus();
		const grid = screen.baseElement.querySelector(
			"[data-slot=color-picker-grid]",
		);
		if (grid === null) throw new Error("grid not found");
		fireEvent.keyDown(grid, { key: "ArrowRight" });
		expect(document.activeElement).toBe(swatches[1]);
		fireEvent.keyDown(grid, { key: "ArrowDown" });
		expect(document.activeElement).toBe(swatches[6]);
		fireEvent.keyDown(grid, { key: "ArrowUp" });
		expect(document.activeElement).toBe(swatches[1]);
		fireEvent.keyDown(grid, { key: "ArrowLeft" });
		expect(document.activeElement).toBe(swatches[0]);
	});
});

describe("ColorPicker selection", () => {
	it("reports the picked color and closes the popover", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<ColorPicker value={null} onValueChange={onValueChange} />,
		);
		await openPicker(screen);
		const swatch = screen.baseElement.querySelector<HTMLButtonElement>(
			'[aria-label="Indigo"]',
		);
		if (swatch === null) throw new Error("swatch not found");
		fireEvent.click(swatch);
		expect(onValueChange).toHaveBeenCalledWith("indigo");
		await waitFor(() => {
			expect(querySwatches(screen)).toHaveLength(0);
		});
	});

	it("clears the selection from the clear button when clearable", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<ColorPicker value="rose" onValueChange={onValueChange} clearable />,
		);
		await openPicker(screen);
		const clear = screen.baseElement.querySelector<HTMLButtonElement>(
			"[data-slot=color-picker-clear]",
		);
		expect(clear?.textContent).toBe("Clear selection");
		if (clear === null) throw new Error("clear button not found");
		fireEvent.click(clear);
		expect(onValueChange).toHaveBeenCalledWith(null);
	});

	it("offers no clear button unless clearable", async () => {
		const screen = render(
			<ColorPicker value="rose" onValueChange={() => {}} />,
		);
		await openPicker(screen);
		expect(
			screen.baseElement.querySelector("[data-slot=color-picker-clear]"),
		).toBeNull();
	});
});

describe("ColorPicker uncontrolled and form usage", () => {
	it("manages its own selection from defaultValue", async () => {
		const screen = render(<ColorPicker defaultValue="teal" />);
		expect(queryTrigger(screen)?.textContent).toContain("Teal");
		await openPicker(screen);
		const swatch = screen.baseElement.querySelector<HTMLButtonElement>(
			'[aria-label="Amber"]',
		);
		if (swatch === null) throw new Error("swatch not found");
		fireEvent.click(swatch);
		await waitFor(() => {
			expect(queryTrigger(screen)?.textContent).toContain("Amber");
		});
	});

	it("posts through a hidden input when name is provided", () => {
		const screen = render(
			<ColorPicker name="badgeColor" defaultValue="teal" />,
		);
		const hidden = screen.baseElement.querySelector<HTMLInputElement>(
			'input[type=hidden][name="badgeColor"]',
		);
		expect(hidden?.value).toBe("teal");
	});
});
