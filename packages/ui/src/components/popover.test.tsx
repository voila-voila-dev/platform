// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Button } from "#/components/button.tsx";
import {
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverDescription,
	PopoverHeader,
	PopoverTitle,
	PopoverTrigger,
} from "#/components/popover.tsx";

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

function Fixture(props: React.ComponentProps<typeof PopoverContent>) {
	return (
		<Popover>
			<PopoverTrigger render={<Button variant="outline" />}>
				Project details
			</PopoverTrigger>
			<PopoverContent {...props}>
				<PopoverHeader>
					<PopoverTitle>Q3 brand refresh</PopoverTitle>
					<PopoverDescription>
						Kickoff call — June 14, from 14:00 to 18:00.
					</PopoverDescription>
				</PopoverHeader>
				<PopoverClose render={<Button variant="ghost" />}>Close</PopoverClose>
			</PopoverContent>
		</Popover>
	);
}

const queryContent = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=popover-content]");

describe("Popover", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(
			screen.getByRole("button", { name: "Project details" }),
		).toBeTruthy();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("opens on trigger click with an a11y-wired title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			const dialog = screen.getByRole("dialog");
			expect(dialog).toBeTruthy();
			// Base UI auto-wires aria-labelledby/aria-describedby to Title/Description.
			expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
			expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
			expect(screen.getByText("Q3 brand refresh")).toBeTruthy();
			expect(
				screen.getByText("Kickoff call — June 14, from 14:00 to 18:00."),
			).toBeTruthy();
		});
	});

	it("closes when PopoverClose is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		const close = screen.baseElement.querySelector("[data-slot=popover-close]");
		expect(close).not.toBeNull();
		fireEvent.click(close as Element);
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("respects reduced motion on the popup animation", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			expect(
				queryContent(screen)?.classList.contains("motion-reduce:animate-none"),
			).toBe(true);
		});
	});

	it("does not restate text-sm on the header (inherited from the popup)", async () => {
		// Regression: the header duplicated the popup's `text-sm`, a drift hazard.
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			const header = screen.baseElement.querySelector(
				"[data-slot=popover-header]",
			);
			expect(header).not.toBeNull();
			expect(header?.classList.contains("text-sm")).toBe(false);
		});
	});

	it("forwards the side prop to the positioned popup", async () => {
		const screen = render(<Fixture side="top" />);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			expect(queryContent(screen)?.getAttribute("data-side")).toBe("top");
		});
	});

	it("forwards extra positioner props through the escape hatch", async () => {
		const screen = render(
			<Fixture positionerProps={{ "data-testid": "positioner" } as never} />,
		);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			expect(
				screen.baseElement.querySelector('[data-testid="positioner"]'),
			).not.toBeNull();
		});
	});

	it("merges className onto the popup", async () => {
		const screen = render(<Fixture className="custom-popover" />);
		fireEvent.click(screen.getByRole("button", { name: "Project details" }));
		await waitFor(() => {
			expect(queryContent(screen)?.classList.contains("custom-popover")).toBe(
				true,
			);
		});
	});
});
