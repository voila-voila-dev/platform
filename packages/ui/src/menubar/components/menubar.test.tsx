// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Menubar } from "#/menubar/components/menubar.tsx";

afterEach(cleanup);

describe("Menubar", () => {
	it("renders a compact (w-fit) bar that is closed by default", () => {
		const screen = render(
			<Menubar.Root>
				<Menubar.Menu>
					<Menubar.Trigger>Projects</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>New project</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>Freelancers</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>Invite a freelancer</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
				<Menubar.Menu>
					<Menubar.Trigger>View</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>Toggle</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>,
		);

		const root = screen.baseElement.querySelector("[data-slot=menubar]");
		expect(root).not.toBeNull();
		// Review fix: the bar must read as a compact widget, not stretch full-width.
		expect(root?.className).toContain("w-fit");

		for (const label of ["Projects", "Freelancers", "View"]) {
			const trigger = screen.getByText(label);
			expect(trigger.getAttribute("data-slot")).toBe("menubar-trigger");
			expect(trigger.getAttribute("aria-expanded")).toBe("false");
		}
	});

	it("renders an open menu's items through the wrapped dropdown parts", () => {
		const screen = render(
			<Menubar.Root>
				<Menubar.Menu defaultOpen>
					<Menubar.Trigger>Projects</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.Item>New project</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger>Export</Menubar.SubTrigger>
							<Menubar.SubContent>
								<Menubar.Item>Export as CSV</Menubar.Item>
							</Menubar.SubContent>
						</Menubar.Sub>
						<Menubar.Item variant="destructive">Cancel project</Menubar.Item>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>,
		);

		const item = screen.getByText("New project");
		expect(item.getAttribute("data-slot")).toBe("menubar-item");

		// Destructive variant flows through to the wrapped DropdownMenuItem.
		const destructive = screen.getByText("Cancel project");
		expect(destructive.getAttribute("data-variant")).toBe("destructive");

		const subTrigger = screen.getByText("Export");
		expect(subTrigger.getAttribute("data-slot")).toBe("menubar-sub-trigger");
	});

	it("renders checkbox and radio items with the shared dropdown indicator layout", () => {
		const screen = render(
			<Menubar.Root>
				<Menubar.Menu defaultOpen>
					<Menubar.Trigger>View</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.CheckboxItem defaultChecked>
							Show archived projects
						</Menubar.CheckboxItem>
						<Menubar.RadioGroup defaultValue="week">
							<Menubar.RadioItem value="day">Day</Menubar.RadioItem>
							<Menubar.RadioItem value="week">Week</Menubar.RadioItem>
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>,
		);

		const checkbox = screen.getByText("Show archived projects");
		expect(checkbox.getAttribute("data-slot")).toBe("menubar-checkbox-item");
		expect(checkbox.getAttribute("role")).toBe("menuitemcheckbox");
		// Review fix: the indicator now sits on the right like the dropdown menu,
		// instead of the old left-side (pl-7 / pr-1.5) layout — the shared menu
		// recipe spells the padding as px-1.5 with a pr-8 override (Tailwind emits
		// pr-* after px-*, so the right padding is 8).
		expect(checkbox.className).toContain("pr-8");
		expect(checkbox.className).toContain("px-1.5");
		expect(checkbox.className).not.toContain("pr-1.5");

		const week = screen.getByText("Week");
		expect(week.getAttribute("data-slot")).toBe("menubar-radio-item");
		expect(week.getAttribute("role")).toBe("menuitemradio");
		expect(week.getAttribute("aria-checked")).toBe("true");
		expect(week.className).toContain("pr-8");
	});

	it("keeps the checked checkbox state visible in the open menu", () => {
		const screen = render(
			<Menubar.Root>
				<Menubar.Menu defaultOpen>
					<Menubar.Trigger>View</Menubar.Trigger>
					<Menubar.Content>
						<Menubar.CheckboxItem defaultChecked>
							Show archived projects
						</Menubar.CheckboxItem>
					</Menubar.Content>
				</Menubar.Menu>
			</Menubar.Root>,
		);

		const checkbox = screen.getByRole("menuitemcheckbox", {
			name: "Show archived projects",
		});
		expect(checkbox.getAttribute("aria-checked")).toBe("true");
		// The check indicator (a Phosphor SVG) renders inside the item when checked.
		expect(checkbox.querySelector("svg")).not.toBeNull();
	});
});
