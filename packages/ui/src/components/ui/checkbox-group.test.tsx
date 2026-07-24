// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "#/components/ui/checkbox.tsx";
import { CheckboxGroup } from "#/components/ui/checkbox-group.tsx";

afterEach(cleanup);

function queryGroup(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=checkbox-group]");
}

function queryBoxes(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll("[data-slot=checkbox]"),
	);
}

function renderGroup(props?: React.ComponentProps<typeof CheckboxGroup>) {
	return render(
		<CheckboxGroup {...props}>
			<Checkbox name="design" />
			<Checkbox name="development" />
		</CheckboxGroup>,
	);
}

describe("CheckboxGroup", () => {
	it("renders its checkboxes inside the group element", () => {
		const screen = renderGroup();
		expect(queryGroup(screen)).toBeTruthy();
		expect(queryBoxes(screen)).toHaveLength(2);
	});

	it("ticks the boxes named in defaultValue", () => {
		const screen = renderGroup({ defaultValue: ["development"] });
		const [first, second] = queryBoxes(screen);
		expect(first?.getAttribute("aria-checked")).toBe("false");
		expect(second?.getAttribute("aria-checked")).toBe("true");
	});

	it("defaults to a vertical grid layout", () => {
		const screen = renderGroup();
		const group = queryGroup(screen);
		expect(group?.getAttribute("data-orientation")).toBe("vertical");
		expect(group?.classList.contains("grid")).toBe(true);
		expect(group?.classList.contains("flex")).toBe(false);
	});

	it("lays items out in a row when orientation is horizontal", () => {
		const screen = renderGroup({ orientation: "horizontal" });
		const group = queryGroup(screen);
		expect(group?.getAttribute("data-orientation")).toBe("horizontal");
		expect(group?.classList.contains("flex")).toBe(true);
		expect(group?.classList.contains("grid")).toBe(false);
	});

	it("reports the new value array when a box is ticked", () => {
		const onValueChange = vi.fn();
		const screen = renderGroup({
			defaultValue: ["design"],
			onValueChange,
		});
		const [, second] = queryBoxes(screen);
		if (!second) throw new Error("missing checkbox");
		fireEvent.click(second);
		expect(second.getAttribute("aria-checked")).toBe("true");
		expect(onValueChange).toHaveBeenCalledWith(
			["design", "development"],
			expect.anything(),
		);
	});

	it("respects the controlled value and does not self-toggle", () => {
		const screen = renderGroup({ value: [], onValueChange: () => {} });
		const [first] = queryBoxes(screen);
		if (!first) throw new Error("missing checkbox");
		fireEvent.click(first);
		// Parent ignored the change, so the box stays unticked.
		expect(first.getAttribute("aria-checked")).toBe("false");
	});

	it("blocks ticking while the group is disabled", () => {
		const onValueChange = vi.fn();
		const screen = renderGroup({ disabled: true, onValueChange });
		const [first] = queryBoxes(screen);
		if (!first) throw new Error("missing checkbox");
		expect(first.hasAttribute("data-disabled")).toBe(true);
		fireEvent.click(first);
		expect(onValueChange).not.toHaveBeenCalled();
		expect(first.getAttribute("aria-checked")).toBe("false");
	});

	it("drives a tick-all parent checkbox via allValues", () => {
		const screen = render(
			<CheckboxGroup allValues={["design", "development"]}>
				<Checkbox parent />
				<Checkbox name="design" />
				<Checkbox name="development" />
			</CheckboxGroup>,
		);
		const [parent, first, second] = queryBoxes(screen);
		if (!parent || !first) throw new Error("missing checkbox");
		fireEvent.click(parent);
		expect(first.getAttribute("aria-checked")).toBe("true");
		expect(second?.getAttribute("aria-checked")).toBe("true");
		// Unticking one child puts the parent in the indeterminate state.
		fireEvent.click(first);
		expect(parent.getAttribute("aria-checked")).toBe("mixed");
	});

	it("drops custom ids in parent mode (upstream aria-controls wiring)", () => {
		// Documents the Base UI behavior behind the "wrap the Label" advice in
		// checkbox-group.tsx: with `allValues` set, every box's `id` is replaced
		// by a generated one, so `htmlFor`/`id` label pairs silently break. If
		// this starts failing on a Base UI upgrade, the constraint is gone.
		const screen = render(
			<CheckboxGroup allValues={["design"]}>
				<Checkbox parent />
				<Checkbox name="design" id="custom-box-id" />
			</CheckboxGroup>,
		);
		expect(screen.baseElement.querySelector("#custom-box-id")).toBeNull();
	});

	it("toggles a box through its wrapping label in parent mode", () => {
		const onValueChange = vi.fn();
		const screen = render(
			<CheckboxGroup allValues={["design"]} onValueChange={onValueChange}>
				<Checkbox parent />
				{/* biome-ignore lint/a11y/noLabelWithoutControl: the control is the wrapped checkbox's hidden input */}
				<label>
					<Checkbox name="design" />
					Design
				</label>
			</CheckboxGroup>,
		);
		const label = screen.baseElement.querySelector("label");
		if (!label) throw new Error("missing label");
		fireEvent.click(label);
		expect(onValueChange).toHaveBeenCalledWith(["design"], expect.anything());
	});

	it("merges className over the group classes", () => {
		const screen = renderGroup({ className: "custom-group-class" });
		expect(queryGroup(screen)?.classList.contains("custom-group-class")).toBe(
			true,
		);
	});
});
