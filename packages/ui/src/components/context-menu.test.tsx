// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
} from "#/components/context-menu.tsx";

afterEach(cleanup);

describe("ContextMenu", () => {
	it("renders a standalone label without the GroupLabel crash", () => {
		// Review fix: ContextMenuLabel is a plain <div>, so it can live directly
		// under ContextMenuContent without a wrapping Menu.Group (Base UI's
		// GroupLabel used to throw "MenuGroupContext is missing").
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuLabel>Project</ContextMenuLabel>
					<ContextMenuGroup>
						<ContextMenuItem>Edit project</ContextMenuItem>
					</ContextMenuGroup>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const label = screen.getByText("Project");
		expect(label.tagName).toBe("DIV");
		expect(label.getAttribute("data-slot")).toBe("context-menu-label");
	});

	it("flows the destructive variant through to the item", () => {
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem variant="destructive">
						Cancel project
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const destructive = screen.getByText("Cancel project");
		expect(destructive.getAttribute("data-variant")).toBe("destructive");
	});

	it("scopes the focus text-recolor to icons, not every descendant", () => {
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>
						Edit project
						<ContextMenuShortcut>⌘E</ContextMenuShortcut>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const item = screen
			.getByText("Edit project")
			.closest("[data-slot=context-menu-item]");
		expect(item).not.toBeNull();
		expect(item?.className).toContain("focus:*:[svg]:text-accent-foreground");
		expect(item?.className).not.toContain("focus:**:text-accent-foreground");
	});

	it("renders the submenu trigger through the SubContent", () => {
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuSub>
						<ContextMenuSubTrigger>Assign freelancer</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<ContextMenuItem>Nathan Guyot</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const subTrigger = screen.getByText("Assign freelancer");
		expect(subTrigger.getAttribute("data-slot")).toBe(
			"context-menu-sub-trigger",
		);
		// Review fix: the sub-trigger highlights on `data-popup-open` (Base UI's
		// state attr), not the stale Radix-era `data-open`.
		expect(subTrigger.className).toContain("data-popup-open:bg-accent");
		expect(subTrigger.className).not.toContain("data-open:bg-accent");
	});

	it("places the checkbox indicator on the right (kit-consistent)", () => {
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuCheckboxItem defaultChecked>
						Show confirmed projects
					</ContextMenuCheckboxItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const checkbox = screen.getByRole("menuitemcheckbox", {
			name: "Show confirmed projects",
		});
		expect(checkbox.getAttribute("data-slot")).toBe(
			"context-menu-checkbox-item",
		);
		expect(checkbox.getAttribute("aria-checked")).toBe("true");
		expect(checkbox.className).toContain("pr-8");
		expect(checkbox.querySelector("svg")).not.toBeNull();
	});

	it("marks the selected radio item as checked", () => {
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuRadioGroup defaultValue="date">
						<ContextMenuRadioItem value="date">Date</ContextMenuRadioItem>
						<ContextMenuRadioItem value="client">Client</ContextMenuRadioItem>
					</ContextMenuRadioGroup>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const selected = screen.getByRole("menuitemradio", { name: "Date" });
		expect(selected.getAttribute("data-slot")).toBe("context-menu-radio-item");
		expect(selected.getAttribute("aria-checked")).toBe("true");
		expect(selected.querySelector("svg")).not.toBeNull();
	});

	it("renders a separator between groups", () => {
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Edit project</ContextMenuItem>
					<ContextMenuSeparator />
					<ContextMenuItem>Duplicate</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const separator = screen.baseElement.querySelector(
			"[data-slot=context-menu-separator]",
		);
		expect(separator).not.toBeNull();
	});

	it("merges a consumer className into SubContent instead of dropping shadow-lg", () => {
		// Review fix: ContextMenuSubContent now destructures `className` and merges
		// it with the default `shadow-lg` (it used to hardcode className before
		// {...props}, so a consumer className silently replaced shadow-lg).
		const screen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuSub defaultOpen>
						<ContextMenuSubTrigger>Assign freelancer</ContextMenuSubTrigger>
						<ContextMenuSubContent className="w-64">
							<ContextMenuItem>Nathan Guyot</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const subContent = screen.baseElement.querySelector(
			"[data-slot=context-menu-sub-content]",
		);
		expect(subContent).not.toBeNull();
		expect(subContent?.className).toContain("shadow-lg");
		expect(subContent?.className).toContain("w-64");
	});
});
