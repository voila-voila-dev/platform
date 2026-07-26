// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "#/button/components/button.tsx";
import { Sheet } from "#/sheet/components/sheet.tsx";

function Fixture(props: React.ComponentProps<typeof Sheet.Content>) {
	return (
		<Sheet.Root>
			<Sheet.Trigger render={<Button variant="outline" />}>
				Open project details
			</Sheet.Trigger>
			<Sheet.Content {...props}>
				<Sheet.Header>
					<Sheet.Title>Project details</Sheet.Title>
					<Sheet.Description>
						Design support for the Q3 brand refresh launch.
					</Sheet.Description>
				</Sheet.Header>
				<Sheet.Footer>
					<Button>Confirm booking</Button>
					<Sheet.Close render={<Button variant="outline" />}>
						Cancel
					</Sheet.Close>
				</Sheet.Footer>
			</Sheet.Content>
		</Sheet.Root>
	);
}

afterEach(cleanup);

describe("Sheet", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(
			screen.getByRole("button", { name: "Open project details" }),
		).toBeTruthy();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("opens on trigger click with title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
			expect(screen.getByText("Project details")).toBeTruthy();
			expect(
				screen.getByText("Design support for the Q3 brand refresh launch."),
			).toBeTruthy();
		});
	});

	it("defaults to the right side", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=sheet-content]",
			);
			expect(content?.getAttribute("data-side")).toBe("right");
		});
	});

	it.each([
		"top",
		"right",
		"bottom",
		"left",
	] as const)("applies the %s side as a data attribute", async (side) => {
		const screen = render(<Fixture side={side} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=sheet-content]",
			);
			expect(content?.getAttribute("data-side")).toBe(side);
		});
	});

	it("applies the size to the popup as a data attribute", async () => {
		const screen = render(<Fixture size="lg" />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=sheet-content]",
			);
			expect(content?.getAttribute("data-size")).toBe("lg");
		});
	});

	it("defaults the size to default", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=sheet-content]",
			);
			expect(content?.getAttribute("data-size")).toBe("default");
		});
	});

	it("renders the built-in close button under its own slot, separate from Sheet.Close", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		// The auto X button and the public Sheet.Close must not share a slot, so
		// styling `[data-slot=sheet-close]` never hits the X button.
		expect(
			screen.baseElement.querySelector("[data-slot=sheet-close-button]"),
		).not.toBeNull();
		const cancel = screen.baseElement.querySelector("[data-slot=sheet-close]");
		expect(cancel?.textContent).toBe("Cancel");
	});

	it("closes when the built-in close button is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Close" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("closes when a Sheet.Close action is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("overrides the built-in close button label for localization", async () => {
		const screen = render(<Fixture closeButtonLabel="Close panel" />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Close panel" })).toBeTruthy();
		});
	});

	it("hides the built-in close button when showCloseButton is false", async () => {
		const screen = render(<Fixture showCloseButton={false} />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=sheet-close-button]"),
		).toBeNull();
	});

	it("merges className onto the content popup", async () => {
		const screen = render(<Fixture className="custom-sheet" />);
		fireEvent.click(
			screen.getByRole("button", { name: "Open project details" }),
		);
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=sheet-content]",
			);
			expect(content?.classList.contains("custom-sheet")).toBe(true);
		});
	});
});
