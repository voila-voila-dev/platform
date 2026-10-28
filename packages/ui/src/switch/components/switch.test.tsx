// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Switch } from "#/switch/components/switch.tsx";

afterEach(cleanup);

const querySwitch = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=switch]");
const queryThumb = (screen: ReturnType<typeof render>) =>
	screen.baseElement.querySelector("[data-slot=switch-thumb]");

describe("Switch", () => {
	it("renders with the switch role, unchecked by default", () => {
		const screen = render(<Switch />);
		const control = screen.getByRole("switch");
		expect(control).toBeTruthy();
		expect(control.getAttribute("aria-checked")).toBe("false");
		expect(control.getAttribute("data-slot")).toBe("switch");
	});

	it("honours defaultChecked", () => {
		const screen = render(<Switch defaultChecked />);
		expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
			"true",
		);
	});

	it("toggles and fires onCheckedChange on click", () => {
		const onCheckedChange = vi.fn();
		const screen = render(<Switch onCheckedChange={onCheckedChange} />);
		const control = screen.getByRole("switch");
		fireEvent.click(control);
		expect(control.getAttribute("aria-checked")).toBe("true");
		expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
	});

	it("respects the controlled checked prop and does not self-toggle", () => {
		const screen = render(
			<Switch checked={false} onCheckedChange={() => {}} />,
		);
		const control = screen.getByRole("switch");
		fireEvent.click(control);
		// Parent ignored the change, so it stays unchecked.
		expect(control.getAttribute("aria-checked")).toBe("false");
	});

	it("defaults to the default size", () => {
		const screen = render(<Switch />);
		const control = querySwitch(screen);
		expect(control?.getAttribute("data-size")).toBe("default");
	});

	it("applies the sm size as a data attribute", () => {
		const screen = render(<Switch size="sm" />);
		expect(querySwitch(screen)?.getAttribute("data-size")).toBe("sm");
	});

	it("expresses track dimensions on the spacing scale, not magic pixels", () => {
		// Regression: `w-[32px]`/`h-[18.4px]`/`w-[24px]`/`h-[14px]` were off-scale.
		const screen = render(<Switch />);
		const control = querySwitch(screen);
		for (const scaled of [
			"data-[size=default]:w-8",
			"data-[size=default]:h-[1.15rem]",
			"data-[size=sm]:w-6",
			"data-[size=sm]:h-3.5",
		]) {
			expect(control?.classList.contains(scaled)).toBe(true);
		}
		for (const magic of [
			"data-[size=default]:w-[32px]",
			"data-[size=default]:h-[18.4px]",
			"data-[size=sm]:w-[24px]",
			"data-[size=sm]:h-[14px]",
		]) {
			expect(control?.classList.contains(magic)).toBe(false);
		}
	});

	it("gives the unchecked track a visible border for contrast", () => {
		const screen = render(<Switch />);
		expect(
			querySwitch(screen)?.classList.contains("data-unchecked:border-input"),
		).toBe(true);
	});

	it("respects reduced motion on both the track and the thumb", () => {
		const screen = render(<Switch />);
		expect(
			querySwitch(screen)?.classList.contains("motion-reduce:transition-none"),
		).toBe(true);
		expect(
			queryThumb(screen)?.classList.contains("motion-reduce:transition-none"),
		).toBe(true);
	});

	it("drops the no-op ring-0 from the thumb", () => {
		const screen = render(<Switch />);
		expect(queryThumb(screen)?.classList.contains("ring-0")).toBe(false);
	});

	it("does not toggle while disabled", () => {
		const onCheckedChange = vi.fn();
		const screen = render(
			<Switch disabled onCheckedChange={onCheckedChange} />,
		);
		const control = screen.getByRole("switch");
		expect(control.hasAttribute("data-disabled")).toBe(true);
		fireEvent.click(control);
		expect(onCheckedChange).not.toHaveBeenCalled();
		expect(control.getAttribute("aria-checked")).toBe("false");
	});

	it("reflects aria-invalid for invalid-state styling", () => {
		const screen = render(<Switch aria-invalid />);
		expect(screen.getByRole("switch").getAttribute("aria-invalid")).toBe(
			"true",
		);
	});

	it("merges className onto the root", () => {
		const screen = render(<Switch className="custom-switch" />);
		expect(querySwitch(screen)?.classList.contains("custom-switch")).toBe(true);
	});
});
