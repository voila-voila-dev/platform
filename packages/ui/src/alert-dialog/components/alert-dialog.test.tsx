// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { AlertDialog } from "#/alert-dialog/components/alert-dialog.tsx";
import { Button } from "#/button/components/button.tsx";

function Fixture(props: React.ComponentProps<typeof AlertDialog.Root>) {
	return (
		<AlertDialog.Root {...props}>
			<AlertDialog.Trigger render={<Button variant="outline" />}>
				Cancel project
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title>Cancel this project?</AlertDialog.Title>
					<AlertDialog.Description>
						This action cannot be undone.
					</AlertDialog.Description>
				</AlertDialog.Header>
				<AlertDialog.Footer>
					<AlertDialog.Cancel>Keep project</AlertDialog.Cancel>
					<AlertDialog.Action variant="destructive">Confirm</AlertDialog.Action>
				</AlertDialog.Footer>
			</AlertDialog.Content>
		</AlertDialog.Root>
	);
}

afterEach(cleanup);

describe("AlertDialog", () => {
	it("renders only the trigger while closed", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button", { name: "Cancel project" })).toBeTruthy();
		expect(screen.queryByRole("alertdialog")).toBeNull();
	});

	it("opens on trigger click with title and description", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
			expect(screen.getByText("Cancel this project?")).toBeTruthy();
			expect(screen.getByText("This action cannot be undone.")).toBeTruthy();
		});
	});

	it("closes when the action button is clicked", async () => {
		const screen = render(<Fixture />);
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
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
		fireEvent.click(screen.getByRole("button", { name: "Cancel project" }));
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});

		fireEvent.click(screen.getByRole("button", { name: "Keep project" }));
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
				<AlertDialog.Root
					open={open}
					onOpenChange={() => {
						// pending async work: ignore close requests
					}}
				>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>Archive this project?</AlertDialog.Title>
							<AlertDialog.Description>
								Restorable at any time.
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
							<Button onClick={() => setOpen(false)}>Archive</Button>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
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
			<AlertDialog.Root defaultOpen>
				<AlertDialog.Content size="sm">
					<AlertDialog.Header>
						<AlertDialog.Title>Small dialog</AlertDialog.Title>
						<AlertDialog.Description>Compact layout.</AlertDialog.Description>
					</AlertDialog.Header>
				</AlertDialog.Content>
			</AlertDialog.Root>,
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
			<AlertDialog.Root defaultOpen>
				<AlertDialog.Content size="sm">
					<AlertDialog.Header>
						<AlertDialog.Media>
							<svg role="img" aria-label="Warning" />
						</AlertDialog.Media>
						<AlertDialog.Title>Remove this freelancer?</AlertDialog.Title>
						<AlertDialog.Description>
							Access will be revoked.
						</AlertDialog.Description>
					</AlertDialog.Header>
				</AlertDialog.Content>
			</AlertDialog.Root>,
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
			<AlertDialog.Root defaultOpen>
				<AlertDialog.Content>
					<AlertDialog.Header>
						<AlertDialog.Title>Styled buttons</AlertDialog.Title>
						<AlertDialog.Description>Class merging.</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer>
						<AlertDialog.Cancel className="custom-cancel-class">
							Cancel
						</AlertDialog.Cancel>
						<AlertDialog.Action className="custom-action-class">
							Confirm
						</AlertDialog.Action>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>,
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

	it("lets the header, footer and media pick their element via render", async () => {
		const screen = render(
			<AlertDialog.Root defaultOpen>
				<AlertDialog.Content>
					<AlertDialog.Header render={<header />}>
						<AlertDialog.Media render={<span />}>
							<svg role="img" aria-label="Warning" />
						</AlertDialog.Media>
						<AlertDialog.Title>Custom elements</AlertDialog.Title>
						<AlertDialog.Description>
							Render prop coverage.
						</AlertDialog.Description>
					</AlertDialog.Header>
					<AlertDialog.Footer render={<footer />}>
						<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
					</AlertDialog.Footer>
				</AlertDialog.Content>
			</AlertDialog.Root>,
		);
		await waitFor(() => {
			expect(screen.getByRole("alertdialog")).toBeTruthy();
		});
		const bySlot = (slot: string) =>
			screen.baseElement.querySelector(`[data-slot=${slot}]`);
		expect(bySlot("alert-dialog-header")?.tagName).toBe("HEADER");
		expect(bySlot("alert-dialog-footer")?.tagName).toBe("FOOTER");
		expect(bySlot("alert-dialog-media")?.tagName).toBe("SPAN");
		// The media slot still drives the header's grid contract.
		expect(
			bySlot("alert-dialog-header")?.className.includes(
				"has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr]",
			),
		).toBe(true);
	});
});
