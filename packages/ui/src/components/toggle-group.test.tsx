// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "#/components/toggle-group.tsx";

afterEach(cleanup);

function Fixture(props: React.ComponentProps<typeof ToggleGroup>) {
	return (
		<ToggleGroup defaultValue={["week"]} {...props}>
			<ToggleGroupItem value="day">Day</ToggleGroupItem>
			<ToggleGroupItem value="week">Week</ToggleGroupItem>
			<ToggleGroupItem value="month">Month</ToggleGroupItem>
		</ToggleGroup>
	);
}

describe("ToggleGroup", () => {
	it("renders a group with the default value pressed", () => {
		const screen = render(<Fixture />);
		const group = screen.getByRole("group");
		expect(group.getAttribute("data-slot")).toBe("toggle-group");
		const week = screen.getByRole("button", { name: "Week" });
		expect(week.getAttribute("data-slot")).toBe("toggle-group-item");
		expect(week.getAttribute("aria-pressed")).toBe("true");
		expect(
			screen.getByRole("button", { name: "Day" }).getAttribute("aria-pressed"),
		).toBe("false");
	});

	it("keeps a single pressed item in single mode", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Day" }));
		await waitFor(() => {
			expect(
				screen
					.getByRole("button", { name: "Day" })
					.getAttribute("aria-pressed"),
			).toBe("true");
			expect(
				screen
					.getByRole("button", { name: "Week" })
					.getAttribute("aria-pressed"),
			).toBe("false");
		});
	});

	it("keeps several pressed items in multiple mode", async () => {
		const screen = render(<Fixture multiple defaultValue={["day", "week"]} />);
		expect(
			screen.getByRole("button", { name: "Day" }).getAttribute("aria-pressed"),
		).toBe("true");
		fireEvent.click(screen.getByRole("button", { name: "Month" }));
		await waitFor(() => {
			for (const name of ["Day", "Week", "Month"]) {
				expect(
					screen.getByRole("button", { name }).getAttribute("aria-pressed"),
				).toBe("true");
			}
		});
	});

	it("notifies onValueChange with the new group value", () => {
		const onValueChange = vi.fn();
		const screen = render(<Fixture onValueChange={onValueChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Day" }));
		expect(onValueChange).toHaveBeenCalledWith(["day"], expect.anything());
	});

	it("forwards orientation to Base UI instead of faking the attribute", () => {
		const screen = render(<Fixture orientation="vertical" />);
		expect(screen.getByRole("group").getAttribute("data-orientation")).toBe(
			"vertical",
		);
	});

	it("emits the horizontal orientation by default", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("group").getAttribute("data-orientation")).toBe(
			"horizontal",
		);
	});

	it("stamps spacing on the group and exposes it to items", () => {
		const screen = render(<Fixture spacing={2} />);
		const group = screen.getByRole("group");
		expect(group.getAttribute("data-spacing")).toBe("2");
		expect((group as HTMLElement).style.getPropertyValue("--gap")).toBe("2");
		expect(
			screen.getByRole("button", { name: "Day" }).getAttribute("data-spacing"),
		).toBe("2");
	});

	it("defaults to spacing 0 for the segmented-control look", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("group").getAttribute("data-spacing")).toBe("0");
	});

	it("propagates the group variant and size to items through context", () => {
		const screen = render(<Fixture variant="outline" size="sm" />);
		const day = screen.getByRole("button", { name: "Day" });
		expect(day.getAttribute("data-variant")).toBe("outline");
		expect(day.getAttribute("data-size")).toBe("sm");
		expect(day.classList.contains("border-input")).toBe(true);
		expect(day.classList.contains("h-7")).toBe(true);
	});

	it("lets an item style itself when the group sets no variant", () => {
		const screen = render(
			<ToggleGroup>
				<ToggleGroupItem value="day" variant="outline" size="lg">
					Day
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		const day = screen.getByRole("button", { name: "Day" });
		expect(day.getAttribute("data-variant")).toBe("outline");
		expect(day.classList.contains("border-input")).toBe(true);
		expect(day.classList.contains("h-9")).toBe(true);
	});

	it("does not toggle a disabled item", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<ToggleGroup onValueChange={onValueChange}>
				<ToggleGroupItem value="day" disabled>
					Day
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		const day = screen.getByRole("button", { name: "Day" });
		expect(day.hasAttribute("disabled")).toBe(true);
		fireEvent.click(day);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(day.getAttribute("aria-pressed")).toBe("false");
	});

	it("merges className on the group and items", () => {
		const screen = render(
			<ToggleGroup className="custom-group">
				<ToggleGroupItem value="day" className="custom-item">
					Day
				</ToggleGroupItem>
			</ToggleGroup>,
		);
		expect(screen.getByRole("group").classList.contains("custom-group")).toBe(
			true,
		);
		expect(
			screen
				.getByRole("button", { name: "Day" })
				.classList.contains("custom-item"),
		).toBe(true);
	});
});
