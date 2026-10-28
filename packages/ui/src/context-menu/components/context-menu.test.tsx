// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ContextMenu } from "#/context-menu/components/context-menu.tsx";

afterEach(cleanup);

describe("ContextMenu", () => {
	it("renders a standalone label without the GroupLabel crash", () => {
		// Review fix: ContextMenu.Label is a plain <div>, so it can live directly
		// under ContextMenu.Content without a wrapping Menu.Group (Base UI's
		// GroupLabel used to throw "MenuGroupContext is missing").
		const screen = render(
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Label>Project</ContextMenu.Label>
					<ContextMenu.Group>
						<ContextMenu.Item>Edit project</ContextMenu.Item>
					</ContextMenu.Group>
				</ContextMenu.Content>
			</ContextMenu.Root>,
		);

		const label = screen.getByText("Project");
		expect(label.tagName).toBe("DIV");
		expect(label.getAttribute("data-slot")).toBe("context-menu-label");
	});

	it("flows the destructive variant through to the item", () => {
		const screen = render(
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item variant="destructive">
						Cancel project
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>,
		);

		const destructive = screen.getByText("Cancel project");
		expect(destructive.getAttribute("data-variant")).toBe("destructive");
	});

	it("scopes the focus text-recolor to icons, not every descendant", () => {
		const screen = render(
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item>
						Edit project
						<ContextMenu.Shortcut>⌘E</ContextMenu.Shortcut>
					</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>,
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
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Sub>
						<ContextMenu.SubTrigger>Assign freelancer</ContextMenu.SubTrigger>
						<ContextMenu.SubContent>
							<ContextMenu.Item>Nathan Guyot</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
				</ContextMenu.Content>
			</ContextMenu.Root>,
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
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.CheckboxItem defaultChecked>
						Show confirmed projects
					</ContextMenu.CheckboxItem>
				</ContextMenu.Content>
			</ContextMenu.Root>,
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
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.RadioGroup defaultValue="date">
						<ContextMenu.RadioItem value="date">Date</ContextMenu.RadioItem>
						<ContextMenu.RadioItem value="client">Client</ContextMenu.RadioItem>
					</ContextMenu.RadioGroup>
				</ContextMenu.Content>
			</ContextMenu.Root>,
		);

		const selected = screen.getByRole("menuitemradio", { name: "Date" });
		expect(selected.getAttribute("data-slot")).toBe("context-menu-radio-item");
		expect(selected.getAttribute("aria-checked")).toBe("true");
		expect(selected.querySelector("svg")).not.toBeNull();
	});

	it("renders a separator between groups", () => {
		const screen = render(
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item>Edit project</ContextMenu.Item>
					<ContextMenu.Separator />
					<ContextMenu.Item>Duplicate</ContextMenu.Item>
				</ContextMenu.Content>
			</ContextMenu.Root>,
		);

		const separator = screen.baseElement.querySelector(
			"[data-slot=context-menu-separator]",
		);
		expect(separator).not.toBeNull();
	});

	it("merges a consumer className into SubContent instead of dropping shadow-lg", () => {
		// Review fix: ContextMenu.SubContent now destructures `className` and merges
		// it with the default `shadow-lg` (it used to hardcode className before
		// {...props}, so a consumer className silently replaced shadow-lg).
		const screen = render(
			<ContextMenu.Root defaultOpen>
				<ContextMenu.Trigger>Right-click here</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Sub defaultOpen>
						<ContextMenu.SubTrigger>Assign freelancer</ContextMenu.SubTrigger>
						<ContextMenu.SubContent className="w-64">
							<ContextMenu.Item>Nathan Guyot</ContextMenu.Item>
						</ContextMenu.SubContent>
					</ContextMenu.Sub>
				</ContextMenu.Content>
			</ContextMenu.Root>,
		);

		const subContent = screen.baseElement.querySelector(
			"[data-slot=context-menu-sub-content]",
		);
		expect(subContent).not.toBeNull();
		expect(subContent?.className).toContain("shadow-lg");
		expect(subContent?.className).toContain("w-64");
	});
});
