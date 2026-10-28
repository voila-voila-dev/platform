// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NativeSelect } from "#/native-select/components/native-select.tsx";

afterEach(cleanup);

describe("NativeSelect", () => {
	it("renders a select with its slot attribute", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.tagName).toBe("SELECT");
		expect(select.getAttribute("data-slot")).toBe("native-select");
	});

	it("renders a decorative caret overlay hidden from assistive tech", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const icon = screen.container.querySelector(
			'[data-slot="native-select-icon"]',
		);
		expect(icon).not.toBeNull();
		expect(icon?.getAttribute("aria-hidden")).toBe("true");
		expect(icon?.classList.contains("pointer-events-none")).toBe(true);
	});

	it("defaults to the regular size on wrapper and select", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		const wrapper = screen.container.querySelector(
			'[data-slot="native-select-wrapper"]',
		);
		expect(select.getAttribute("data-size")).toBe("default");
		expect(wrapper?.getAttribute("data-size")).toBe("default");
		expect(select.classList.contains("h-8")).toBe(true);
	});

	it("reflects the small size through the data-size attribute", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession" size="sm">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		const wrapper = screen.container.querySelector(
			'[data-slot="native-select-wrapper"]',
		);
		expect(select.getAttribute("data-size")).toBe("sm");
		expect(wrapper?.getAttribute("data-size")).toBe("sm");
		expect(select.classList.contains("data-[size=sm]:h-7")).toBe(true);
	});

	it("routes className to the select, not the wrapper", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession" className="text-lg">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		const wrapper = screen.container.querySelector(
			'[data-slot="native-select-wrapper"]',
		);
		expect(select.classList.contains("text-lg")).toBe(true);
		expect(wrapper?.classList.contains("text-lg")).toBe(false);
	});

	it("routes wrapperClassName to the wrapper, not the select", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession" wrapperClassName="w-48">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		const wrapper = screen.container.querySelector(
			'[data-slot="native-select-wrapper"]',
		);
		expect(wrapper?.classList.contains("w-48")).toBe(true);
		expect(select.classList.contains("w-48")).toBe(false);
	});

	it("dims the whole control via the wrapper when disabled", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession" disabled>
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		const wrapper = screen.container.querySelector(
			'[data-slot="native-select-wrapper"]',
		);
		expect(select.hasAttribute("disabled")).toBe(true);
		expect(
			wrapper?.classList.contains("has-[select:disabled]:opacity-50"),
		).toBe(true);
		expect(select.classList.contains("disabled:cursor-not-allowed")).toBe(true);
	});

	it("marks invalid state for the destructive styles", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession" aria-invalid>
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.getAttribute("aria-invalid")).toBe("true");
		expect(select.classList.contains("aria-invalid:border-destructive")).toBe(
			true,
		);
		expect(select.classList.contains("aria-invalid:ring-3")).toBe(true);
	});

	it("opts the native picker into the dark color scheme", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession">
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.classList.contains("dark:scheme-dark")).toBe(true);
	});

	it("selects the controlled value and reports changes", () => {
		const onChange = vi.fn();
		const screen = render(
			<NativeSelect.Root
				aria-label="Profession"
				value="designer"
				onChange={onChange}
			>
				<NativeSelect.Option value="developer">Developer</NativeSelect.Option>
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", {
			name: "Profession",
		}) as HTMLSelectElement;
		expect(select.value).toBe("designer");
		fireEvent.change(select, { target: { value: "developer" } });
		expect(onChange).toHaveBeenCalled();
	});

	it("passes native attributes through to the select", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession" name="profession" required>
				<NativeSelect.Option value="designer">Designer</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.getAttribute("name")).toBe("profession");
		expect(select.hasAttribute("required")).toBe(true);
	});

	it("renders options and groups with their slot attributes", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Category" defaultValue="design">
				<NativeSelect.OptGroup label="Creative">
					<NativeSelect.Option value="design">Design</NativeSelect.Option>
				</NativeSelect.OptGroup>
			</NativeSelect.Root>,
		);
		const option = screen.container.querySelector(
			'[data-slot="native-select-option"]',
		);
		const group = screen.container.querySelector(
			'[data-slot="native-select-optgroup"]',
		);
		expect(option?.tagName).toBe("OPTION");
		expect(group?.tagName).toBe("OPTGROUP");
		expect(group?.getAttribute("label")).toBe("Creative");
	});

	it("merges custom option classes over the defaults", () => {
		const screen = render(
			<NativeSelect.Root aria-label="Profession">
				<NativeSelect.Option value="designer" className="font-bold">
					Designer
				</NativeSelect.Option>
			</NativeSelect.Root>,
		);
		const option = screen.container.querySelector(
			'[data-slot="native-select-option"]',
		);
		expect(option?.classList.contains("font-bold")).toBe(true);
		expect(option?.classList.contains("bg-[Canvas]")).toBe(true);
	});
});
