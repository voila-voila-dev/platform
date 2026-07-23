// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "#/components/ui/button.tsx";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "#/components/ui/dialog.tsx";

function Fixture({
	footerCloseLabel,
	...props
}: React.ComponentProps<typeof DialogContent> & {
	footerCloseLabel?: string;
}) {
	return (
		<Dialog>
			<DialogTrigger render={<Button variant="outline" />}>
				Cancel mission
			</DialogTrigger>
			<DialogContent {...props}>
				<DialogHeader>
					<DialogTitle>Cancel this mission?</DialogTitle>
					<DialogDescription>
						The assigned provider will be notified immediately.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter closeLabel={footerCloseLabel}>
					<DialogClose render={<Button variant="outline" />}>
						Keep mission
					</DialogClose>
					<Button variant="destructive">Confirm cancellation</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

afterEach(cleanup);

describe("Dialog", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button", { name: "Cancel mission" })).toBeTruthy();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("opens on trigger click with title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
			expect(screen.getByText("Cancel this mission?")).toBeTruthy();
			expect(
				screen.getByText("The assigned provider will be notified immediately."),
			).toBeTruthy();
		});
	});

	it("applies the size to the popup as a data attribute", async () => {
		const screen = render(<Fixture size="lg" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=dialog-content]",
			);
			expect(content?.getAttribute("data-size")).toBe("lg");
		});
	});

	it("defaults the size to sm", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=dialog-content]",
			);
			expect(content?.getAttribute("data-size")).toBe("sm");
		});
	});

	it("renders the built-in close button under its own slot, separate from DialogClose", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		// The auto X button and the public DialogClose must not share a slot, so
		// styling `[data-slot=dialog-close]` never hits the X button.
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-close-button]"),
		).not.toBeNull();
		const cancel = screen.baseElement.querySelector("[data-slot=dialog-close]");
		expect(cancel?.textContent).toBe("Keep mission");
	});

	it("closes when the built-in close button is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Close" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("closes when a DialogClose action is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Keep mission" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("overrides the built-in close button label for localization", async () => {
		const screen = render(<Fixture closeButtonLabel="Fermer" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
		});
	});

	it("hides the built-in close button when showCloseButton is false", async () => {
		const screen = render(<Fixture showCloseButton={false} />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-close-button]"),
		).toBeNull();
	});

	it("renders the footer close button before the actions so it never lands after the primary", async () => {
		const screen = render(<Fixture footerCloseLabel="Fermer" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		const footer = screen.baseElement.querySelector(
			"[data-slot=dialog-footer]",
		);
		const buttons = Array.from(footer?.querySelectorAll("button") ?? []);
		expect(buttons.map((button) => button.textContent)).toEqual([
			"Fermer",
			"Keep mission",
			"Confirm cancellation",
		]);
	});

	it("omits the footer close button when no closeLabel is provided", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-footer-close]"),
		).toBeNull();
	});

	it("closes when the footer close button is clicked", async () => {
		const screen = render(<Fixture footerCloseLabel="Fermer" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Fermer" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("merges className onto the content popup", async () => {
		const screen = render(<Fixture className="custom-dialog" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=dialog-content]",
			);
			expect(content?.classList.contains("custom-dialog")).toBe(true);
		});
	});

	it("forwards overlayClassName to the overlay", async () => {
		const screen = render(<Fixture overlayClassName="custom-overlay" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			const overlay = screen.baseElement.querySelector(
				"[data-slot=dialog-overlay]",
			);
			expect(overlay?.classList.contains("custom-overlay")).toBe(true);
		});
	});
});
