// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "#/segmented-control/components/segmented-control.tsx";

afterEach(cleanup);

function Fixture(props: React.ComponentProps<typeof SegmentedControl.Root>) {
	return (
		<SegmentedControl.Root defaultValue="week" {...props}>
			<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
			<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
			<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
		</SegmentedControl.Root>
	);
}

describe("SegmentedControl", () => {
	it("renders a radiogroup with the default value checked", () => {
		const screen = render(<Fixture />);
		const group = screen.getByRole("radiogroup");
		expect(group.getAttribute("data-slot")).toBe("segmented-control");
		const week = screen.getByRole("radio", { name: "Week" });
		expect(week.getAttribute("data-slot")).toBe("segmented-control-item");
		expect(week.getAttribute("aria-checked")).toBe("true");
		expect(
			screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked"),
		).toBe("false");
	});

	it("moves the selection to the clicked segment", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("radio", { name: "Day" }));
		await waitFor(() => {
			expect(
				screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked"),
			).toBe("true");
			expect(
				screen
					.getByRole("radio", { name: "Week" })
					.getAttribute("aria-checked"),
			).toBe("false");
		});
	});

	it("keeps the selection when the checked segment is clicked again", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("radio", { name: "Week" }));
		await waitFor(() => {
			expect(
				screen
					.getByRole("radio", { name: "Week" })
					.getAttribute("aria-checked"),
			).toBe("true");
		});
	});

	it("notifies onValueChange with the new value", () => {
		const onValueChange = vi.fn();
		const screen = render(<Fixture onValueChange={onValueChange} />);
		fireEvent.click(screen.getByRole("radio", { name: "Day" }));
		expect(onValueChange).toHaveBeenCalledWith("day", expect.anything());
	});

	it("renders an aria-hidden thumb inside the group", () => {
		const screen = render(<Fixture />);
		const thumb = screen
			.getByRole("radiogroup")
			.querySelector("[data-slot='segmented-control-thumb']");
		expect(thumb).not.toBeNull();
		expect((thumb as HTMLElement).getAttribute("aria-hidden")).toBe("true");
	});

	it("stamps the size on the group and exposes it to items", () => {
		const screen = render(<Fixture size="sm" />);
		expect(screen.getByRole("radiogroup").getAttribute("data-size")).toBe("sm");
		expect(
			screen.getByRole("radio", { name: "Day" }).getAttribute("data-size"),
		).toBe("sm");
		expect(screen.getByRole("radiogroup").classList.contains("h-7")).toBe(true);
	});

	it("defaults to the default size", () => {
		const screen = render(<Fixture />);
		const group = screen.getByRole("radiogroup");
		expect(group.getAttribute("data-size")).toBe("default");
		expect(group.classList.contains("h-8")).toBe(true);
	});

	it("stretches the group and splits it evenly between the segments", () => {
		const screen = render(<Fixture stretch />);
		expect(screen.getByRole("radiogroup").classList.contains("w-full")).toBe(
			true,
		);
		for (const label of ["Day", "Week", "Month"]) {
			expect(
				screen.getByRole("radio", { name: label }).classList.contains("flex-1"),
			).toBe(true);
		}
	});

	it("sizes itself to its labels unless asked to stretch", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("radiogroup").classList.contains("w-fit")).toBe(
			true,
		);
		expect(
			screen.getByRole("radio", { name: "Day" }).classList.contains("flex-1"),
		).toBe(false);
	});

	it("does not select a disabled segment", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<SegmentedControl.Root defaultValue="week" onValueChange={onValueChange}>
				<SegmentedControl.Item value="day" disabled>
					Day
				</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
			</SegmentedControl.Root>,
		);
		const day = screen.getByRole("radio", { name: "Day" });
		expect(day.getAttribute("data-disabled")).not.toBeNull();
		fireEvent.click(day);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(day.getAttribute("aria-checked")).toBe("false");
	});

	it("supports controlled value updates", async () => {
		const screen = render(<Fixture value="day" />);
		expect(
			screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked"),
		).toBe("true");
		screen.rerender(<Fixture value="month" />);
		await waitFor(() => {
			expect(
				screen
					.getByRole("radio", { name: "Month" })
					.getAttribute("aria-checked"),
			).toBe("true");
			expect(
				screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked"),
			).toBe("false");
		});
	});

	it("merges className on the group and items", () => {
		const screen = render(
			<SegmentedControl.Root defaultValue="day" className="custom-group">
				<SegmentedControl.Item value="day" className="custom-item">
					Day
				</SegmentedControl.Item>
			</SegmentedControl.Root>,
		);
		expect(
			screen.getByRole("radiogroup").classList.contains("custom-group"),
		).toBe(true);
		expect(
			screen
				.getByRole("radio", { name: "Day" })
				.classList.contains("custom-item"),
		).toBe(true);
	});
});
