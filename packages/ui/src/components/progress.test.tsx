// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
	Progress,
	ProgressLabel,
	ProgressValue,
} from "#/components/progress.tsx";

afterEach(cleanup);

describe("Progress", () => {
	it("exposes progressbar semantics for a determinate value", () => {
		const screen = render(<Progress value={35} />);
		const root = screen.getByRole("progressbar");
		expect(root.getAttribute("aria-valuenow")).toBe("35");
		expect(root.getAttribute("aria-valuemin")).toBe("0");
		expect(root.getAttribute("aria-valuemax")).toBe("100");
	});

	it("renders the track and indicator slots", () => {
		const screen = render(<Progress value={35} />);
		expect(
			screen.baseElement.querySelector("[data-slot=progress-track]"),
		).not.toBeNull();
		expect(
			screen.baseElement.querySelector("[data-slot=progress-indicator]"),
		).not.toBeNull();
	});

	it("sizes the indicator from the value", () => {
		const screen = render(<Progress value={35} />);
		const indicator = screen.baseElement.querySelector(
			"[data-slot=progress-indicator]",
		);
		expect(indicator).toBeInstanceOf(HTMLElement);
		expect((indicator as HTMLElement).style.width).toBe("35%");
	});

	it("marks the parts indeterminate when value is null", () => {
		const screen = render(<Progress value={null} />);
		const root = screen.baseElement.querySelector("[data-slot=progress]");
		expect(root?.hasAttribute("data-indeterminate")).toBe(true);
		const indicator = screen.baseElement.querySelector(
			"[data-slot=progress-indicator]",
		);
		expect(indicator?.hasAttribute("data-indeterminate")).toBe(true);
		// No inline width: the data-indeterminate animation drives the bar.
		expect((indicator as HTMLElement).style.width).toBe("");
	});

	it("marks the root complete at the maximum value", () => {
		const screen = render(<Progress value={100} />);
		const root = screen.baseElement.querySelector("[data-slot=progress]");
		expect(root?.hasAttribute("data-complete")).toBe(true);
	});

	it("labels the bar through ProgressLabel", () => {
		const screen = render(
			<Progress value={35}>
				<ProgressLabel>Profile completion</ProgressLabel>
			</Progress>,
		);
		const root = screen.getByRole("progressbar");
		const label = screen.baseElement.querySelector(
			"[data-slot=progress-label]",
		);
		expect(label?.id).not.toBe("");
		expect(root.getAttribute("aria-labelledby")).toBe(label?.id);
	});

	it("renders the formatted value through ProgressValue", () => {
		const screen = render(
			<Progress value={35}>
				<ProgressValue data-testid="readout" />
			</Progress>,
		);
		const readout = screen.getByTestId("readout");
		expect(readout.getAttribute("data-slot")).toBe("progress-value");
		expect(readout.textContent).toBe("35%");
	});

	it("renders a custom value through the ProgressValue render function", () => {
		const screen = render(
			<Progress value={1200} max={2000}>
				<ProgressValue data-testid="readout">
					{(_, value) => `${value} / 2000 MB`}
				</ProgressValue>
			</Progress>,
		);
		expect(screen.getByTestId("readout").textContent).toBe("1200 / 2000 MB");
	});

	it("styles the root, track and indicator through className props", () => {
		const screen = render(
			<Progress
				value={35}
				className="custom-root"
				trackClassName="custom-track"
				indicatorClassName="custom-indicator"
			/>,
		);
		const root = screen.baseElement.querySelector("[data-slot=progress]");
		expect(root?.classList.contains("custom-root")).toBe(true);
		const track = screen.baseElement.querySelector(
			"[data-slot=progress-track]",
		);
		expect(track?.classList.contains("custom-track")).toBe(true);
		const indicator = screen.baseElement.querySelector(
			"[data-slot=progress-indicator]",
		);
		expect(indicator?.classList.contains("custom-indicator")).toBe(true);
	});
});
