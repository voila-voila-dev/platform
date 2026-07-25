// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "#/components/dropdown-menu.tsx";

afterEach(cleanup);

describe("DropdownMenu", () => {
	it("renders a standalone label without the GroupLabel crash", () => {
		// Review fix: DropdownMenuLabel is a plain <div>, so it can live directly
		// under DropdownMenuContent without a wrapping Menu.Group (which used to
		// throw "MenuGroupContext is missing").
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Brand refresh</DropdownMenuLabel>
					<DropdownMenuGroup>
						<DropdownMenuItem>Edit project</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const label = screen.getByText("Brand refresh");
		expect(label.tagName).toBe("DIV");
		expect(label.getAttribute("data-slot")).toBe("dropdown-menu-label");
	});

	it("sizes the content to its items instead of locking to the trigger width", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Edit project</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const content = screen.baseElement.querySelector(
			"[data-slot=dropdown-menu-content]",
		);
		expect(content).not.toBeNull();
		// Review fix: the menu sizes to its items (min-w-32), not the anchor/trigger.
		expect(content?.className).toContain("min-w-32");
		expect(content?.className).not.toContain("w-(--anchor-width)");
	});

	it("scopes the focus text-recolor to icons, not every descendant", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						Edit project
						<DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const item = screen
			.getByText("Edit project")
			.closest("[data-slot=dropdown-menu-item]");
		expect(item).not.toBeNull();
		// Review fix: the blanket `focus:**:text-accent-foreground` (which stomped
		// every nested element's color) is replaced with an icon-scoped rule.
		expect(item?.className).toContain("focus:*:[svg]:text-accent-foreground");
		expect(item?.className).not.toContain("focus:**:text-accent-foreground");
	});

	it("flows the destructive variant through to the item", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem variant="destructive">
						Cancel project
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const destructive = screen.getByText("Cancel project");
		expect(destructive.getAttribute("data-variant")).toBe("destructive");
	});

	it("renders the submenu trigger through the deduplicated SubContent", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>Assign freelancer</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuItem>Nathan Guyot</DropdownMenuItem>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const subTrigger = screen.getByText("Assign freelancer");
		expect(subTrigger.getAttribute("data-slot")).toBe(
			"dropdown-menu-sub-trigger",
		);
	});

	it("places the checkbox indicator on the right (kit-consistent)", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Notification settings</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuCheckboxItem defaultChecked>
						New applications
					</DropdownMenuCheckboxItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const checkbox = screen.getByRole("menuitemcheckbox", {
			name: "New applications",
		});
		expect(checkbox.getAttribute("data-slot")).toBe(
			"dropdown-menu-checkbox-item",
		);
		expect(checkbox.getAttribute("aria-checked")).toBe("true");
		// Indicator stays on the right (pr-8), matching context-menu and menubar.
		expect(checkbox.className).toContain("pr-8");
		// The check indicator renders inside the item when checked.
		expect(checkbox.querySelector("svg")).not.toBeNull();
	});

	it("distinguishes a selected radio item with a filled dot, not a checkmark", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Sort projects</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuRadioGroup defaultValue="date">
						<DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
						<DropdownMenuRadioItem value="client">Client</DropdownMenuRadioItem>
					</DropdownMenuRadioGroup>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const selected = screen.getByRole("menuitemradio", { name: "Date" });
		expect(selected.getAttribute("data-slot")).toBe("dropdown-menu-radio-item");
		expect(selected.getAttribute("aria-checked")).toBe("true");
		// Review fix: the radio cue is a filled circle (size-2 dot), not the same
		// CheckIcon the checkbox uses — selected radio and checked checkbox are now
		// visually distinct.
		const indicatorSvg = selected.querySelector("svg");
		expect(indicatorSvg).not.toBeNull();
		expect(indicatorSvg?.classList.contains("size-2")).toBe(true);
	});

	it("renders a separator between groups", () => {
		const screen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Edit project</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Duplicate</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);

		const separator = screen.baseElement.querySelector(
			"[data-slot=dropdown-menu-separator]",
		);
		expect(separator).not.toBeNull();
	});
});
