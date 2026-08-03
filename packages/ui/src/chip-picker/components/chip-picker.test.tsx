// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChipPicker } from "#/chip-picker/components/chip-picker.tsx";

beforeEach(() => {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: 1280,
	});
	// jsdom has no matchMedia; the responsive sheet's useIsMobile needs it.
	vi.stubGlobal(
		"matchMedia",
		vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {},
		})),
	);
});

afterEach(() => {
	cleanup();
	vi.unstubAllGlobals();
});

const labels = {
	select: "Select",
	done: "Done",
	noResult: "No result.",
	selectionCount: (count: number) => `${count} selected`,
};

const options = [
	{ id: "cooking", label: "Cooking" },
	{ id: "boxing", label: "Boxing" },
	{ id: "singing", label: "Singing" },
];

function renderPicker(overrides?: {
	selected?: ReadonlySet<string>;
	onToggle?: (id: string) => void;
	maxSelected?: number;
}) {
	return render(
		<ChipPicker
			title="Your interests"
			searchPlaceholder="Search…"
			labels={labels}
			options={options}
			selected={overrides?.selected ?? new Set()}
			onToggle={overrides?.onToggle ?? (() => {})}
			maxSelected={overrides?.maxSelected}
		/>,
	);
}

describe("ChipPicker", () => {
	it("collapses to read-only chips plus the select trigger", () => {
		renderPicker({ selected: new Set(["cooking"]) });
		expect(screen.getByText("Cooking")).toBeDefined();
		expect(screen.queryByText("Boxing")).toBeNull();
		// The chip is not a button: deselection happens inside the sheet.
		expect(screen.queryByRole("button", { name: "Cooking" })).toBeNull();
		expect(screen.getByRole("button", { name: "Select" })).toBeDefined();
	});

	it("opens the sheet with every option sorted alphabetically", () => {
		renderPicker();
		fireEvent.click(screen.getByRole("button", { name: "Select" }));
		const rows = screen
			.getAllByRole("button", { pressed: false })
			.map((row) => row.textContent);
		expect(rows).toEqual(["Boxing", "Cooking", "Singing"]);
	});

	it("filters the list from the search field", () => {
		renderPicker();
		fireEvent.click(screen.getByRole("button", { name: "Select" }));
		fireEvent.change(screen.getByPlaceholderText("Search…"), {
			target: { value: "sing" },
		});
		expect(screen.queryByText("Cooking")).toBeNull();
		expect(screen.getByText("Singing")).toBeDefined();
	});

	it("shows the capped counter and reports row toggles", () => {
		const toggledIds: string[] = [];
		renderPicker({
			selected: new Set(["cooking"]),
			onToggle: (id) => toggledIds.push(id),
			maxSelected: 2,
		});
		fireEvent.click(screen.getByRole("button", { name: "Select" }));
		expect(screen.getByText("1 / 2")).toBeDefined();
		fireEvent.click(screen.getByRole("button", { name: "Boxing" }));
		expect(toggledIds).toEqual(["boxing"]);
	});

	it("keeps the select trigger enabled at the cap so items can be removed", () => {
		renderPicker({ selected: new Set(["cooking"]), maxSelected: 1 });
		const trigger = screen.getByRole("button", { name: "Select" });
		expect(trigger).toHaveProperty("disabled", false);
		fireEvent.click(trigger);
		expect(screen.getByText("1 / 1")).toBeDefined();
	});
});

describe("chip picker sheet close", () => {
	it("fires onSheetClosed when the sheet closes via Done", () => {
		let closedCount = 0;
		render(
			<ChipPicker
				title="Your interests"
				searchPlaceholder="Search…"
				labels={labels}
				options={options}
				selected={new Set()}
				onToggle={() => {}}
				onSheetClosed={() => {
					closedCount += 1;
				}}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Select" }));
		expect(closedCount).toBe(0);
		fireEvent.click(screen.getByRole("button", { name: "Done" }));
		expect(closedCount).toBe(1);
	});
});
