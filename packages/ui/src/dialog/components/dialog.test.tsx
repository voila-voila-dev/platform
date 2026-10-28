// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Button } from "#/button/components/button.tsx";
import { Dialog } from "#/dialog/components/dialog.tsx";

function Fixture({
	footerCloseLabel,
	...props
}: React.ComponentProps<typeof Dialog.Content> & {
	footerCloseLabel?: string;
}) {
	return (
		<Dialog.Root>
			<Dialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</Dialog.Trigger>
			<Dialog.Content {...props}>
				<Dialog.Header>
					<Dialog.Title>Cancel this project?</Dialog.Title>
					<Dialog.Description>
						The assigned freelancer will be notified immediately.
					</Dialog.Description>
				</Dialog.Header>
				<Dialog.Footer closeLabel={footerCloseLabel}>
					<Dialog.Close render={<Button variant="outline" />}>
						Keep project
					</Dialog.Close>
					<Button variant="destructive">Confirm cancellation</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	);
}

afterEach(cleanup);

describe("Dialog", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button", { name: "Cancel project" })).toBeTruthy();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("opens on trigger click with title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
			expect(screen.getByText("Cancel this project?")).toBeTruthy();
			expect(
				screen.getByText(
					"The assigned freelancer will be notified immediately.",
				),
			).toBeTruthy();
		});
	});

	it("applies the size to the popup as a data attribute", async () => {
		const screen = render(<Fixture size="lg" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=dialog-content]",
			);
			expect(content?.getAttribute("data-size")).toBe("lg");
		});
	});

	it("defaults the size to sm", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=dialog-content]",
			);
			expect(content?.getAttribute("data-size")).toBe("sm");
		});
	});

	it("renders the built-in close button under its own slot, separate from Dialog.Close", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		// The auto X button and the public Dialog.Close must not share a slot, so
		// styling `[data-slot=dialog-close]` never hits the X button.
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-close-button]"),
		).not.toBeNull();
		const cancel = screen.baseElement.querySelector("[data-slot=dialog-close]");
		expect(cancel?.textContent).toBe("Keep project");
	});

	it("closes when the built-in close button is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Close" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("closes when a Dialog.Close action is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Keep project" }));
		await waitFor(() => {
			expect(screen.queryByRole("dialog")).toBeNull();
		});
	});

	it("overrides the built-in close button label for localization", async () => {
		const screen = render(<Fixture closeButtonLabel="Fermer" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("button", { name: "Fermer" })).toBeTruthy();
		});
	});

	it("hides the built-in close button when showCloseButton is false", async () => {
		const screen = render(<Fixture showCloseButton={false} />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-close-button]"),
		).toBeNull();
	});

	it("renders the footer close button before the actions so it never lands after the primary", async () => {
		const screen = render(<Fixture footerCloseLabel="Fermer" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});

		const footer = screen.baseElement.querySelector(
			"[data-slot=dialog-footer]",
		);
		const buttons = Array.from(footer?.querySelectorAll("button") ?? []);
		expect(buttons.map((button) => button.textContent)).toEqual([
			"Fermer",
			"Keep project",
			"Confirm cancellation",
		]);
	});

	it("omits the footer close button when no closeLabel is provided", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("dialog")).toBeTruthy();
		});
		expect(
			screen.baseElement.querySelector("[data-slot=dialog-footer-close]"),
		).toBeNull();
	});

	it("closes when the footer close button is clicked", async () => {
		const screen = render(<Fixture footerCloseLabel="Fermer" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
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
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			const content = screen.baseElement.querySelector(
				"[data-slot=dialog-content]",
			);
			expect(content?.classList.contains("custom-dialog")).toBe(true);
		});
	});

	it("forwards overlayClassName to the overlay", async () => {
		const screen = render(<Fixture overlayClassName="custom-overlay" />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			const overlay = screen.baseElement.querySelector(
				"[data-slot=dialog-overlay]",
			);
			expect(overlay?.classList.contains("custom-overlay")).toBe(true);
		});
	});
});
