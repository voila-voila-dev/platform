// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "#/components/ui/native-select.tsx";

afterEach(cleanup);

describe("NativeSelect", () => {
	it("renders a select with its slot attribute", () => {
		const screen = render(
			<NativeSelect aria-label="Profession">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.tagName).toBe("SELECT");
		expect(select.getAttribute("data-slot")).toBe("native-select");
	});

	it("renders a decorative caret overlay hidden from assistive tech", () => {
		const screen = render(
			<NativeSelect aria-label="Profession">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession" size="sm">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession" className="text-lg">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession" wrapperClassName="w-48">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession" disabled>
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession" aria-invalid>
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
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
			<NativeSelect aria-label="Profession">
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.classList.contains("dark:scheme-dark")).toBe(true);
	});

	it("selects the controlled value and reports changes", () => {
		const onChange = vi.fn();
		const screen = render(
			<NativeSelect aria-label="Profession" value="nurse" onChange={onChange}>
				<NativeSelectOption value="physiotherapist">
					Physiotherapist
				</NativeSelectOption>
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
		);
		const select = screen.getByRole("combobox", {
			name: "Profession",
		}) as HTMLSelectElement;
		expect(select.value).toBe("nurse");
		fireEvent.change(select, { target: { value: "physiotherapist" } });
		expect(onChange).toHaveBeenCalled();
	});

	it("passes native attributes through to the select", () => {
		const screen = render(
			<NativeSelect aria-label="Profession" name="profession" required>
				<NativeSelectOption value="nurse">Nurse</NativeSelectOption>
			</NativeSelect>,
		);
		const select = screen.getByRole("combobox", { name: "Profession" });
		expect(select.getAttribute("name")).toBe("profession");
		expect(select.hasAttribute("required")).toBe(true);
	});

	it("renders options and groups with their slot attributes", () => {
		const screen = render(
			<NativeSelect aria-label="Sport" defaultValue="rugby">
				<NativeSelectOptGroup label="Team sports">
					<NativeSelectOption value="rugby">Rugby</NativeSelectOption>
				</NativeSelectOptGroup>
			</NativeSelect>,
		);
		const option = screen.container.querySelector(
			'[data-slot="native-select-option"]',
		);
		const group = screen.container.querySelector(
			'[data-slot="native-select-optgroup"]',
		);
		expect(option?.tagName).toBe("OPTION");
		expect(group?.tagName).toBe("OPTGROUP");
		expect(group?.getAttribute("label")).toBe("Team sports");
	});

	it("merges custom option classes over the defaults", () => {
		const screen = render(
			<NativeSelect aria-label="Profession">
				<NativeSelectOption value="nurse" className="font-bold">
					Nurse
				</NativeSelectOption>
			</NativeSelect>,
		);
		const option = screen.container.querySelector(
			'[data-slot="native-select-option"]',
		);
		expect(option?.classList.contains("font-bold")).toBe(true);
		expect(option?.classList.contains("bg-[Canvas]")).toBe(true);
	});
});
