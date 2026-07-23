// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "#/components/ui/checkbox.tsx";

afterEach(cleanup);

const queryCheckbox = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=checkbox]");
const queryIndicator = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=checkbox-indicator]");

describe("Checkbox", () => {
	it("renders with the checkbox role, unchecked by default", () => {
		const screen = render(<Checkbox />);
		const control = screen.getByRole("checkbox");
		expect(control).toBeTruthy();
		expect(control.getAttribute("aria-checked")).toBe("false");
		expect(control.getAttribute("data-slot")).toBe("checkbox");
	});

	it("honours defaultChecked", () => {
		const screen = render(<Checkbox defaultChecked />);
		expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
			"true",
		);
	});

	it("toggles and fires onCheckedChange on click", () => {
		const onCheckedChange = vi.fn();
		const screen = render(<Checkbox onCheckedChange={onCheckedChange} />);
		const control = screen.getByRole("checkbox");
		fireEvent.click(control);
		expect(control.getAttribute("aria-checked")).toBe("true");
		expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
	});

	it("respects the controlled checked prop and does not self-toggle", () => {
		const screen = render(
			<Checkbox checked={false} onCheckedChange={() => {}} />,
		);
		const control = screen.getByRole("checkbox");
		fireEvent.click(control);
		// Parent ignored the change, so it stays unchecked.
		expect(control.getAttribute("aria-checked")).toBe("false");
	});

	it("does not toggle while disabled", () => {
		const onCheckedChange = vi.fn();
		const screen = render(
			<Checkbox disabled onCheckedChange={onCheckedChange} />,
		);
		const control = screen.getByRole("checkbox");
		expect(control.hasAttribute("data-disabled")).toBe(true);
		fireEvent.click(control);
		expect(onCheckedChange).not.toHaveBeenCalled();
		expect(control.getAttribute("aria-checked")).toBe("false");
	});

	it("dims via data-disabled, not the never-matching :disabled pseudo-class", () => {
		// Regression: Base UI renders the root as a plain <button> with
		// data-disabled (native disabled lands on the hidden input), so
		// `disabled:` variants never matched and disabled boxes stayed
		// full-opacity.
		const screen = render(<Checkbox disabled />);
		const control = queryCheckbox(screen);
		expect(control?.hasAttribute("disabled")).toBe(false);
		for (const cls of [
			"data-disabled:cursor-not-allowed",
			"data-disabled:opacity-50",
		]) {
			expect(control?.classList.contains(cls)).toBe(true);
		}
		expect(control?.classList.contains("disabled:opacity-50")).toBe(false);
	});

	it("exposes the indeterminate state as aria-checked=mixed", () => {
		const screen = render(<Checkbox indeterminate />);
		const control = screen.getByRole("checkbox");
		expect(control.getAttribute("aria-checked")).toBe("mixed");
		expect(control.hasAttribute("data-indeterminate")).toBe(true);
	});

	it("renders a dash instead of a checkmark when indeterminate", () => {
		const screen = render(<Checkbox indeterminate />);
		const icons = queryIndicator(screen)?.querySelectorAll("svg");
		expect(icons?.length).toBe(2);
		const [check, minus] = Array.from(icons ?? []);
		expect(
			check?.classList.contains("group-data-indeterminate/checkbox:hidden"),
		).toBe(true);
		expect(minus?.classList.contains("hidden")).toBe(true);
		expect(
			minus?.classList.contains("group-data-indeterminate/checkbox:block"),
		).toBe(true);
	});

	it("styles the indeterminate box like the checked box", () => {
		const screen = render(<Checkbox indeterminate />);
		const control = queryCheckbox(screen);
		for (const cls of [
			"data-indeterminate:border-primary",
			"data-indeterminate:bg-primary",
			"data-indeterminate:text-primary-foreground",
		]) {
			expect(control?.classList.contains(cls)).toBe(true);
		}
	});

	it("defaults to the default size", () => {
		const screen = render(<Checkbox />);
		expect(queryCheckbox(screen)?.getAttribute("data-size")).toBe("default");
	});

	it("applies the sm size as a data attribute", () => {
		const screen = render(<Checkbox size="sm" />);
		expect(queryCheckbox(screen)?.getAttribute("data-size")).toBe("sm");
	});

	it("sizes the box on the spacing scale per size variant", () => {
		const screen = render(<Checkbox />);
		const control = queryCheckbox(screen);
		for (const cls of [
			"data-[size=default]:size-4",
			"data-[size=sm]:size-3.5",
		]) {
			expect(control?.classList.contains(cls)).toBe(true);
		}
	});

	it("uses the tokenized radius, not a raw pixel value", () => {
		// Regression: `rounded-[4px]` was a raw radius off the token scale.
		const screen = render(<Checkbox />);
		const control = queryCheckbox(screen);
		expect(control?.classList.contains("rounded-sm")).toBe(true);
		expect(control?.classList.contains("rounded-[4px]")).toBe(false);
	});

	it("keeps invalid styling visible when checked", () => {
		// Regression: `aria-invalid:aria-checked:border-primary` silently
		// suppressed the invalid border once the box was checked.
		const screen = render(<Checkbox aria-invalid defaultChecked />);
		const control = screen.getByRole("checkbox");
		expect(control.getAttribute("aria-invalid")).toBe("true");
		expect(
			control.classList.contains("aria-invalid:aria-checked:border-primary"),
		).toBe(false);
		expect(control.classList.contains("aria-invalid:border-destructive")).toBe(
			true,
		);
	});

	it("animates the indicator in and respects reduced motion", () => {
		// Regression: the indicator was `transition-none`, so the checkmark
		// popped in while the box background faded.
		const screen = render(<Checkbox defaultChecked />);
		const indicator = queryIndicator(screen);
		for (const cls of [
			"animate-in",
			"zoom-in-50",
			"motion-reduce:animate-none",
		]) {
			expect(indicator?.classList.contains(cls)).toBe(true);
		}
		expect(indicator?.classList.contains("transition-none")).toBe(false);
	});

	it("merges className onto the root", () => {
		const screen = render(<Checkbox className="custom-checkbox" />);
		expect(queryCheckbox(screen)?.classList.contains("custom-checkbox")).toBe(
			true,
		);
	});
});
