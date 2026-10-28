// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Select } from "#/select/components/select.tsx";

afterEach(cleanup);

const specialtyItems = {
	developer: "Developer",
	consultant: "Consultant",
	designer: "Designer",
};

function renderSelect(
	rootProps: React.ComponentProps<typeof Select.Root> = {},
	triggerProps: React.ComponentProps<typeof Select.Trigger> = {},
) {
	return render(
		<Select.Root items={specialtyItems} {...rootProps}>
			<Select.Trigger {...triggerProps}>
				<Select.Value placeholder="Select a specialty" />
			</Select.Trigger>
			<Select.Content>
				<Select.Item value="developer">Developer</Select.Item>
				<Select.Item value="consultant">Consultant</Select.Item>
				<Select.Item value="designer">Designer</Select.Item>
			</Select.Content>
		</Select.Root>,
	);
}

describe("Select", () => {
	it("renders the trigger with the placeholder", () => {
		const screen = renderSelect();
		const trigger = screen.getByRole("combobox");
		expect(trigger.getAttribute("data-slot")).toBe("select-trigger");
		expect(trigger.textContent).toContain("Select a specialty");
	});

	it("shows the item label in the trigger, not the raw value", () => {
		const screen = renderSelect({ defaultValue: "consultant" });
		const trigger = screen.getByRole("combobox");
		expect(trigger.textContent).toContain("Consultant");
		expect(trigger.textContent).not.toContain("consultant");
	});

	it("defaults to the default size and supports sm", () => {
		const screen = renderSelect();
		expect(screen.getByRole("combobox").getAttribute("data-size")).toBe(
			"default",
		);
		cleanup();
		const small = renderSelect({}, { size: "sm" });
		expect(small.getByRole("combobox").getAttribute("data-size")).toBe("sm");
	});

	it("merges className onto the trigger", () => {
		const screen = renderSelect({}, { className: "w-56" });
		const trigger = screen.getByRole("combobox");
		expect(trigger.classList.contains("w-56")).toBe(true);
		expect(trigger.classList.contains("hover:bg-muted")).toBe(true);
	});

	it("keeps the popup out of the DOM while closed", () => {
		renderSelect();
		expect(document.querySelector("[data-slot=select-content]")).toBeNull();
	});

	it("pads the item list once, on the list itself", () => {
		renderSelect({ defaultOpen: true });
		const popup = document.querySelector("[data-slot=select-content]");
		expect(popup).not.toBeNull();
		const item = document.querySelector("[data-slot=select-item]");
		const list = item?.parentElement;
		expect(list?.classList.contains("p-1")).toBe(true);
	});

	it("no longer double-pads grouped items", () => {
		render(
			<Select.Root defaultOpen>
				<Select.Trigger>
					<Select.Value placeholder="Project type" />
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Reviews</Select.Label>
						<Select.Item value="design-review">Design review</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>,
		);
		const group = document.querySelector("[data-slot=select-group]");
		expect(group?.classList.contains("scroll-my-1")).toBe(true);
		expect(group?.classList.contains("p-1")).toBe(false);
	});

	it("marks the selected item and shows its indicator", () => {
		renderSelect({ defaultValue: "designer", defaultOpen: true });
		const selected = document.querySelector(
			"[data-slot=select-item][data-selected]",
		);
		expect(selected?.textContent).toContain("Designer");
		expect(selected?.querySelector("svg")).not.toBeNull();
	});

	it("renders a hidden input for forms integration", () => {
		renderSelect({ name: "role", defaultValue: "developer" });
		const input = document.querySelector("input[name=role]");
		expect(input).not.toBeNull();
	});

	it("disables the trigger when the root is disabled", () => {
		const screen = renderSelect({ disabled: true });
		const trigger = screen.getByRole("combobox");
		expect(trigger.hasAttribute("disabled")).toBe(true);
	});
});
