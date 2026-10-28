// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IconPicker } from "#/icon-picker/components/icon-picker.tsx";

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
		"[data-slot=icon-picker-trigger]",
	);
}

function querySwatches(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelectorAll<HTMLElement>(
		"[data-slot=icon-picker-swatch]",
	);
}

function querySearchInput(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector<HTMLInputElement>(
		"[data-slot=combobox-content] input",
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

describe("IconPicker trigger", () => {
	it("shows the placeholder when nothing is selected", () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		expect(queryTrigger(screen)?.textContent).toBe("Select an icon");
	});

	it("shows the human-formatted name of the selection", () => {
		const screen = render(
			<IconPicker value="FirstAidKitIcon" onValueChange={() => {}} />,
		);
		expect(queryTrigger(screen)?.textContent).toContain("First Aid Kit");
	});

	it("can be disabled", () => {
		const screen = render(
			<IconPicker value={null} onValueChange={() => {}} disabled />,
		);
		expect(queryTrigger(screen)?.disabled).toBe(true);
	});
});

describe("IconPicker grid", () => {
	it("opens to a grid capped at 120 swatches with a more hint", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		expect(
			screen.baseElement.querySelector("[data-slot=icon-picker-grid]"),
		).not.toBeNull();
		expect(screen.getByRole("grid")).toBeTruthy();
		expect(querySwatches(screen)).toHaveLength(120);
		expect(screen.baseElement.textContent).toContain("more — refine");
	});

	it("renders swatches as gridcells in 6-column rows", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const rows = screen.baseElement.querySelectorAll(
			"[data-slot=combobox-row]",
		);
		expect(rows).toHaveLength(20);
		expect(rows[0]?.querySelectorAll("[role=gridcell]")).toHaveLength(6);
	});

	it("labels swatches with the human-formatted name", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "FirstAidKit" } });
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector('[aria-label="First Aid Kit"]'),
			).not.toBeNull();
		});
	});

	it("marks the selected swatch with aria-selected", async () => {
		const screen = render(
			<IconPicker value="HeartbeatIcon" onValueChange={() => {}} />,
		);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "heartbeat" } });
		await waitFor(() => {
			const selected = screen.baseElement.querySelector(
				'[data-slot=icon-picker-swatch][aria-selected="true"]',
			);
			expect(selected?.getAttribute("aria-label")).toBe("Heartbeat");
		});
	});

	it("highlights swatches with arrow keys from the search input", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		input.focus();
		fireEvent.keyDown(input, { key: "ArrowDown" });
		await waitFor(() => {
			const highlighted = screen.baseElement.querySelector(
				"[data-slot=icon-picker-swatch][data-highlighted]",
			);
			expect(highlighted).not.toBeNull();
		});
		// Focus stays on the input while items are highlighted (combobox idiom).
		expect(document.activeElement).toBe(input);
	});
});

describe("IconPicker search", () => {
	it("finds icons typed with spaces, the way the trigger displays them", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "first aid" } });
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector('[aria-label="First Aid Kit"]'),
			).not.toBeNull();
		});
	});

	it("ranks prefix matches before substring matches", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "heart" } });
		await waitFor(() => {
			const first = querySwatches(screen)[0];
			expect(first?.getAttribute("aria-label")?.startsWith("Heart")).toBe(true);
		});
	});

	it("shows the empty label when nothing matches", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "zzzznotanicon" } });
		await waitFor(() => {
			expect(screen.baseElement.textContent).toContain("No icons found");
		});
	});

	it("resets the query when the popover closes", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "heart" } });
		fireEvent.keyDown(input, { key: "Escape" });
		await waitFor(() => {
			expect(querySearchInput(screen)).toBeNull();
		});
		await openPicker(screen);
		expect(querySearchInput(screen)?.value).toBe("");
	});
});

describe("IconPicker selection", () => {
	it("reports the picked name and closes the popover", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<IconPicker value={null} onValueChange={onValueChange} />,
		);
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "heartbeat" } });
		const swatch = await waitFor(() => {
			const found = screen.baseElement.querySelector<HTMLElement>(
				'[aria-label="Heartbeat"]',
			);
			expect(found).not.toBeNull();
			return found as HTMLElement;
		});
		fireEvent.click(swatch);
		expect(onValueChange).toHaveBeenCalledWith("HeartbeatIcon");
		await waitFor(() => {
			expect(querySwatches(screen)).toHaveLength(0);
		});
	});

	it("keeps the popover open when closeOnSelect is false", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<IconPicker
				value={null}
				onValueChange={onValueChange}
				closeOnSelect={false}
			/>,
		);
		await openPicker(screen);
		const swatch = querySwatches(screen)[0];
		if (swatch === undefined) throw new Error("swatch not found");
		fireEvent.click(swatch);
		expect(onValueChange).toHaveBeenCalledOnce();
		expect(querySwatches(screen).length).toBeGreaterThan(0);
	});

	it("clears the selection from the clear button", async () => {
		const onValueChange = vi.fn();
		const screen = render(
			<IconPicker value="HeartbeatIcon" onValueChange={onValueChange} />,
		);
		await openPicker(screen);
		const clear = screen.baseElement.querySelector<HTMLButtonElement>(
			"[data-slot=icon-picker-clear]",
		);
		expect(clear?.textContent).toBe("Clear selection");
		if (clear === null) throw new Error("clear button not found");
		fireEvent.click(clear);
		expect(onValueChange).toHaveBeenCalledWith(null);
	});

	it("offers no clear button while nothing is selected", async () => {
		const screen = render(<IconPicker value={null} onValueChange={() => {}} />);
		await openPicker(screen);
		expect(
			screen.baseElement.querySelector("[data-slot=icon-picker-clear]"),
		).toBeNull();
	});
});

describe("IconPicker uncontrolled and form usage", () => {
	it("manages its own selection from defaultValue", async () => {
		const screen = render(<IconPicker defaultValue="StethoscopeIcon" />);
		expect(queryTrigger(screen)?.textContent).toContain("Stethoscope");
		await openPicker(screen);
		const input = querySearchInput(screen);
		if (input === null) throw new Error("search input not found");
		fireEvent.change(input, { target: { value: "heartbeat" } });
		const swatch = await waitFor(() => {
			const found = screen.baseElement.querySelector<HTMLElement>(
				'[aria-label="Heartbeat"]',
			);
			expect(found).not.toBeNull();
			return found as HTMLElement;
		});
		fireEvent.click(swatch);
		await waitFor(() => {
			expect(queryTrigger(screen)?.textContent).toContain("Heartbeat");
		});
	});

	it("posts through a hidden input when name is provided", () => {
		// Base UI renders a visually-hidden input (not type=hidden) so browser
		// autofill and constraint validation still work; form posts see it.
		const screen = render(
			<IconPicker name="categoryIcon" defaultValue="HeartbeatIcon" />,
		);
		const hidden = screen.baseElement.querySelector<HTMLInputElement>(
			'input[name="categoryIcon"][aria-hidden="true"]',
		);
		expect(hidden?.value).toBe("HeartbeatIcon");
	});
});
