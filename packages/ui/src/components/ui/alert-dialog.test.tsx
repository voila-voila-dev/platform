// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/ui/alert-dialog.tsx";
import { Button } from "#/components/ui/button.tsx";

function Fixture(props: React.ComponentProps<typeof AlertDialog>) {
	return (
		<AlertDialog {...props}>
			<AlertDialogTrigger render={<Button variant="outline" />}>
				Cancel mission
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Cancel this mission?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Keep mission</AlertDialogCancel>
					<AlertDialogAction variant="destructive">Confirm</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

afterEach(cleanup);

describe("AlertDialog", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button", { name: "Cancel mission" })).toBeTruthy();
		expect(screen.queryByRole("alertdialog")).toBeNull();
	});

	it("opens on trigger click with title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
			expect(screen.getByText("Cancel this mission?")).toBeTruthy();
			expect(screen.getByText("This action cannot be undone.")).toBeTruthy();
		});
	});

	it("closes when the action button is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
	});

	it("closes when the cancel button is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel mission" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Keep mission" }));
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
	});

	it("renders open with defaultOpen", async () => {
		const screen = render(<Fixture defaultOpen />);
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});
	});

	it("stays open in controlled mode when the parent ignores close requests", async () => {
		function ControlledFixture() {
			const [open, setOpen] = useState(true);
			return (
				<AlertDialog
					open={open}
					onOpenChange={() => {
						// pending async work: ignore close requests
					}}
				>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Archive this mission?</AlertDialogTitle>
							<AlertDialogDescription>
								Restorable at any time.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<Button onClick={() => setOpen(false)}>Archive</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			);
		}

		const screen = render(<ControlledFixture />);
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		await new Promise((resolve) => setTimeout(resolve, 50));
		expect(screen.getByRole("alertdialog")).toBeTruthy();

		fireEvent.click(screen.getByRole("button", { name: "Archive" }));
		await waitFor(() => {
			expect(screen.queryByRole("alertdialog")).toBeNull();
		});
	});

	it("applies the size to the popup as a data attribute", async () => {
		const screen = render(
			<AlertDialog defaultOpen>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogTitle>Small dialog</AlertDialogTitle>
						<AlertDialogDescription>Compact layout.</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		);
		await waitFor(() => {
			const popup = screen.baseElement.querySelector(
				"[data-slot=alert-dialog-content]",
			);
			expect(popup?.getAttribute("data-size")).toBe("sm");
		});
	});

	it("renders the media slot inside the header", async () => {
		const screen = render(
			<AlertDialog defaultOpen>
				<AlertDialogContent size="sm">
					<AlertDialogHeader>
						<AlertDialogMedia>
							<svg role="img" aria-label="Warning" />
						</AlertDialogMedia>
						<AlertDialogTitle>Remove this provider?</AlertDialogTitle>
						<AlertDialogDescription>
							Access will be revoked.
						</AlertDialogDescription>
					</AlertDialogHeader>
				</AlertDialogContent>
			</AlertDialog>,
		);
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});
		const header = screen.baseElement.querySelector(
			"[data-slot=alert-dialog-header]",
		);
		const media = header?.querySelector("[data-slot=alert-dialog-media]");
		expect(media).not.toBeNull();
	});

	it("merges className into the action and cancel buttons", async () => {
		const screen = render(
			<AlertDialog defaultOpen>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Styled buttons</AlertDialogTitle>
						<AlertDialogDescription>Class merging.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="custom-cancel-class">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction className="custom-action-class">
							Confirm
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>,
		);
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});
		const action = screen.baseElement.querySelector(
			"[data-slot=alert-dialog-action]",
		);
		const cancel = screen.baseElement.querySelector(
			"[data-slot=alert-dialog-cancel]",
		);
		expect(action?.classList.contains("custom-action-class")).toBe(true);
		expect(cancel?.classList.contains("custom-cancel-class")).toBe(true);
	});
});
