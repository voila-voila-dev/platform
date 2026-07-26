// @vitest-environment jsdom
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Command } from "#/command/components/command.tsx";
import { useCommandPalette } from "#/hooks/use-command-palette.ts";

beforeAll(() => {
	// cmdk scrolls the selected item into view and observes the list size;
	// jsdom implements neither.
	Element.prototype.scrollIntoView = () => {};
	globalThis.ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

function renderCommand() {
	return render(
		<Command.Root>
			<Command.Input placeholder="Search freelancers" />
			<Command.List>
				<Command.Empty>No results found.</Command.Empty>
				<Command.Group heading="Freelancers">
					<Command.Item value="nathan-guyot" keywords={["design"]}>
						Nathan Guyot
						<Command.Shortcut>⌘P</Command.Shortcut>
					</Command.Item>
					<Command.Item value="all-freelancers">All freelancers</Command.Item>
				</Command.Group>
				<Command.Separator />
				<Command.Group heading="Settings">
					<Command.Item value="workspace-settings" disabled>
						Workspace settings
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>,
	);
}

function itemLabels() {
	return Array.from(document.querySelectorAll("[data-slot=command-item]")).map(
		(item) => item.textContent,
	);
}

afterEach(cleanup);

describe("Command", () => {
	it("renders the input with its placeholder", () => {
		const screen = renderCommand();
		expect(screen.getByPlaceholderText("Search freelancers")).toBeTruthy();
	});

	it("renders every item with group headings when no query is set", () => {
		renderCommand();
		expect(itemLabels()).toEqual([
			"Nathan Guyot⌘P",
			"All freelancers",
			"Workspace settings",
		]);
		expect(
			Array.from(document.querySelectorAll("[cmdk-group-heading]")).map(
				(heading) => heading.textContent,
			),
		).toEqual(["Freelancers", "Settings"]);
	});

	it("filters the list down to the matching item as the user types", async () => {
		const screen = renderCommand();
		fireEvent.change(screen.getByPlaceholderText("Search freelancers"), {
			target: { value: "all" },
		});
		await waitFor(() => {
			expect(itemLabels()).toEqual(["All freelancers"]);
		});
	});

	it("matches items through their keywords", async () => {
		const screen = renderCommand();
		fireEvent.change(screen.getByPlaceholderText("Search freelancers"), {
			target: { value: "design" },
		});
		await waitFor(() => {
			expect(itemLabels()).toEqual(["Nathan Guyot⌘P"]);
		});
	});

	it("shows the muted empty slot when nothing matches", async () => {
		const screen = renderCommand();
		fireEvent.change(screen.getByPlaceholderText("Search freelancers"), {
			target: { value: "zzz" },
		});
		await waitFor(() => {
			expect(itemLabels()).toEqual([]);
		});
		const empty = document.querySelector("[data-slot=command-empty]");
		expect(empty?.textContent).toBe("No results found.");
		expect(empty?.className).toContain("text-muted-foreground");
	});

	it("marks a disabled item as disabled", () => {
		renderCommand();
		const disabled = document.querySelector(
			"[data-slot=command-item][data-disabled=true]",
		);
		expect(disabled?.textContent).toBe("Workspace settings");
		expect(disabled?.getAttribute("aria-disabled")).toBe("true");
	});

	it("renders the shortcut inside its item", () => {
		renderCommand();
		const shortcut = document.querySelector("[data-slot=command-shortcut]");
		expect(shortcut?.textContent).toBe("⌘P");
		expect(
			shortcut?.closest("[data-slot=command-item]")?.textContent,
		).toContain("Nathan Guyot");
	});
});

describe("Command.Dialog", () => {
	function renderDialog(open: boolean) {
		return render(
			<Command.Dialog open={open} onOpenChange={() => {}}>
				<Command.Root>
					<Command.Input placeholder="Type a command" />
					<Command.List>
						<Command.Empty>No results found.</Command.Empty>
						<Command.Item>Create a project</Command.Item>
					</Command.List>
				</Command.Root>
			</Command.Dialog>,
		);
	}

	it("leaves no phantom title or description in the page while closed", () => {
		const screen = renderDialog(false);
		expect(screen.queryByRole("dialog")).toBeNull();
		expect(screen.queryByText("Command Palette")).toBeNull();
		expect(screen.queryByText("Search for a command to run...")).toBeNull();
	});

	it("names the open dialog through its sr-only header", async () => {
		const screen = renderDialog(true);
		await waitFor(() => {
			expect(
				screen.getByRole("dialog", { name: "Command Palette" }),
			).toBeTruthy();
		});
		expect(screen.getByText("Search for a command to run...")).toBeTruthy();
	});
});

describe("useCommandPalette", () => {
	function Fixture() {
		const { open, setOpen } = useCommandPalette();
		return (
			<button type="button" onClick={() => setOpen(false)}>
				{open ? "open" : "closed"}
			</button>
		);
	}

	it("toggles on the meta hotkey and ignores the bare key", () => {
		const screen = render(<Fixture />);
		expect(screen.getByRole("button").textContent).toBe("closed");

		fireEvent.keyDown(document, { key: "k" });
		expect(screen.getByRole("button").textContent).toBe("closed");

		fireEvent.keyDown(document, { key: "k", metaKey: true });
		expect(screen.getByRole("button").textContent).toBe("open");

		fireEvent.keyDown(document, { key: "K", ctrlKey: true });
		expect(screen.getByRole("button").textContent).toBe("closed");
	});

	it("stops listening after unmount", () => {
		const screen = render(<Fixture />);
		screen.unmount();
		// Throws if the effect's listener survived unmount and called setState.
		fireEvent.keyDown(document, { key: "k", metaKey: true });
	});
});
