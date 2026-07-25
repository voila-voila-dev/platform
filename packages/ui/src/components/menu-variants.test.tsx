// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "#/components/context-menu.tsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "#/components/dropdown-menu.tsx";
import {
	menuContentVariants,
	menuItemVariants,
	menuShortcutVariants,
} from "#/components/menu-variants.ts";

afterEach(cleanup);

describe("menuItemVariants", () => {
	it("styles every primitive's active state so one recipe serves them all", () => {
		const classes = menuItemVariants();
		// Base UI menus focus the item…
		expect(classes).toContain("focus:bg-accent");
		// …Base UI combobox highlights it…
		expect(classes).toContain("data-highlighted:bg-accent");
		// …and cmdk selects it.
		expect(classes).toContain("data-[selected=true]:bg-accent");
	});

	it('gates disabled styles so cmdk\'s data-disabled="false" items stay live', () => {
		const classes = menuItemVariants();
		expect(classes).toContain(
			"data-disabled:not-data-[disabled=false]:opacity-50",
		);
		// A bare data-disabled selector would also match cmdk's enabled items.
		expect(classes).not.toMatch(/data-disabled:opacity-50/);
		expect(classes).not.toMatch(/data-disabled:pointer-events-none/);
	});

	it("swaps the accent palette for the destructive variant", () => {
		const classes = menuItemVariants({ variant: "destructive" });
		expect(classes).toContain("text-destructive");
		expect(classes).toContain("focus:bg-destructive/10");
		// tailwind-merge drops the conflicting accent classes from the base.
		expect(classes).not.toContain("focus:bg-accent");
	});

	it("reserves end-side indicator space on selectable rows", () => {
		expect(menuItemVariants({ indicator: "end" })).toContain("pr-8");
		expect(menuItemVariants()).not.toContain("pr-8");
	});
});

describe("menuContentVariants", () => {
	it("keeps both enter and exit animations (the old context-menu drift)", () => {
		const classes = menuContentVariants();
		expect(classes).toContain("data-open:animate-in");
		expect(classes).toContain("data-closed:animate-out");
		expect(classes).toContain("data-closed:overflow-hidden");
	});
});

describe("menuShortcutVariants", () => {
	it("recolors with the active row of every primitive", () => {
		const classes = menuShortcutVariants();
		expect(classes).toContain("group-focus/menu-item:text-accent-foreground");
		expect(classes).toContain(
			"group-data-highlighted/menu-item:text-accent-foreground",
		);
		expect(classes).toContain(
			"group-data-[selected=true]/menu-item:text-accent-foreground",
		);
	});
});

describe("recipe adoption", () => {
	it("renders identical item classes in dropdown-menu and context-menu", () => {
		const dropdownScreen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Edit project</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);
		const contextScreen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Edit project</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const dropdownItem = dropdownScreen.baseElement.querySelector(
			"[data-slot=dropdown-menu-item]",
		);
		const contextItem = contextScreen.baseElement.querySelector(
			"[data-slot=context-menu-item]",
		);
		expect(dropdownItem?.className).toBe(contextItem?.className);
	});

	it("renders identical content classes apart from context-menu's min width", () => {
		const dropdownScreen = render(
			<DropdownMenu defaultOpen>
				<DropdownMenuTrigger>Project actions</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>Edit project</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>,
		);
		const contextScreen = render(
			<ContextMenu defaultOpen>
				<ContextMenuTrigger>Right-click here</ContextMenuTrigger>
				<ContextMenuContent>
					<ContextMenuItem>Edit project</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>,
		);

		const dropdownContent = dropdownScreen.baseElement.querySelector(
			"[data-slot=dropdown-menu-content]",
		);
		const contextContent = contextScreen.baseElement.querySelector(
			"[data-slot=context-menu-content]",
		);
		const classSet = (element: Element | null) =>
			new Set(element?.className.split(/\s+/));
		const dropdownClasses = classSet(dropdownContent);
		dropdownClasses.delete("min-w-32");
		dropdownClasses.add("min-w-36");
		expect(classSet(contextContent)).toEqual(dropdownClasses);
	});
});
