// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FilterBar } from "#/components/filter-bar.tsx";
import type { FilterDefinition, FilterValues } from "#/types.ts";

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

function setViewportWidth(width: number) {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
}

const definitions: ReadonlyArray<FilterDefinition> = [
	{ kind: "text", key: "recipient", label: "Recipient", allowExclusion: true },
	{
		kind: "select",
		key: "status",
		label: "Status",
		multiple: true,
		options: [
			{ value: "sent", label: "Sent" },
			{ value: "failed", label: "Failed" },
		],
	},
	{
		kind: "boolean",
		key: "opened",
		label: "Opened",
		trueLabel: "Opened",
		falseLabel: "Not opened",
	},
	{ kind: "dateRange", key: "sentAt", label: "Sent" },
];

function Fixture({ initial = {} }: { initial?: FilterValues }) {
	const [values, setValues] = useState<FilterValues>(initial);
	const [search, setSearch] = useState("");
	return (
		<FilterBar
			definitions={definitions}
			values={values}
			onValuesChange={setValues}
			searchValue={search}
			onSearchChange={setSearch}
			resultCount={12}
		/>
	);
}

beforeEach(() => {
	setViewportWidth(DESKTOP_WIDTH);
	// jsdom has no matchMedia; `useIsMobile` (desktop half) needs it.
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

describe("FilterBar", () => {
	it("shows the result count and no chips while nothing is filtered", () => {
		const screen = render(<Fixture />);
		expect(screen.getByText("12 results")).toBeTruthy();
		expect(
			screen.baseElement.querySelector("[data-slot=filter-chips]"),
		).toBeNull();
	});

	it("describes an applied filter on a chip", () => {
		const screen = render(
			<Fixture initial={{ status: { kind: "select", values: ["failed"] } }} />,
		);
		expect(screen.getByText("Status is Failed")).toBeTruthy();
	});

	it("removes a filter from its chip", async () => {
		const screen = render(
			<Fixture initial={{ status: { kind: "select", values: ["failed"] } }} />,
		);
		fireEvent.click(
			screen.getByRole("button", { name: "Remove: Status is Failed" }),
		);
		await waitFor(() => {
			expect(screen.queryByText("Status is Failed")).toBeNull();
		});
	});

	it("opens the editor from the trigger", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Filters" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(screen.getByLabelText("Recipient")).toBeTruthy();
	});

	it("keeps the is/is not switch inert until the field has a value", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Filters" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		// "is not <nothing>" filters nothing, so an empty field can't be inverted.
		expect(screen.getByRole("button", { name: "is not" })).toHaveProperty(
			"disabled",
			true,
		);

		fireEvent.change(screen.getByLabelText("Recipient"), {
			target: { value: "camille" },
		});
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "is not" })).toHaveProperty(
				"disabled",
				false,
			);
		});
	});

	it("does not focus the search box on open", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Filters" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		// Focusing it would throw the phone keyboard over the filters.
		expect(document.activeElement).not.toBe(
			screen.getByRole("searchbox", { name: "Search" }),
		);
	});

	it("only applies the draft once Apply is pressed", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Filters" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("option", { name: "Failed" }));
		expect(screen.queryByText("Status is Failed")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Apply" }));
		await waitFor(() => {
			expect(screen.getByText("Status is Failed")).toBeTruthy();
		});
	});

	it("discards the draft when the editor is dismissed", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Filters" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		fireEvent.click(screen.getByRole("option", { name: "Failed" }));
		fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
		expect(screen.queryByText("Status is Failed")).toBeNull();
	});

	describe("on mobile", () => {
		beforeEach(() => {
			setViewportWidth(MOBILE_WIDTH);
		});

		it("edits in a drawer, with native date inputs", async () => {
			const screen = render(<Fixture />);
			fireEvent.click(screen.getByRole("button", { name: "Filters" }));
			await waitFor(() => {
				expect(
					screen.baseElement.querySelector("[data-slot=drawer-content]"),
				).not.toBeNull();
			});
			expect(
				screen.baseElement.querySelector("[data-slot=dialog-content]"),
			).toBeNull();
			expect(
				screen.baseElement.querySelectorAll("[data-slot=native-date-picker]")
					.length,
			).toBe(2);
		});
	});

	it("keeps a false boolean as an active filter", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Filters" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		fireEvent.click(screen.getByRole("button", { name: "Not opened" }));
		fireEvent.click(screen.getByRole("button", { name: "Apply" }));

		await waitFor(() => {
			expect(screen.getByText("Opened: Not opened")).toBeTruthy();
		});
	});
});
