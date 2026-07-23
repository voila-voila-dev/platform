// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Slider, SliderValue } from "#/components/ui/slider.tsx";

afterEach(cleanup);

function queryThumbs(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelectorAll("[data-slot=slider-thumb]");
}

describe("Slider", () => {
	it("renders a single thumb for a scalar default value", () => {
		const screen = render(<Slider defaultValue={50} />);
		expect(queryThumbs(screen).length).toBe(1);
		// The thumb stays visibility:hidden in jsdom (no layout), so query
		// the underlying range input rather than the "slider" role.
		const input = screen.baseElement.querySelector("input");
		expect(input?.getAttribute("aria-valuenow")).toBe("50");
	});

	it("renders a single thumb at min when uncontrolled with no default", () => {
		const screen = render(<Slider min={10} max={20} />);
		expect(queryThumbs(screen).length).toBe(1);
		const input = screen.baseElement.querySelector("input");
		expect(input?.getAttribute("aria-valuenow")).toBe("10");
	});

	it("renders one thumb per value for a range", () => {
		const screen = render(<Slider defaultValue={[35, 65]} />);
		expect(queryThumbs(screen).length).toBe(2);
	});

	it("renders the track and range slots", () => {
		const screen = render(<Slider defaultValue={50} />);
		expect(
			screen.baseElement.querySelector("[data-slot=slider-track]"),
		).not.toBeNull();
		expect(
			screen.baseElement.querySelector("[data-slot=slider-range]"),
		).not.toBeNull();
	});

	it("marks every part disabled through data attributes", () => {
		const screen = render(<Slider defaultValue={30} disabled />);
		const root = screen.baseElement.querySelector("[data-slot=slider]");
		expect(root?.hasAttribute("data-disabled")).toBe(true);
		const thumb = queryThumbs(screen)[0];
		expect(thumb?.hasAttribute("data-disabled")).toBe(true);
	});

	it("emits the vertical orientation on the root", () => {
		const screen = render(<Slider defaultValue={50} orientation="vertical" />);
		const root = screen.baseElement.querySelector("[data-slot=slider]");
		expect(root?.getAttribute("data-orientation")).toBe("vertical");
	});

	it("merges className onto the root", () => {
		const screen = render(
			<Slider defaultValue={50} className="custom-slider" />,
		);
		const root = screen.baseElement.querySelector("[data-slot=slider]");
		expect(root?.classList.contains("custom-slider")).toBe(true);
	});

	it("renders a value readout through SliderValue children", () => {
		const screen = render(
			<Slider defaultValue={[35, 65]}>
				<SliderValue data-testid="readout" />
			</Slider>,
		);
		const readout = screen.getByTestId("readout");
		expect(readout.getAttribute("data-slot")).toBe("slider-value");
		expect(readout.textContent).toContain("35");
		expect(readout.textContent).toContain("65");
	});
});
