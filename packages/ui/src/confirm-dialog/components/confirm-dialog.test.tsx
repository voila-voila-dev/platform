// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "#/button/components/button.tsx";
import { ConfirmDialog } from "#/confirm-dialog/components/confirm-dialog.tsx";

afterEach(cleanup);

describe("ConfirmDialog", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(
			<ConfirmDialog
				trigger={<Button variant="outline">Cancel project</Button>}
				title="Cancel this project?"
				description="This action cannot be undone."
			/>,
		);
		expect(screen.getByRole("button", { name: "Cancel project" })).toBeTruthy();
		expect(screen.queryByRole("alertdialog")).toBeNull();
	});

	it("opens on trigger click with title, description and default labels", async () => {
		const screen = render(
			<ConfirmDialog
				trigger={<Button variant="outline">Cancel project</Button>}
				title="Cancel this project?"
				description="This action cannot be undone."
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
			expect(screen.getByText("Cancel this project?")).toBeTruthy();
			expect(screen.getByText("This action cannot be undone.")).toBeTruthy();
			expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
			expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
		});
	});

	it("renders localized labels and the confirm button variant", async () => {
		const screen = render(
			<ConfirmDialog
				trigger={<Button>Eliminar</Button>}
				title="¿Eliminar este proyecto?"
				confirmLabel="Eliminar"
				cancelLabel="Cancelar"
				variant="destructive"
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});
		expect(screen.getByRole("button", { name: "Cancelar" })).toBeTruthy();
		const confirm = screen.baseElement.querySelector(
			"[data-slot=confirm-dialog-confirm]",
		);
		expect(confirm?.getAttribute("data-variant")).toBe("destructive");
	});

	it("closes and calls onCancel when the cancel button is clicked", async () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		const screen = render(
			<ConfirmDialog
				trigger={<Button>Delete</Button>}
				title="Delete this skill?"
				onConfirm={onConfirm}
				onCancel={onCancel}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
		expect(onCancel).toHaveBeenCalledTimes(1);
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it("calls onConfirm and closes for a synchronous handler", async () => {
		const onConfirm = vi.fn();
		const screen = render(
			<ConfirmDialog
				trigger={<Button>Delete</Button>}
				title="Delete this skill?"
				onConfirm={onConfirm}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Delete" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
		expect(onConfirm).toHaveBeenCalledTimes(1);
	});

	it("shows the pending state and blocks dismissal until the promise resolves", async () => {
		let resolveConfirm!: () => void;
		const onConfirm = vi.fn(
			() =>
				new Promise<void>((resolve) => {
					resolveConfirm = resolve;
				}),
		);
		const screen = render(
			<ConfirmDialog
				trigger={<Button>Archive</Button>}
				title="Archive this project?"
				onConfirm={onConfirm}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Archive" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		const confirm = screen.baseElement.querySelector(
			"[data-slot=confirm-dialog-confirm]",
		) as HTMLButtonElement;
		fireEvent.click(confirm);
		await waitFor(() => {
			expect(confirm.getAttribute("aria-busy")).toBe("true");
			expect(confirm.disabled).toBe(true);
		});
		const cancel = screen.getByRole("button", {
			name: "Cancel",
		}) as HTMLButtonElement;
		expect(cancel.disabled).toBe(true);

		fireEvent.keyDown(screen.getByRole("alertdialog"), { key: "Escape" });
		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(screen.getByRole("alertdialog")).toBeTruthy();

		resolveConfirm();
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
	});

	it("stays open and clears the pending state when the promise rejects", async () => {
		const onConfirm = vi.fn(() => Promise.reject(new Error("network down")));
		const screen = render(
			<ConfirmDialog
				trigger={<Button>Archive</Button>}
				title="Archive this project?"
				onConfirm={onConfirm}
			/>,
		);
		fireEvent.click(screen.getByRole("button", { name: "Archive" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		const confirm = screen.baseElement.querySelector(
			"[data-slot=confirm-dialog-confirm]",
		) as HTMLButtonElement;
		fireEvent.click(confirm);
		await waitFor(() => {
			expect(onConfirm).toHaveBeenCalledTimes(1);
			expect(confirm.disabled).toBe(false);
		});
		expect(screen.getByRole("alertdialog")).toBeTruthy();
	});

	it("supports controlled open state without a trigger", async () => {
		function ControlledFixture() {
			const [open, setOpen] = useState(false);
			return (
				<>
					<Button onClick={() => setOpen(true)}>Open externally</Button>
					<ConfirmDialog
						open={open}
						onOpenChange={setOpen}
						title="Remove this freelancer?"
					/>
				</>
			);
		}

		const screen = render(<ControlledFixture />);
		expect(screen.queryByRole("alertdialog")).toBeNull();

		fireEvent.click(screen.getByRole("button", { name: "Open externally" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
	});

	it("renders the media slot and forwards the content size", async () => {
		const screen = render(
			<ConfirmDialog
				open
				size="sm"
				title="Remove this freelancer?"
				media={<svg role="img" aria-label="Warning" />}
			/>,
		);
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});
		const popup = screen.baseElement.querySelector(
			"[data-slot=alert-dialog-content]",
		);
		expect(popup?.getAttribute("data-size")).toBe("sm");
		const media = screen.baseElement.querySelector(
			"[data-slot=alert-dialog-media]",
		);
		expect(media).not.toBeNull();
	});
});
